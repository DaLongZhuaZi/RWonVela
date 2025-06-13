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
const GRID_SIZE = 10 // 10x10网格
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
    // 生成1-2条主要山脉
    const mountainRanges = Math.floor(Math.random() * 2) + 1
    
    for (let range = 0; range < mountainRanges; range++) {
      this.generateMountainRange(terrain)
    }
    
    // 在山脉周围生成丘陵过渡带
    this.generateHillTransitions(terrain)
    
    // 在其他位置随机放置独立小丘陵
    this.generateScatteredHills(terrain)
  }
  
  // 生成自然山脉
  generateMountainRange(terrain) {
    // 选择山脉起点
    const startX = Math.floor(Math.random() * GRID_SIZE)
    const startY = Math.floor(Math.random() * GRID_SIZE)
    
    // 山脉主要方向（8个方向）
    const directions = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]]
    let mainDirection = directions[Math.floor(Math.random() * directions.length)]
    
    let currentX = startX
    let currentY = startY
    const mountainPath = []
    const maxLength = Math.floor(Math.random() * 4) + 3 // 3-6格长
    
    for (let i = 0; i < maxLength; i++) {
      // 检查边界
      if (currentX < 0 || currentX >= GRID_SIZE || currentY < 0 || currentY >= GRID_SIZE) break
      
      // 避免在玩家位置放置山脉
      if (currentX === terrain.playerPosition.x && currentY === terrain.playerPosition.y) {
        // 跳过玩家位置，继续下一个位置
        currentX += mainDirection[0]
        currentY += mainDirection[1]
        continue
      }
      
      mountainPath.push({ x: currentX, y: currentY })
      
      // 30%概率改变方向（创造自然弯曲）
      if (Math.random() < 0.3) {
        const newDirection = directions[Math.floor(Math.random() * directions.length)]
        mainDirection = newDirection
      }
      
      // 移动到下一个位置
      currentX += mainDirection[0]
      currentY += mainDirection[1]
    }
    
    // 应用山脉到地形
    mountainPath.forEach((pos, index) => {
      const isStart = index === 0
      const isEnd = index === mountainPath.length - 1
      
      // 山脉中心更可能是高山，边缘更可能是大丘陵
      if (isStart || isEnd) {
        terrain.grid[pos.y][pos.x].hill = Math.random() < 0.4 ? 'Mountains' : 'LargeHills'
      } else {
        terrain.grid[pos.y][pos.x].hill = Math.random() < 0.7 ? 'Mountains' : 'LargeHills'
      }
    })
  }
  
  // 生成山脉周围的丘陵过渡带
  generateHillTransitions(terrain) {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        // 如果当前位置已经有山丘，跳过
        if (terrain.grid[y][x].hill) continue
        
        // 检查周围是否有山脉
        let nearMountain = false
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx
            const ny = y + dy
            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
              if (terrain.grid[ny][nx].hill === 'Mountains') {
                nearMountain = true
                break
              }
            }
          }
          if (nearMountain) break
        }
        
        // 如果靠近山脉，60%概率生成丘陵过渡
        if (nearMountain && Math.random() < 0.6) {
          // 避免在玩家位置放置丘陵
          if (x === terrain.playerPosition.x && y === terrain.playerPosition.y) continue
          
          terrain.grid[y][x].hill = Math.random() < 0.7 ? 'LargeHills' : 'SmallHills'
        }
      }
    }
  }
  
  // 生成散布的独立小丘陵
  generateScatteredHills(terrain) {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        // 如果当前位置已经有山丘，跳过
        if (terrain.grid[y][x].hill) continue
        
        // 15%概率生成独立小丘陵
        if (Math.random() < 0.15) {
          // 避免在玩家位置放置丘陵
          if (x === terrain.playerPosition.x && y === terrain.playerPosition.y) continue
          
          terrain.grid[y][x].hill = 'SmallHills'
        }
      }
    }
  }
  
  // 生成河流和水系（确保地图上一定有水系）
  generateRivers(terrain) {
    // 80%概率生成河流，20%概率生成湖泊或海洋
    const waterType = Math.random()
    
    if (waterType < 0.8) {
      // 生成蜿蜒河流
      this.generateMeanderingRiver(terrain)
    } else {
      // 生成湖泊或海洋区域
      this.generateLakeOrSea(terrain)
    }
  }
  
  // 生成蜿蜒河流
  generateMeanderingRiver(terrain) {
    // 选择河流起点（边缘）
    const startSide = Math.floor(Math.random() * 4) // 0=上, 1=右, 2=下, 3=左
    let currentX, currentY
    
    switch (startSide) {
      case 0: // 从上边开始
        currentX = Math.floor(Math.random() * GRID_SIZE)
        currentY = 0
        break
      case 1: // 从右边开始
        currentX = GRID_SIZE - 1
        currentY = Math.floor(Math.random() * GRID_SIZE)
        break
      case 2: // 从下边开始
        currentX = Math.floor(Math.random() * GRID_SIZE)
        currentY = GRID_SIZE - 1
        break
      case 3: // 从左边开始
        currentX = 0
        currentY = Math.floor(Math.random() * GRID_SIZE)
        break
    }
    
    // 河流路径点
    const riverPath = []
    const maxSteps = GRID_SIZE * 2 // 最大步数
    
    for (let step = 0; step < maxSteps; step++) {
      // 添加当前位置到河流路径
      if (currentX >= 0 && currentX < GRID_SIZE && currentY >= 0 && currentY < GRID_SIZE) {
        riverPath.push({ x: currentX, y: currentY })
      }
      
      // 计算下一步方向（倾向于流向地图中心或对角）
      const centerX = Math.floor(GRID_SIZE / 2)
      const centerY = Math.floor(GRID_SIZE / 2)
      
      let nextX = currentX
      let nextY = currentY
      
      // 70%概率朝向中心，30%概率随机蜿蜒
      if (Math.random() < 0.7) {
        if (currentX < centerX) nextX++
        else if (currentX > centerX) nextX--
        
        if (currentY < centerY) nextY++
        else if (currentY > centerY) nextY--
      } else {
        // 随机蜿蜒
        const directions = [[-1,0], [1,0], [0,-1], [0,1], [-1,-1], [1,1], [-1,1], [1,-1]]
        const randomDir = directions[Math.floor(Math.random() * directions.length)]
        nextX += randomDir[0]
        nextY += randomDir[1]
      }
      
      // 检查边界
      if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
        break
      }
      
      currentX = nextX
      currentY = nextY
    }
    
    // 应用河流路径到地形
    riverPath.forEach(pos => {
      if (pos.x === terrain.playerPosition.x && pos.y === terrain.playerPosition.y) return
      if (terrain.grid[pos.y][pos.x].hill === 'Mountains' || terrain.grid[pos.y][pos.x].hill === 'Impassable') return
      
      // 设置为水系生物群系
      const currentBiome = terrain.grid[pos.y][pos.x].biome
      if (currentBiome === 'TemperateForest' || currentBiome === 'BorealForest') {
        terrain.grid[pos.y][pos.x].biome = 'TemperateSwamp'
      } else if (currentBiome === 'TropicalRainforest') {
        terrain.grid[pos.y][pos.x].biome = 'TropicalSwamp'
      } else if (currentBiome === 'Tundra' || currentBiome === 'IceSheet') {
        terrain.grid[pos.y][pos.x].biome = 'ColdBog'
      } else {
        terrain.grid[pos.y][pos.x].biome = 'TemperateSwamp'
      }
    })
  }
  
  // 生成湖泊或海洋
  generateLakeOrSea(terrain) {
    // 选择湖泊中心位置
    const centerX = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1
    const centerY = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1
    
    // 湖泊大小（1-3格半径）
    const radius = Math.floor(Math.random() * 3) + 1
    
    for (let y = Math.max(0, centerY - radius); y <= Math.min(GRID_SIZE - 1, centerY + radius); y++) {
      for (let x = Math.max(0, centerX - radius); x <= Math.min(GRID_SIZE - 1, centerX + radius); x++) {
        const distance = Math.abs(x - centerX) + Math.abs(y - centerY)
        if (distance <= radius) {
          // 避免在玩家位置放置水体
          if (x === terrain.playerPosition.x && y === terrain.playerPosition.y) continue
          
          // 根据距离海岸决定是海洋还是湖泊
          const isCoastal = x === 0 || x === GRID_SIZE - 1 || y === 0 || y === GRID_SIZE - 1
          if (isCoastal && Math.random() < 0.6) {
            terrain.grid[y][x].biome = 'Ocean'
          } else {
            terrain.grid[y][x].biome = 'TemperateSwamp'
          }
          
          // 清除山丘（水体不能有山丘）
          terrain.grid[y][x].hill = null
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