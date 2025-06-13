// 地形生成器
// 用于生成随机地形和地标

const BIOMES = [
  'AridShrubland',
  'BorealForest', 
  'ColdBog',
  'Desert',
  'ExtremeDesert',
  'IceSheet',
  'IceSheetOcean',
  'Ocean',
  'TemperateForest',
  'TemperateSwamp',
  'TropicalRainforest',
  'TropicalSwamp',
  'Tundra'
]

const HILLS = [
  'Impassable',
  'LargeHills',
  'Mountains',
  'SmallHills'
]

const WORLD_OBJECTS = [
  'Ambush',
  'CannibalPirate',
  'DefaultSettlement',
  'HoraxCult',
  'Mechanoids',
  'PeaceTalks',
  'RoughPigUnion',
  'SavageImpidTribe',
  'Town',
  'TravelingTransportPods',
  'WasterPirates',
  'YttakinPirates'
]

// 地形网格大小
const GRID_SIZE = 5 // 5x5网格
const TILE_SIZE = 64 // 每个地形块64x64像素

class TerrainGenerator {
  constructor() {
    this.currentTerrain = null
  }

  // 生成随机地形网格
  generateTerrain() {
    const terrain = {
      grid: [],
      playerPosition: { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }, // 玩家在中心
      biome: this.getRandomBiome(),
      objects: []
    }

    // 初始化地形网格
    for (let y = 0; y < GRID_SIZE; y++) {
      terrain.grid[y] = []
      for (let x = 0; x < GRID_SIZE; x++) {
        terrain.grid[y][x] = {
          biome: terrain.biome, // 先设置为主生物群系
          hill: null,
          object: null
        }
      }
    }

    // 生成自然的地形分布
    this.generateNaturalTerrain(terrain)
    
    // 生成山脉和丘陵
    this.generateMountainsAndHills(terrain)
    
    // 生成河流（如果适合的生物群系）
    this.generateRivers(terrain)

    // 随机放置地标对象
    this.placeRandomObjects(terrain)

    this.currentTerrain = terrain
    return terrain
  }

  // 获取随机生物群系
  getRandomBiome() {
    return BIOMES[Math.floor(Math.random() * BIOMES.length)]
  }

  // 获取随机山丘类型
  getRandomHill() {
    return HILLS[Math.floor(Math.random() * HILLS.length)]
  }

  // 获取随机世界对象
  getRandomWorldObject() {
    return WORLD_OBJECTS[Math.floor(Math.random() * WORLD_OBJECTS.length)]
  }

  // 判断是否应该有山丘（30%概率）
  shouldHaveHill() {
    return Math.random() < 0.3
  }

  // 判断是否应该有地标对象（15%概率）
  shouldHaveObject() {
    return Math.random() < 0.15
  }

