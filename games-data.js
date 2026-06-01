// Johnny's Game Library — structured data
// Era: 'childhood' (pre-uni), 'uni' (uni+), 'current'
// goty: year string if it won GOTY (e.g. '2018', 'All-Time'); null/undefined otherwise
// platinum: true if Platinum trophy obtained

const IMG = './img';

const GAMES = [
  // ============ CURRENT ============
  { id: 'brotato',        title: 'Brotato',                             img: `${IMG}/brotato.png`,         year: 2022, era: 'current',   tag: 'roguelite',    personalNote: 'CURRENT OBSESSION.\nCommute fuel.' },
  { id: 'diablo-4',       title: 'Diablo IV',                           img: `${IMG}/diablo-4.jpg`,        year: 2023, era: 'current',   tag: 'arpg' },

  // ============ CHILDHOOD & TEENAGE ============
  { id: 'aoe2',           title: 'Age of Empires II',                   img: `${IMG}/aoe2.png`,            year: 1999, era: 'childhood', tag: 'strategy',     personalNote: 'LAN parties at the cafe.' },
  { id: 'red-alert',      title: 'Command & Conquer: Red Alert II',     img: `${IMG}/red-alert.jpg`,       year: 2000, era: 'childhood', tag: 'strategy' },
  { id: 'diablo-2',       title: 'Diablo II',                           img: `${IMG}/diablo-2.jpg`,        year: 2000, era: 'childhood', tag: 'arpg' },
  { id: 'yuris-revenge',  title: "C&C: Yuri's Revenge",                 img: `${IMG}/yuris-revenge.jpg`,   year: 2001, era: 'childhood', tag: 'strategy' },
  { id: 'gta-vc',         title: 'Grand Theft Auto: Vice City',         img: `${IMG}/gta-vc.png`,          year: 2002, era: 'childhood', tag: 'open-world',   personalNote: 'FIRST GAME I EVER OWNED.\nThis is where it all began.' },
  { id: 'warcraft3',      title: 'Warcraft III: Frozen Throne',         img: `${IMG}/warcraft3.jpg`,       year: 2003, era: 'childhood', tag: 'strategy' },
  { id: 'cs1-6',          title: 'Counter-Strike 1.6',                  img: `${IMG}/cs1-6.jpg`,           year: 2003, era: 'childhood', tag: 'shooter',      personalNote: 'de_dust2 is home.' },
  { id: 'dota',           title: 'Dota',                                img: `${IMG}/dota.jpg`,            year: 2003, era: 'childhood', tag: 'moba' },
  { id: 'gta-sa',         title: 'Grand Theft Auto: San Andreas',       img: `${IMG}/gta-sa.jpg`,          year: 2004, era: 'childhood', tag: 'open-world' },
  { id: 'dnf',            title: 'Dungeon & Fighter',                   img: `${IMG}/dnf.jpg`,             year: 2005, era: 'childhood', tag: 'beat-em-up' },
  { id: 'cf',             title: 'CrossFire',                           img: `${IMG}/cf.jpeg`,             year: 2007, era: 'childhood', tag: 'shooter' },
  { id: 'cod-mw',         title: 'Call of Duty: Modern Warfare',        img: `${IMG}/cod-mw.jpg`,          year: 2007, era: 'childhood', tag: 'shooter' },
  { id: 'devil4',         title: 'Devil May Cry 4',                     img: `${IMG}/devil4.jpg`,          year: 2008, era: 'childhood', tag: 'action' },
  { id: 'cod-waw',        title: 'Call of Duty: World at War',          img: `${IMG}/cod-waw.png`,         year: 2008, era: 'childhood', tag: 'shooter' },
  { id: 'cod-mw2',        title: 'Call of Duty: Modern Warfare II',     img: `${IMG}/cod-mw2.jpg`,         year: 2009, era: 'childhood', tag: 'shooter' },
  { id: 'pvz',            title: 'Plants vs Zombies',                   img: `${IMG}/pvz.jpg`,             year: 2009, era: 'childhood', tag: 'tower-defense' },
  { id: 'lol',            title: 'League of Legends',                   img: `${IMG}/lol.jpg`,             year: 2009, era: 'childhood', tag: 'moba' },
  { id: 'prototype',      title: 'Prototype',                           img: `${IMG}/prototype.jpg`,       year: 2009, era: 'childhood', tag: 'action' },
  { id: 'minecraft',      title: 'Minecraft',                           img: `${IMG}/minecraft.jpg`,       year: 2009, era: 'childhood', tag: 'sandbox' },
  { id: 'cod-blackops',   title: 'Call of Duty: Black Ops',             img: `${IMG}/cod-blackops.jpg`,    year: 2010, era: 'childhood', tag: 'shooter' },
  { id: 'cod-mw3',        title: 'Call of Duty: Modern Warfare III',    img: `${IMG}/cod-mw3.jpg`,         year: 2011, era: 'childhood', tag: 'shooter' },
  { id: 'kof',            title: 'The King of Fighters',                img: `${IMG}/kof.jpg`,             year: 1994, era: 'childhood', tag: 'fighting' },
  { id: 'street-fighter', title: 'Street Fighter',                      img: `${IMG}/street-fighter.jpg`,  year: 1987, era: 'childhood', tag: 'fighting' },
  { id: 'metal-slug',     title: 'Metal Slug',                          img: `${IMG}/metal-slug.jpeg`,     year: 1996, era: 'childhood', tag: 'arcade' },
  { id: 'contra',         title: 'Contra',                              img: `${IMG}/contra.jpg`,          year: 1987, era: 'childhood', tag: 'arcade' },
  { id: 'road-rash',      title: 'Road Rash',                           img: `${IMG}/road-rash.jpg`,       year: 1991, era: 'childhood', tag: 'racing' },
  { id: 'nba2k',          title: 'NBA 2K Series',                       img: `${IMG}/nba2k.png`,           year: 1999, era: 'childhood', tag: 'sports' },

  // ============ UNIVERSITY+ ============
  { id: 'gta-3',          title: 'GTA III',                             img: `${IMG}/gta-3.jpg`,           year: 2001, era: 'uni', tag: 'open-world' },
  { id: 'gta-4',          title: 'Grand Theft Auto IV',                 img: `${IMG}/gta-4.jpg`,           year: 2008, era: 'uni', tag: 'open-world' },
  { id: 'dark-souls-1',   title: 'Dark Souls',                          img: `${IMG}/dark-souls-1.jpg`,    year: 2011, era: 'uni', tag: 'soulslike',    goty: '2018', personalNote: 'The boss that broke me,\nthen made me.' },
  { id: 'gta-5',          title: 'Grand Theft Auto V',                  img: `${IMG}/gta-5.png`,           year: 2013, era: 'uni', tag: 'open-world',   goty: 'All-Time' },
  { id: 'dota-2',         title: 'Dota 2',                              img: `${IMG}/dota-2.jpeg`,         year: 2013, era: 'uni', tag: 'moba' },
  { id: 'hearthstone',    title: 'Hearthstone',                         img: `${IMG}/hearthstone.jpg`,     year: 2014, era: 'uni', tag: 'card' },
  { id: 'dark-souls-2',   title: 'Dark Souls II',                       img: `${IMG}/dark-souls-2.png`,    year: 2014, era: 'uni', tag: 'soulslike' },
  { id: 'bloodborne',     title: 'Bloodborne',                          img: `${IMG}/bloodborne.jpg`,      year: 2015, era: 'uni', tag: 'soulslike',    goty: '2020', personalNote: 'Yharnam haunts me still.' },
  { id: 'titan-fall-2',   title: 'Titanfall 2',                         img: `${IMG}/titan-fall-2.jpeg`,   year: 2016, era: 'uni', tag: 'shooter' },
  { id: 'inside',         title: 'Inside',                              img: `${IMG}/inside.jpg`,          year: 2016, era: 'uni', tag: 'puzzle',       goty: '2020' },
  { id: 'overcooked',     title: 'Overcooked!',                         img: `${IMG}/overcooked.jpg`,      year: 2016, era: 'uni', tag: 'co-op' },
  { id: 'dark-souls-3',   title: 'Dark Souls III',                      img: `${IMG}/dark-souls-3.jpg`,    year: 2016, era: 'uni', tag: 'soulslike',    goty: '2019' },
  { id: 'storm',          title: 'Naruto: Ultimate Ninja Storm 4',      img: `${IMG}/storm.jpg`,           year: 2016, era: 'uni', tag: 'fighting' },
  { id: 'zelda-breath',   title: 'Zelda: Breath of the Wild',           img: `${IMG}/zelda-breath.jpg`,    year: 2017, era: 'uni', tag: 'open-world',   goty: '2023' },
  { id: 'nioh',           title: 'Nioh',                                img: `${IMG}/nioh.jpg`,            year: 2017, era: 'uni', tag: 'soulslike' },
  { id: 'pubg',           title: 'PUBG: Battlegrounds',                 img: `${IMG}/pubg.jpeg`,           year: 2017, era: 'uni', tag: 'battle-royale' },
  { id: 'overcooked2',    title: 'Overcooked! 2',                       img: `${IMG}/overcooked2.jpeg`,    year: 2018, era: 'uni', tag: 'co-op' },
  { id: 'a-way-out',      title: 'A Way Out',                           img: `${IMG}/a-way-out.jpg`,       year: 2018, era: 'uni', tag: 'co-op' },
  { id: 'sekiro',         title: 'Sekiro: Shadows Die Twice',           img: `${IMG}/sekiro.jpg`,          year: 2019, era: 'uni', tag: 'soulslike',    goty: '2019' },
  { id: 'death-stranding',title: 'Death Stranding',                     img: `${IMG}/death-stranding.jpg`, year: 2019, era: 'uni', tag: 'open-world',   goty: '2024' },
  { id: 'slay-the-spire', title: 'Slay the Spire',                      img: `${IMG}/slay-the-spire.jpeg`, year: 2019, era: 'uni', tag: 'roguelite' },
  { id: 'nfs-heat',       title: 'Need For Speed: Heat',                img: `${IMG}/nfs-heat.jpg`,        year: 2019, era: 'uni', tag: 'racing' },
  { id: 'ori-will',       title: 'Ori and the Will of the Wisps',       img: `${IMG}/ori-will.jpg`,        year: 2020, era: 'uni', tag: 'metroidvania' },
  { id: 'hades',          title: 'Hades',                               img: `${IMG}/hades.png`,           year: 2020, era: 'uni', tag: 'roguelite',    goty: '2020', personalNote: 'One more run... one more.' },
  { id: 'cyberpunk',      title: 'Cyberpunk 2077',                      img: `${IMG}/cyberpunk.png`,       year: 2020, era: 'uni', tag: 'open-world',   goty: '2021' },
  { id: 'nba2k21',        title: 'NBA 2K21',                            img: `${IMG}/nba2k21.jpg`,         year: 2020, era: 'uni', tag: 'sports' },
  { id: 'goose',          title: 'Goose Goose Duck',                    img: `${IMG}/goose.jpeg`,          year: 2021, era: 'uni', tag: 'social' },
  { id: 'fist',           title: 'F.I.S.T. Forged In Shadow Torch',     img: `${IMG}/fist.jpg`,            year: 2021, era: 'uni', tag: 'metroidvania', goty: '2023' },
  { id: 'it-takes-two',   title: 'It Takes Two',                        img: `${IMG}/it-takes-two.jpg`,    year: 2021, era: 'uni', tag: 'co-op',        goty: '2022', personalNote: 'Co-op nights. Every level.' },
  { id: 'elden-ring',     title: 'Elden Ring',                          img: `${IMG}/elden-ring.jpg`,      year: 2022, era: 'uni', tag: 'soulslike',    goty: '2022', platinum: true, personalNote: '200+ hrs. Still my GOAT.' },
  { id: 'cs-2',           title: 'Counter-Strike 2',                    img: `${IMG}/cs-2.jpeg`,           year: 2023, era: 'uni', tag: 'shooter' },
  { id: 'zelda-echo',     title: 'Zelda: Echoes of Wisdom',             img: null,                         year: 2024, era: 'uni', tag: 'adventure' },
  { id: 'balatro',        title: 'Balatro',                             img: null,                         year: 2024, era: 'uni', tag: 'card' },
  { id: 'wukong',         title: 'Black Myth: Wukong',                  img: `${IMG}/wukong.jpg`,          year: 2024, era: 'uni', tag: 'action',       goty: '2024', personalNote: 'Souls combat, my heritage.' },
  { id: 'split-fiction',  title: 'Split Fiction',                       img: `${IMG}/split-fiction.jpg`,   year: 2025, era: 'uni', tag: 'co-op',        goty: '2025' },
  { id: 'dead-cells',     title: 'Dead Cells',                          img: null,                         year: 2018, era: 'uni', tag: 'roguelite',    goty: '2025' },
];

