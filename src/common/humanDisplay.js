// humanDisplay.js - 人物模型显示处理逻辑

/**
 * 根据部件路径和方向获取完整的图片路径
 * @param {string} partType - 部件类型 ('beards', 'bodies', 'haris', 'heads')
 * @param {string} partName - 部件名称
 * @param {string} direction - 方向 ('east', 'north', 'south')
 * @returns {string} - 图片的完整路径
 */
function getHumanPartPath(partType, partName, direction) {
  if (partType === 'heads') {
    // heads文件夹下有子文件夹Male/Female，文件名格式为：Gender_Face_Nose_direction.png
    return `/common/human/${partType}/${partName}_${direction}.png`;
  } else {
    // beards, bodies, haris 文件名格式为：PartName_direction.png
    return `/common/human/${partType}/${partName}_${direction}.png`;
  }
}

/**
 * 获取所有可用的身体类型
 * @returns {Array} - 身体类型数组
 */
function getBodyTypes() {
  return ['Naked_Fat', 'Naked_Female', 'Naked_Hulk', 'Naked_Male', 'Naked_Thin'];
}

/**
 * 获取所有可用的头部类型
 * @returns {Array} - 头部类型数组
 */
function getHeadTypes() {
  return [
    'Male/Male_Average_Normal',
    'Male/Male_Average_Pointy', 
    'Male/Male_Average_Wide',
    'Male/Male_Narrow_Normal',
    'Male/Male_Narrow_Pointy',
    'Male/Male_Narrow_Wide',
    'Female/Female_Average_Normal',
    'Female/Female_Average_Pointy',
    'Female/Female_Average_Wide', 
    'Female/Female_Narrow_Normal',
    'Female/Female_Narrow_Pointy',
    'Female/Female_Narrow_Wide'
  ];
}

/**
 * 获取所有可用的头发类型
 * @returns {Array} - 头发类型数组
 */
function getHairTypes() {
  return [
    'Afro', 'Bob', 'Bowlcut', 'Braidbun', 'Bravo', 'Burgundy', 'Cleopatra',
    'Curly', 'Cute', 'Decent', 'Elder', 'Fancybun', 'Firestarter', 'Flowy',
    'Fringe', 'Frozen', 'Gaston', 'GreasySwoop', 'Junkie', 'Keeper', 'Lackland',
    'Locks', 'Long', 'Mess', 'Mohawk', 'Mop', 'Pigtails', 'Ponytails', 'Primal',
    'Princess', 'Randy', 'Recruit', 'Revolt', 'Rockstar', 'Rookie', 'Savage',
    'Scat', 'Scorpiontail', 'Scrapper', 'Senorita', 'ShaveTopBraid', 'Shaved',
    'Snazzy', 'Spikes', 'Sticky', 'Topdog', 'Troubadour', 'Tuft', 'Warden',
    'Wavy'
  ];
}

/**
 * 获取所有可用的胡须类型
 * @returns {Array} - 胡须类型数组
 */
function getBeardTypes() {
  return [
    'BeardAnchor', 'BeardBalin', 'BeardBifur', 'BeardBoxed', 'BeardCircle',
    'BeardCurly', 'BeardCurtain', 'BeardDori', 'BeardDucktail', 'BeardDwalin',
    'BeardFork', 'BeardFrench', 'BeardFull', 'BeardGoatee', 'BeardImperial',
    'BeardKhal', 'BeardLincoln', 'BeardLongDutch', 'BeardMachete', 'BeardMoustache',
    'BeardMuttonChops', 'BeardNori', 'BeardOldDutch', 'BeardSeer', 'BeardSideWhiskers',
    'BeardSoulPatch', 'BeardStubble', 'BeardUrist', 'BeardVanDyke', 'BeardWizard'
  ];
}

/**
 * 随机生成一个人物模型配置
 * @param {string} gender - 性别 ('male' 或 'female')，可选
 * @returns {object} - 包含随机选择的身体、头部、头发和胡须部件的对象
 */
function generateRandomHumanConfig(gender = null) {
  const bodyTypes = getBodyTypes();
  const headTypes = getHeadTypes();
  const hairTypes = getHairTypes();
  const beardTypes = getBeardTypes();

  // 根据性别筛选头部和身体类型
  let filteredHeadTypes = headTypes;
  let filteredBodyTypes = bodyTypes;
  
  if (gender === 'male') {
    filteredHeadTypes = headTypes.filter(head => head.includes('Male/'));
    filteredBodyTypes = bodyTypes.filter(body => body.includes('Male') || body.includes('Fat') || body.includes('Hulk') || body.includes('Thin'));
  } else if (gender === 'female') {
    filteredHeadTypes = headTypes.filter(head => head.includes('Female/'));
    filteredBodyTypes = bodyTypes.filter(body => body.includes('Female') || body.includes('Fat') || body.includes('Thin'));
  }

  const randomBody = filteredBodyTypes[Math.floor(Math.random() * filteredBodyTypes.length)];
  const randomHead = filteredHeadTypes[Math.floor(Math.random() * filteredHeadTypes.length)];
  const randomHair = hairTypes[Math.floor(Math.random() * hairTypes.length)];
  
  // 女性角色通常不显示胡须，或者显示概率较低
  let randomBeard = null;
  if (gender !== 'female' && Math.random() > 0.3) {
    randomBeard = beardTypes[Math.floor(Math.random() * beardTypes.length)];
  }

  return {
    body: randomBody,
    head: randomHead,
    hair: randomHair,
    beard: randomBeard
  };
}

/**
 * 根据人物配置和方向获取所有部件的图片路径
 * @param {object} config - 人物配置对象
 * @param {string} direction - 方向 ('east', 'north', 'south')
 * @returns {object} - 包含各部件图片路径的对象
 */
function getHumanPartsPaths(config, direction) {
  const paths = {
    body: getHumanPartPath('bodies', config.body, direction),
    head: getHumanPartPath('heads', config.head, direction),
    hair: getHumanPartPath('haris', config.hair, direction)
  };
  
  // 只有当胡须存在时才添加胡须路径
  if (config.beard) {
    paths.beard = getHumanPartPath('beards', config.beard, direction);
  }
  
  return paths;
}

/**
 * 获取人物模型的渲染层级顺序（从底层到顶层）
 * @returns {Array} - 渲染顺序数组
 */
function getRenderOrder() {
  return ['body', 'head', 'beard', 'hair'];
}

/**
 * 验证方向参数是否有效
 * @param {string} direction - 方向参数
 * @returns {boolean} - 是否有效
 */
function isValidDirection(direction) {
  return ['east', 'north', 'south'].includes(direction);
}

/**
 * 获取随机方向
 * @returns {string} - 随机方向
 */
function getRandomDirection() {
  const directions = ['east', 'north', 'south'];
  return directions[Math.floor(Math.random() * directions.length)];
}

export default {
  getHumanPartPath,
  getBodyTypes,
  getHeadTypes,
  getHairTypes,
  getBeardTypes,
  generateRandomHumanConfig,
  getHumanPartsPaths,
  getRenderOrder,
  isValidDirection,
  getRandomDirection
};