import * as turf from '@turf/turf'

class TilePolygonHelper {
  constructor (options) {
    this.PRECISION = 6
    this.cache = {}
    this.D2R = Math.PI / 180
    this.R2D = 180 / Math.PI
    this.A = 6378137.0
    this.MAXEXTENT = 20037508.342789244

    options = options || {}
    this.size = options.size || 256

    if (!this.cache[this.size]) {
      let { size } = this
      // eslint-disable-next-line no-multi-assign
      const c = (this.cache[this.size] = {})
      c.Bc = []
      c.Cc = []
      c.zc = []
      c.Ac = []

      for (let d = 0; d < 30; d++) {
        c.Bc.push(size / 360)
        c.Cc.push(size / (2 * Math.PI))
        c.zc.push(size / 2)
        c.Ac.push(size)
        size *= 2
      }
    }

    this.Bc = this.cache[this.size].Bc
    this.Cc = this.cache[this.size].Cc
    this.zc = this.cache[this.size].zc
    this.Ac = this.cache[this.size].Ac
  }

  toRad (num) {
    return (num * Math.PI) / 180
  }

  isFloat (n) {
    return Number(n) === n && n % 1 !== 0
  }

  // Convert lon lat to screen pixel value
  //
  // - `ll` {Array} `[lon, lat]` array of geographic coordinates.
  // - `zoom` {Number} zoom level.
  px (ll, zoom) {
    if (this.isFloat(zoom)) {
      const size = this.size * Math.pow(2, zoom)
      const d = size / 2
      const bc = size / 360
      const cc = size / (2 * Math.PI)
      const ac = size
      const f = Math.min(Math.max(Math.sin(this.D2R * ll[1]), -0.9999), 0.9999)
      let x = d + ll[0] * bc
      let y = d + 0.5 * Math.log((1 + f) / (1 - f)) * -cc
      x > ac && (x = ac)
      y > ac && (y = ac)

      // (x < 0) && (x = 0);
      // (y < 0) && (y = 0);
      return [x, y]
    }

    const d = this.zc[zoom]
    const f = Math.min(Math.max(Math.sin(this.D2R * ll[1]), -0.9999), 0.9999)
    let x = Math.round(d + ll[0] * this.Bc[zoom])
    let y = Math.round(d + 0.5 * Math.log((1 + f) / (1 - f)) * -this.Cc[zoom])
    x > this.Ac[zoom] && (x = this.Ac[zoom])
    y > this.Ac[zoom] && (y = this.Ac[zoom])

    // (x < 0) && (x = 0);
    // (y < 0) && (y = 0);
    return [x, y]
  }

  // Convert screen pixel value to lon lat
  //
  // - `px` {Array} `[x, y]` array of geographic coordinates.
  // - `zoom` {Number} zoom level.
  ll (px, zoom) {
    if (this.isFloat(zoom)) {
      const size = this.size * Math.pow(2, zoom)
      const bc = size / 360
      const cc = size / (2 * Math.PI)
      const zc = size / 2
      const g = (px[1] - zc) / -cc
      const lon = (px[0] - zc) / bc
      const lat = this.R2D * (2 * Math.atan(Math.exp(g)) - 0.5 * Math.PI)

      return [lon, lat]
    }

    const g = (px[1] - this.zc[zoom]) / -this.Cc[zoom]
    const lon = (px[0] - this.zc[zoom]) / this.Bc[zoom]
    const lat = this.R2D * (2 * Math.atan(Math.exp(g)) - 0.5 * Math.PI)

    return [lon, lat]
  }

  // Convert tile xyz value to bbox of the form `[w, s, e, n]`
  //
  // - `x` {Number} x (longitude) number.
  // - `y` {Number} y (latitude) number.
  // - `zoom` {Number} zoom.
  // - `tms_style` {Boolean} whether to compute using tms-style.
  // - `srs` {String} projection for resulting bbox (WGS84|900913).
  // - `return` {Array} bbox array of values in form `[w, s, e, n]`.
  bbox (x, y, zoom, tmsStyle, srs) {
    if (tmsStyle) {
      y = Math.pow(2, zoom) - 1 - y
    }

    // Use +y to make sure it's a number to avoid inadvertent concatenation.
    const ll = [x * this.size, (+y + 1) * this.size] // lower left
    // Use +x to make sure it's a number to avoid inadvertent concatenation.
    const ur = [(+x + 1) * this.size, y * this.size] // upper right
    const bbox = this.ll(ll, zoom).concat(this.ll(ur, zoom))

    // If web mercator requested reproject to 900913.
    if (srs === '900913') {
      return this.convert(bbox, '900913')
    }

    return bbox
  }

  // Convert bbox to xyx bounds
  //
  // - `bbox` {Number} bbox in the form `[w, s, e, n]`.
  // - `zoom` {Number} zoom.
  // - `tms_style` {Boolean} whether to compute using tms-style.
  // - `srs` {String} projection of input bbox (WGS84|900913).
  // - `@return` {Object} XYZ bounds containing minX, maxX, minY, maxY properties.

