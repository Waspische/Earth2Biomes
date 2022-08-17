/* eslint-disable no-bitwise,no-param-reassign,class-methods-use-this */
import * as turf from '@turf/turf'
import polygonClipping from 'polygon-clipping'
import tilePolygonHelper from '@/utils/tilePolygonHelper'

const r2d = 180 / Math.PI

const PRECISION = 6
const GRID_ZOOM = 21

const toRad = num => (num * Math.PI) / 180

const getCentralValueOfArray = ary =>
  ary[Math.round(ary.length / 2) - (ary.length % 2 === 0 ? 0 : 1)]

class MapUtils {
  // returns the bit array representing a specific number
  bits (n, b = 32) {
    // n = number, b = number of bits to extract
    return [...Array(b)].map((_, idx, arr) => (n >> (arr.length - idx - 1)) & 1)
  }

  // Adaptation of the well-known algorithm to calculate unique keys that represent
  // tiles in a quadtree grid for geo-coordinates. The standard algorithm produces
  // strings with a size that equals to the zoom level (ex.: 21 zoom => 21 character
  // string) with each character being a digit representation between 0 and 3. Since
  // we only need 2 bits to represent each of these numbers, we can compress the data
  // into a smaller integer and still have some space to add other metadata. In this
  // specific case, we're appending the size (21) to the end of the produced integer
  //
  // Original implementation: https://github.com/mapbox/tilebelt
  tileToQuadkeyCompress (tile) {
    let bitmap = []

    for (let z = tile[2]; z > 0; z--) {
      // apply the mask as per the original algorithm
      let digit = 0
      const mask = 1 << (z - 1)
      if ((tile[0] & mask) !== 0) { digit = 1 }
      if ((tile[1] & mask) !== 0) { digit += 2 }
      // add only the desired 2 bits to the bit map
      bitmap = bitmap.concat(this.bits(digit, 2))
    }

    // creates an integer based on the obtained bitmap and append the size (for decompression)
    return bitmap.reduce((res, val, idx) => res + val * 2 ** idx) * 100 + tile[2]
  }

  // Gets the tile for a compressed quadkey int the original tile format
  quadkeyCompressToTile (quadkey) {
    let x = 0
    let y = 0
    const z = quadkey % 100 // extract the size

    // split the integer into the bit array without the appended size
    quadkey = Math.trunc(quadkey / 100)
      .toString(2)
      .split('')
    // based on the extracted size, pad the bit array if needed
    if (quadkey.length < z * 2) {
      quadkey = Array(z * 2 - quadkey.length)
        .fill('0')
        .concat(quadkey)
    }

    // going in reverse order in the bit array, extract each pair to decode the value and
    // then apply the original unmask algo
    for (let i = quadkey.length - 1; i > 0; --i) {
      // extract the digit from each bit pair
      const digit = +quadkey[i--] * 2 + +quadkey[i]
      // apply the mask as per the original algorithm
      const mask = 1 << Math.floor(i / 2)

      if (digit === 1) {
        x |= mask
      } else if (digit === 2) {
        y |= mask
      } else if (digit === 3) {
        x |= mask
        y |= mask
      }
    }

    return [x, y, z]
  }

  // get a map projection from the current window viewport
  projectWindow (glMap, selector) {
    const elem = document.querySelector(selector)
    const factor = 1

    return [
      [0, 0],
      [0, elem.width() * factor],
      [elem.height() * factor, elem.width() * factor],
      [elem.height() * factor, 0],
      [0, 0]
    ]
      .map(r => r.reverse())
      .map(coords => glMap.unproject(coords))
      .map(({ lng, lat }) => [lng, lat])
  }

  // creates a bbox from the supplied point
  bboxify (point, factor) {
    return [
      [point.x - factor, point.y - factor],
      [point.x + factor, point.y + factor]
    ]
  }

  tileToLngLat (x, y, z) {
    const lng = this.tile2lon(x, z)
    const lat = this.tile2lat(y, z)

    return [+lng.toFixed(PRECISION), +lat.toFixed(PRECISION)]
  }

  tile2lon (x, z) {
    return (x / Math.pow(2, z)) * 360 - 180
  }

  tile2lat (y, z) {
    const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z)

