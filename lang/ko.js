export default {
  menu: {
    home: '집',
    cities: '도시',
    cityMap: '지도',
    leaderboard: '리더보드',
    resources: '리소스',
    resourceMap: '지도',
    blueDots: '파란 점'
  },
  index: {
    title: 'Earth2Biomes',
    subtitle: 'Earth2에서 사용할 수 없는 가장 큰 오픈 소스 정보 제공을 목표로',
    mainFeatures: {
      title: '주요 기능',
      leaderboard: '리더보드',
      leaderboardDescription: 'Earth2 주변에서 가장 큰 도시가 무엇인지 궁금하신가요? 지금 답을 찾아라!',
      leaderboardButton: '리더보드',
      statistics: '통계',
      statisticsDescription: '도시 소유자로서 귀하의 도시가 계속 성장하는지 알고 싶어할 것입니다. 도시의 크기, 플레이어 수 및 최고의 플레이어를 찾을 수 있습니다.',
      statisticsButton: '도시 지도',
      propertiesForSale: '판매용 부동산',
      propertiesForSaleDescription: '플레이어로서 원하는 도시에 위치한 마켓플레이스에서 오퍼를 확인할 수 있습니다.',
      propertiesButton: '판매용 부동산'
    },
    someStats: {
      title: '일부 통계',
      megacitiesDescription: 'Earth2 위치, 웹사이트 및 Discord 서버에 대한 링크가 있는 메가시티',
      megacitiesButton: '도시 지도',
      blueDotsDescription: '파란색 점! 그들은 미국 광물 자원 데이터 시스템(US Mineral Resource Data System)의 데이터를 나타내는 지도 전체에 earth2.io에서 1시간 미만 동안 나타났습니다.',
      blueDotsButton: '파란색 점',
      resourcesDescription: '지구 1에서 가장 많이 채굴된 광물을 포함한 다양한 출처의 자원 유형',
      resourcesButton: '리소스 맵'
    },
    ourPartners: {
      title: '우리의 파트너',
      agvDescription: 'Alchera Global Venture는 높은 야망을 가진 earth2.io 커뮤니티입니다. 그리고 바다사자를 위한 ❤.',
      agvButton: 'AGV 가입',
      RDDescription: '자원 지구는 Earth2 최대의 광산 네트워크이자 자원을 거래하는 장소입니다.',
      RDButton: '자원 구역 가입'
    },
    referalCode: {
      question: '여기에 있는 내용이 마음에 드십니까?',
      message: '타일을 구매할 때 <span class="primary--text font-weight-bold"> wasp</span> 코드를 사용하여 나를 지원하고 게임에서 7.5% 할인을 받으세요'
    }
  },
  cities: {
    showButton: '도시 목록 표시',
    modalTitle: 'Earth2 도시',
    modalInfo: '도시 데이터베이스에 기여하기 위해 여기에 자신의 도시를 제출할 수 있습니다. 모든 기여가 검토될 것입니다.',
    modalLoading: '로드 중... 잠시만 기다려 주십시오',
    modalSearch: '도시 이름 또는 그룹 검색',
    newCityButton: '도시를 추가하십시오',
    moreInfoButton: '추가 정보',
    saveMessage: '기부해주셔서 감사합니다! 최대한 빨리 검토하겠습니다.',
    mapDetails: '자세한 내용은 클릭하십시오',
    newCityModal: {
      editTitle: '도시 편집',
      createTitle: '새로운 도시',
      name: '이름',
      group: '그룹',
      propertyUrl: '속성 URL',
      discordServer: 'Discord 서버',
      website: '웹사이트',
      description: '설명',
      cancelButton: '취소',
      saveButton: '저장'
    }
  },
  city: {
    cityGroup: ' - 이 도시는 \'의 일부입니다 ',
    lastUpdated: '마지막 업데이트 날짜',
    location: '위치',
    e2Location: 'Earth2 위치',
    noDescription: '가능한 설명이 없습니다.',
    propertiesForSale: '판매용 부동산',
    details: '세부',
    stats: '통계',
    updateMessage: '거의 매주 업데이트됨',
    buyButton: '구매',
    numberOfTiles: '소유한 타일 수',
    numberOfPlayers: '플레이어 수',
    classDistribution: '클래스 배포',
    top10Players: '상위 10명의 플레이어',
    noDataYet: '아직 데이터가 없습니다...',
    noPlayerInfo: '아직 플레이어 정보가 없습니다'
  },
  leaderboard: {
    title: '최고의 도시 프로젝트',
    yourCity: '여기 당신의 도시',
    contactMessage: '당신의 도시를 홍보하려면 불화로 저에게 연락하십시오!WASP#1975',
    discoverButton: '발견하다',
    algorithmMessage: '이 알고리즘은 판매 된 타일 수가 임계 값에 도달 할 때까지 도시의 중심 타일에서 시작하는 크기를 계산합니다.가까운 도시가 \'병합 \'를 합병하고 다른 도시와 타일을 결합한 이유는 무엇입니까?도시에서 멀리 떨어진 타일 음모는 무시 될 수 있습니다.',
    leaderboardTitle: '도시 리더 보드',
    tiles: '타일'
  },
  footer: {
    supportMessage: '이 프로젝트가 마음에 드시면 코드 <strong> wasp </strong>을 사용하여 7.5% 할인 또는 <a target="_blank" rel="noopener noreferrer" href="https://ko-fi.com/earth2biomes" @click="trackFooterClick(\'kofi\')"> 커피 구입 ☕️ </a>',
    contactMessage: '아이디어/버그를 제출하려면 Discord-> WASP#1975로 저에게 연락 할 수 있습니다.'
  }
}