  // 生成自然的地形分布
  generateNaturalTerrain(terrain) {
    // 在边缘区域可能出现不同的生物群系
    const compatibleBiomes = this.getCompatibleBiomes(terrain.biome)
    
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        // 距离中心越远，越可能出现不同生物群系
        const distanceFromCenter = Math.abs(x - Math.floor(GRID_SIZE / 2)) + Math.abs(y - Math.floor(GRID_SIZE / 2))
        const changeChance = distanceFromCenter * 0.15 // 15%每格距离
        
        if (Math.random() < changeChance && compatibleBiomes.length > 0) {
          terrain.grid[y][x].biome = compatibleBiomes[Math.floor(Math.random() * compatibleBiomes.length)]
        }
      }
    }
  }
  
  // 生成山脉和丘陵
  generateMountainsAndHills(terrain) {
    // 生成1-2条山脉
    const mountainRanges = Math.floor(Math.random() * 2) + 1
    
    for (let range = 0; range < mountainRanges; range++) {
      // 随机选择山脉方向（水平或垂直）
      const isHorizontal = Math.random() < 0.5
      
      if (isHorizontal) {
        // 水平山脉
        const y = Math.floor(Math.random() * GRID_SIZE)
        const startX = Math.floor(Math.random() * (GRID_SIZE - 2))
        const length = Math.floor(Math.random() * 3) + 2 // 2-4格长
        
        for (let i = 0; i < length && startX + i < GRID_SIZE; i++) {
          const x = startX + i
          // 避免在玩家位置放置山脉
          if (x === terrain.playerPosition.x && y === terrain.playerPosition.y) continue
          
          terrain.grid[y][x].hill = Math.random() < 0.6 ? 'Mountains' : 'LargeHills'
        }
      } else {
        // 垂直山脉
        const x = Math.floor(Math.random() * GRID_SIZE)
        const startY = Math.floor(Math.random() * (GRID_SIZE - 2))
        const length = Math.floor(Math.random() * 3) + 2 // 2-4格长
        
        for (let i = 0; i < length && startY + i < GRID_SIZE; i++) {
          const y = startY + i
          // 避免在玩家位置放置山脉
          if (x === terrain.playerPosition.x && y === terrain.playerPosition.y) continue
          
          terrain.grid[y][x].hill = Math.random() < 0.6 ? 'Mountains' : 'LargeHills'
        }
      }
    }
    
    // 在其他位置随机放置小丘陵
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!terrain.grid[y][x].hill && Math.random() < 0.2) {
          // 避免在玩家位置放置丘陵
          if (x === terrain.playerPosition.x && y === terrain.playerPosition.y) continue
          
          terrain.grid[y][x].hill = 'SmallHills'
        }
      }
    }
  }
  
  // 生成河流
  generateRivers(terrain) {
    // 只在适合的生物群系生成河流
    const riverBiomes = ['TemperateForest', 'TemperateSwamp', 'TropicalRainforest', 'BorealForest']
    if (!riverBiomes.includes(terrain.biome)) return
    
    // 30%概率生成河流
    if (Math.random() < 0.3) {
      // 河流通常是对角线或曲线
      const isMainDiagonal = Math.random() < 0.5
      
      if (isMainDiagonal) {
        // 主对角线河流
        for (let i = 0; i < GRID_SIZE; i++) {
          const x = i
          const y = i
          // 避免在玩家位置和山脉位置放置河流
          if (x === terrain.playerPosition.x && y === terrain.playerPosition.y) continue
          if (terrain.grid[y][x].hill) continue
          
          // 河流区域改为湿地生物群系
          if (terrain.biome === 'TemperateForest') {
            terrain.grid[y][x].biome = 'TemperateSwamp'
          } else if (terrain.biome === 'TropicalRainforest') {
            terrain.grid[y][x].biome = 'TropicalSwamp'
          }
        }
      } else {
        // 反对角线河流
        for (let i = 0; i < GRID_SIZE; i++) {
          const x = i
          const y = GRID_SIZE - 1 - i
          // 避免在玩家位置和山脉位置放置河流
          if (x === terrain.playerPosition.x && y === terrain.playerPosition.y) continue
          if (terrain.grid[y][x].hill) continue
          
          // 河流区域改为湿地生物群系
          if (terrain.biome === 'TemperateForest') {
            terrain.grid[y][x].biome = 'TemperateSwamp'
          } else if (terrain.biome === 'TropicalRainforest') {
            terrain.grid[y][x].biome = 'TropicalSwamp'
          }
        }
      }
    }
  }
  
  // 获取兼容的生物群系
  getCompatibleBiomes(mainBiome) {
    const biomeGroups = {
      'TemperateForest': ['BorealForest', 'TemperateSwamp'],
      'BorealForest': ['TemperateForest', 'Tundra'],
      'TropicalRainforest': ['TropicalSwamp'],
      'Desert': ['AridShrubland', 'ExtremeDesert'],
      'Tundra': ['BorealForest', 'IceSheet'],
      'AridShrubland': ['Desert'],
      'TemperateSwamp': ['TemperateForest'],
      'TropicalSwamp': ['TropicalRainforest'],
      'ColdBog': ['BorealForest', 'Tundra'],
      'ExtremeDesert': ['Desert'],
      'IceSheet': ['Tundra'],
      'Ocean': ['IceSheetOcean'],
      'IceSheetOcean': ['Ocean', 'IceSheet']
    }
    
    return biomeGroups[mainBiome] || []
  }

  // 随机放置地标对象
  placeRandomObjects(terrain) {
    const objectCount = Math.floor(Math.random() * 2) + 1 // 1-2个对象
    
    for (let i = 0; i < objectCount; i++) {
      const x = Math.floor(Math.random() * GRID_SIZE)
      const y = Math.floor(Math.random() * GRID_SIZE)
      
      // 避免在玩家位置放置对象
      if (x === terrain.playerPosition.x && y === terrain.playerPosition.y) {
        continue
      }
      
      // 避免在山脉上放置对象
      if (terrain.grid[y][x].hill === 'Mountains' || terrain.grid[y][x].hill === 'Impassable') {
        continue
      }
      
      // 避免重复放置
      if (terrain.grid[y][x].object) {
        continue
      }
      
      terrain.grid[y][x].object = this.getRandomWorldObject()
    }
  }

  // 移动玩家位置
  movePlayer(direction) {
    if (!this.currentTerrain) return false
    
    const { playerPosition } = this.currentTerrain
    let newX = playerPosition.x
    let newY = playerPosition.y
    
    switch (direction) {
      case 'north':
        newY = Math.max(0, newY - 1)
        break
      case 'south':
        newY = Math.min(GRID_SIZE - 1, newY + 1)
        break
      case 'east':
        newX = Math.min(GRID_SIZE - 1, newX + 1)
        break
      case 'west':
        newX = Math.max(0, newX - 1)
        break
    }
    
    // 检查是否可以移动（山脉不可通过）
    const targetTile = this.currentTerrain.grid[newY][newX]
    if (targetTile.hill === 'Impassable' || targetTile.hill === 'Mountains') {
      return false // 无法移动
    }
    
    playerPosition.x = newX
    playerPosition.y = newY
    return true
  }

  // 获取当前玩家位置的地形信息
  getCurrentTileInfo() {
    if (!this.currentTerrain) return null
    
    const { playerPosition } = this.currentTerrain
    const tile = this.currentTerrain.grid[playerPosition.y][playerPosition.x]
    
    return {
      biome: tile.biome,
      hill: tile.hill,
      object: tile.object,
      position: { ...playerPosition }
    }
  }

  // 获取地形图片路径
  getBiomePath(biome) {
    return `/common/world/Biomes/${biome}.png`
  }

  getHillPath(hill) {
    return `/common/world/Hills/${hill}.png`
  }

  getObjectPath(object) {
    return `/common/world/WorldObjects/${object}.png`
  }

  // 获取当前地形数据
  getCurrentTerrain() {
    return this.currentTerrain
  }
}

module.exports = new TerrainGenerator()