    return r2d * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
  }

  getXYFromCoordinates (latlon /* [number, number] */, zoom) {
    const lat = latlon[0]
    const lon = latlon[1]

    const xtile = parseInt(Math.floor(((lon + 180) / 360) * Math.pow(2, zoom)), 10)
    const ytile = parseInt(
      Math.floor(
        ((1 - Math.log(Math.tan(toRad(lat)) + 1 / Math.cos(toRad(lat))) / Math.PI) / 2) *
          Math.pow(2, zoom)
      ),
      10
    )

    return [xtile, ytile]
  }

  quadkeyCompressToLngLat (tileKey) {
    const tile = this.quadkeyCompressToTile(tileKey)

    return this.tileToLngLat(tile[0], tile[1], tile[2])
  }

  quadkeyToBbox (tileKey) {
    const tile = this.quadkeyCompressToTile(tileKey)

    return tilePolygonHelper.bbox(tile[0], tile[1], tile[2])
  }

  quadkeysToPolygon (tileKeys) {
    const coordinates = polygonClipping.union(
      ...tileKeys.map((x) => {
        const bbox = this.quadkeyToBbox(x)

        return [
          [
            [bbox[0], bbox[1]],
            [bbox[0], bbox[3]],
            [bbox[2], bbox[3]],
            [bbox[2], bbox[1]]
          ]
        ]
      })
    )

    if (coordinates.length === 0) { return null }

    return coordinates.length === 1 ? turf.polygon(coordinates[0]) : turf.multiPolygon(coordinates)
  }

  lngLatArrayToString (lngLatArray) {
    return lngLatArray.map(e => `${e}`.substring(0, 9)).join(', ')
  }

  quadkeyCompressToLngLatString (tileKey) {
    return this.lngLatArrayToString(this.quadkeyCompressToLngLat(tileKey).reverse())
  }

  getCenterCoordinatesForCompressedQuadkeys (quadkeyArray) {
    if (quadkeyArray.length === 1) {
      return this.quadkeyCompressToLngLat(quadkeyArray[0])
    }

    const points = []

    // eslint-disable-next-line guard-for-in
    for (const idx in quadkeyArray) {
      points.push(turf.point(this.quadkeyCompressToLngLat(quadkeyArray[idx])))
    }

    if (points.length > 0) {
      const fts = turf.featureCollection(points)
      const coord = turf.center(fts).geometry.coordinates

      return [+coord[0].toFixed(PRECISION), +coord[1].toFixed(PRECISION)]
    }

    return [0, 0]
  }

  getCenterCoordinatesForCompressedQuadkeysString (quadkeyArray) {
    return this.lngLatArrayToString(this.getCenterCoordinatesForCompressedQuadkeys(quadkeyArray))
  }

  isUUID (str) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str)
  }

  convertZoom (quadkey, zoom) {
    const tile = this.quadkeyCompressToTile(quadkey)

    const zoomDif = zoom - tile[2]
    const multiplier = Math.pow(2, zoomDif)
    tile[0] = Math.floor(tile[0] * multiplier)
    tile[1] = Math.floor(tile[1] * multiplier)
    tile[2] = zoom

    const ret = []

    if (zoomDif > 0) {
      for (let a = 0; a < multiplier; ++a) {
        for (let b = 0; b < multiplier; ++b) {
          ret.push([tile[0] + a, tile[1] + b, zoom])
        }
      }
    } else {
      ret.push(tile)
    }

    return ret.map(t => this.tileToQuadkeyCompress(t))
  }

  // return array of tiles to fit a given bounding box specified by longlat.
  getTilesForBounds ([[x1, y1], [x2, y2]], zoom) {
    const [tilex1, tiley1] = this.getXYFromCoordinates([y1, x1], zoom)
    const [tilex2, tiley2] = this.getXYFromCoordinates([y2, x2], zoom)
    const tiles = []

    for (let tilex = tilex1; tilex <= tilex2; ++tilex) {
      for (let tiley = tiley2; tiley <= tiley1; ++tiley) {
        tiles.push([tilex, tiley, zoom, this.tileToQuadkeyCompress([tilex, tiley, zoom])])
      }
    }

    return tiles
  }

  getTilesForBoundsMapped ([[x1, y1], [x2, y2]], zoom) {
    const [tilex1, tiley1] = this.getXYFromCoordinates([y1, x1], zoom)
    const [tilex2, tiley2] = this.getXYFromCoordinates([y2, x2], zoom)
    const tiles = []

    for (let tilex = tilex1; tilex <= tilex2; ++tilex) {
      for (let tiley = tiley2; tiley <= tiley1; ++tiley) {
        tiles.push({
          tileId: this.tileToQuadkeyCompress([tilex, tiley, zoom]),
          x: tilex,
          y: tiley,
          z: zoom
        })
      }
    }

    return tiles
  }

  getTileLengthForPoint (coords) {
    const bbox = turf.bbox(
      turf.buffer(turf.point(coords), 10, {
        steps: 1,
        units: 'meters'
      })
    )

    return this.getTileLength(bbox)
  }

  getTileLength (tileBbox) {
    const tilex = this.getXYFromCoordinates([tileBbox[1], tileBbox[0]], GRID_ZOOM)[0]
    const tiley = this.getXYFromCoordinates([tileBbox[3], tileBbox[2]], GRID_ZOOM)[1]
    const tile = tilePolygonHelper.bbox(tilex, tiley, GRID_ZOOM)

    return turf.distance([tile[0], tile[1]], [tile[0], tile[3]], { units: 'meters' })
  }

  // TODO: not used anymore, keep for the time being
  getRealCenter (tileIds) {
    if (!tileIds?.length) { return null }
    const features = tileIds.map(x =>
      turf.bboxPolygon(turf.bbox(turf.point(this.quadkeyCompressToLngLat(x))))
    )
    const tilesCenters = features.map(x => turf.center(x).geometry.coordinates)
    const axises = tilesCenters.reduce(
      (acc, curr) => {
        if (!acc.x.includes(curr[0])) { acc.x.push(curr[0]) }
        if (!acc.y.includes(curr[1])) { acc.y.push(curr[1]) }

        return acc
      },
      { x: [], y: [] }
    )
    const biggestAxis = axises.x.length >= axises.y.length ? 'x' : 'y'
    const centerOfBiggestAxis = getCentralValueOfArray(
      axises[biggestAxis].slice().sort((a, b) => a - b)
    )

    const arrayAccessor = biggestAxis === 'x' ? 0 : 1
    const oppositeArrayAccessor = biggestAxis === 'x' ? 1 : 0
    const accordingCoords = tilesCenters.filter(x => x[arrayAccessor] === centerOfBiggestAxis)

    return getCentralValueOfArray(
      accordingCoords.slice().sort((a, b) => a[oppositeArrayAccessor] - b[oppositeArrayAccessor])
    )
  }

  getBboxForPolygons (polygons) {
    const bigPoly = polygonClipping.union(...polygons.map(e => e.geometry.coordinates))
    return turf.bbox(turf.multiPolygon(bigPoly))
  }

  getArea (polygons) {
    const bigPoly = polygonClipping.union(...polygons.map(e => e.geometry.coordinates))
    return turf.area(turf.multiPolygon(bigPoly))
  }
}

const mapUtils = new MapUtils()
export default mapUtils