  xyz (bbox, zoom, tmsStyle, srs) {
    // If web mercator provided reproject to WGS84.
    if (srs === '900913') {
      bbox = this.convert(bbox, 'WGS84')
    }

    const ll = [bbox[0], bbox[1]] // lower left
    const ur = [bbox[2], bbox[3]] // upper right
    const pxLl = this.px(ll, zoom)
    const pxUr = this.px(ur, zoom)
    // Y = 0 for XYZ is the top hence minY uses pxUr[1].
    const x = [Math.floor(pxLl[0] / this.size), Math.floor((pxUr[0] - 1) / this.size)]
    const y = [Math.floor(pxUr[1] / this.size), Math.floor((pxLl[1] - 1) / this.size)]

    const minX = Math.min(...x)
    const minY = Math.min(...y)

    const bounds = {
      maxX: Math.max(...x),
      maxY: Math.max(...y),
      minX: minX < 0 ? 0 : minX,
      minY: minY < 0 ? 0 : minY
    }

    if (tmsStyle) {
      const tms = {
        maxY: Math.pow(2, zoom) - 1 - bounds.minY,
        minY: Math.pow(2, zoom) - 1 - bounds.maxY
      }

      bounds.minY = tms.minY
      bounds.maxY = tms.maxY
    }

    return bounds
  }

  // Convert projection of given bbox.
  //
  // - `bbox` {Number} bbox in the form `[w, s, e, n]`.
  // - `to` {String} projection of output bbox (WGS84|900913). Input bbox
  //   assumed to be the "other" projection.
  // - `@return` {Object} bbox with reprojected coordinates.
  convert (bbox, to) {
    if (to === '900913') {
      return this.forward(bbox.slice(0, 2)).concat(this.forward(bbox.slice(2, 4)))
    }

    return this.inverse(bbox.slice(0, 2)).concat(this.inverse(bbox.slice(2, 4)))
  }

  // Convert lon/lat values to 900913 x/y.
  forward (ll) {
    const xy = [this.A * ll[0] * this.D2R, this.A * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * ll[1] * this.D2R))]
    // if xy value is beyond maxextent (e.g. poles), return maxextent.
    xy[0] > this.MAXEXTENT && (xy[0] = this.MAXEXTENT)
    xy[0] < -this.MAXEXTENT && (xy[0] = -this.MAXEXTENT)
    xy[1] > this.MAXEXTENT && (xy[1] = this.MAXEXTENT)
    xy[1] < -this.MAXEXTENT && (xy[1] = -this.MAXEXTENT)

    return xy
  }

  // Convert 900913 x/y values to lon/lat.
  inverse (xy) {
    return [(xy[0] * this.R2D) / this.A, (Math.PI * 0.5 - 2.0 * Math.atan(Math.exp(-xy[1] / this.A))) * this.R2D]
  }

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

  quadkeyToBbox (tileKey) {
    const tile = this.quadkeyCompressToTile(tileKey)

    return this.bbox(tile[0], tile[1], tile[2])
  }

  quadkeyToPolygon (tileIndex) {
    const bbox = this.quadkeyToBbox(tileIndex)
    // console.log("quadKeyToPolygon bbox: ", { bbox, tileIndex });

    const coordinates = [
      [
        [bbox[0], bbox[1]],
        [bbox[0], bbox[3]],
        [bbox[2], bbox[3]],
        [bbox[2], bbox[1]],
        [bbox[0], bbox[1]]
      ]
    ]
    // console.log("quadKeyToPolygon coordinates", coordinates);

    return turf.polygon(coordinates)
  }

  tileToLngLat (x, y, z) {
    const lng = this.tile2lon(x, z)
    const lat = this.tile2lat(y, z)

    return [+lng.toFixed(this.PRECISION), +lat.toFixed(this.PRECISION)]
  }

  tile2lon (x, z) {
    return (x / Math.pow(2, z)) * 360 - 180
  }

  tile2lat (y, z) {
    const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z)

    return this.R2D * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
  }

  getXYFromCoordinates (latlon /* [number, number] */, zoom) {
    const lat = latlon[0]
    const lon = latlon[1]

    const xtile = parseInt(Math.floor(((lon + 180) / 360) * Math.pow(2, zoom)), 10)
    const ytile = parseInt(
      Math.floor(
        ((1 - Math.log(Math.tan(this.toRad(lat)) + 1 / Math.cos(this.toRad(lat))) / Math.PI) / 2) *
                Math.pow(2, zoom)
      ),
      10
    )

    return [xtile, ytile]
  }

  getTileIndexFromLatLng (coordinatesNormal) {
    const xy = this.getXYFromCoordinates(coordinatesNormal.reverse(), 21)
    const tileIndex = tilePolygonHelper.tileToQuadkeyCompress([xy[0], xy[1], 21])
    return tileIndex
  }
}

const tilePolygonHelper = new TilePolygonHelper()
export default tilePolygonHelper