const GAMES_BY_ID = Object.fromEntries(GAMES.map(g => [g.id, g]));

const GOTYS = [
  { year: 'All-Time', games: ['gta-5'] },
  { year: '2018',     games: ['gta-vc', 'dark-souls-1'] },
  { year: '2019',     games: ['sekiro', 'dark-souls-3'] },
  { year: '2020',     games: ['hades', 'inside', 'bloodborne'] },
  { year: '2021',     games: ['cyberpunk', 'it-takes-two'] },
  { year: '2022',     games: ['elden-ring'] },
  { year: '2023',     games: ['zelda-breath', 'fist'] },
  { year: '2024',     games: ['wukong', 'death-stranding'] },
  { year: '2025',     games: ['split-fiction', 'dead-cells'] },
];

const STATS = {
  total:    GAMES.length,
  childhood: GAMES.filter(g => g.era === 'childhood').length,
  uni:      GAMES.filter(g => g.era === 'uni').length,
  goty:     GOTYS.reduce((a, y) => a + y.games.length, 0),
  earliest: Math.min(...GAMES.map(g => g.year)),
  latest:   Math.max(...GAMES.map(g => g.year)),
};

window.GAMES      = GAMES;
window.GAMES_BY_ID = GAMES_BY_ID;
window.GOTYS      = GOTYS;
window.STATS      = STATS;
