export default {
  menu: {
    home: 'Home',
    cities: 'Cities',
    cityMap: 'Map',
    leaderboard: 'Leaderboard',
    resources: 'Resources',
    resourceMap: 'Map',
    blueDots: 'Blue dots'
  },
  index: {
    title: 'Earth2Biomes',
    subtitle: 'Aiming to provide the biggest open source of information that are NOT available in Earth2',
    mainFeatures: {
      title: 'Main Features',
      leaderboard: 'Leaderboard',
      leaderboardDescription: 'Ever wonder what was the biggest cities around Earth2? Find the answer now!',
      leaderboardButton: 'Leaderboard',
      statistics: 'Statistics',
      statisticsDescription: 'As a city owner, you may be interested in knowing if your city keep growing. You will find the size of the city, number of players and your best players.',
      statisticsButton: 'City map',
      propertiesForSale: 'Properties for sale',
      propertiesForSaleDescription: 'As a player, you can check the offers on the marketplace located in the city you want.',
      propertiesButton: 'Properties for sale'
    },
    someStats: {
      title: 'Some stats',
      megacitiesDescription: 'MegaCities available with their links to Earth2 location, website and Discord server',
      megacitiesButton: 'City map',
      blueDotsDescription: 'Blue dots ! They appeared during less than 1 hour on earth2.io all over the map, representing data from the US Mineral Resource Data System',
      blueDotsButton: 'Blue dots',
      resourcesDescription: 'Resource types from different sources including the most mined minerals from Earth 1',
      resourcesButton: 'Resources Map'
    },
    ourPartners: {
      title: 'Our partners',
      agvDescription: 'Alchera Global Venture is an earth2.io community with high ambitions. And a ❤ for sea lions.',
      agvButton: 'Join AGV',
      RDDescription: 'Resources District is the Earth2 largest mining network and the place to trade resources.',
      RDButton: 'Join Resources Disctrict'
    },
    referalCode: {
      question: 'Do you appreciate the content here ?',
      message: 'Support me using the code <span class="primary--text font-weight-bold"> wasp</span> when buying tiles and get a 7,5% discount in game'
    }
  },
  cities: {
    showButton: 'Show city list',
    modalTitle: 'Earth2 Cities',
    modalInfo: 'You can submit your own city here to contribute to the Cities Database. Every contribution will be reviewed.',
    modalLoading: 'Loading... Please wait',
    modalSearch: 'Search city name or group',
    newCityButton: 'New city',
    moreInfoButton: 'More info',
    closeButton: 'Close',
    saveMessage: 'Thank you for your contribution ! I\'ll review it as soon as possible.',
    mapDetails: 'Click for details',
    newCityModal: {
      editTitle: 'Edit City',
      createTitle: 'New City',
      name: 'Name',
      group: 'Group',
      propertyUrl: 'Property URL',
      discordServer: 'Discord Server',
      website: 'Website',
      description: 'Description',
      cancelButton: 'Cancel',
      saveButton: 'Save'
    }
  },
  city: {
    cityGroup: ' - This city is part of ',
    lastUpdated: 'Last updated on',
    location: 'Location',
    e2Location: 'Earth2 Location',
    noDescription: 'No description available.',
    propertiesForSale: 'Properties for sale',
    updateMessage: 'Updated almost every week',
    buyButton: 'Buy',
    numberOfTiles: 'Number of tiles owned',
    numberOfPlayers: 'Number of players',
    classDistribution: 'Class distribution',
    top10Players: 'Top 10 players',
    noDataYet: 'No data yet...',
    noPlayerInfo: 'No player info yet'
  },
  leaderboard: {
    title: 'Best City projects',
    yourCity: 'Your city here',
    contactMessage: 'Contact me on discord to promote your city! Wasp#1975',
    discoverButton: 'Discover',
    algorithmMessage: 'The algorithm calculate the size starting from the center tile of the city until the number of tiles sold reach a threshold. That\'s why close cities can \'merge\' and have a combined number of tiles with other cities. Tile plot far from the city may be ignored.',
    leaderboardTitle: 'Cities leaderboard',
    tiles: 'tiles'
  },
  footer: {
    supportMessage: 'If you like this project, support me using the code <strong>wasp</strong> to get 7.5% discount or <a target="_blank" rel="noopener noreferrer" href="https://ko-fi.com/earth2biomes" @click="trackFooterClick(\'kofi\')">buy me a coffee ☕️</a>',
    contactMessage: 'To submit an idea/bug, you can contact me on Discord ->  Wasp#1975'
  }
}
