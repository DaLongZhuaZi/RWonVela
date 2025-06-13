/**
 * 响应式布局管理器
 * 用于处理不同分辨率设备的自适应布局计算
 */

import device from '@system.device' 

class ResponsiveManager {
  constructor() {
    // 基准设计尺寸 (Warch S4: 466x466)
    this.baseWidth = 466
    this.baseHeight = 466
    
    // 当前设备尺寸
    this.deviceWidth = 466
    this.deviceHeight = 466
    
    // 缩放比例
    this.scaleX = 1
    this.scaleY = 1
    this.scale = 1
    
    // 安全区域计算 (弧形屏幕适配)
    this.safeAreaRatio = 0.85 // 安全区域占屏幕对角线正方形的85%
    
    // 组件尺寸配置
    this.componentSizes = {
      statusBar: { height: 50 },
      resourceBar: { height: 35 },
      bottomNav: { height: 56 },
      locationInfo: { height: 120 },
      mapContainer: { 
        minHeight: 200,
        maxHeight: 400,
        padding: 4
      }
    }
    
    this.init()
  }
  
  /**
   * 初始化响应式管理器
   */
  init() {
    try {
      // 获取设备尺寸 (VelaOS可能需要特定的API)
      this.updateDeviceSize()
      this.calculateScale()
      this.calculateSafeArea()
      
      console.log('📱 响应式管理器初始化完成:', {
        设备尺寸: `${this.deviceWidth}x${this.deviceHeight}`,
        缩放比例: `${this.scale.toFixed(3)}`,
        安全区域: `${this.safeArea.width}x${this.safeArea.height}`
      })
    } catch (error) {
      console.error('❌ 响应式管理器初始化失败:', error)
      // 使用默认值
      this.deviceWidth = this.baseWidth
      this.deviceHeight = this.baseHeight
      this.scale = 1
    }
  }
  
  /**
   * 更新设备尺寸
   */
  updateDeviceSize() {
    // VelaOS获取屏幕尺寸的方法
    // 这里使用默认值，实际项目中需要调用系统API
    try {
      // 假设从系统获取尺寸
      this.deviceWidth = 466  // 实际应该从系统API获取
      this.deviceHeight = 466 // 实际应该从系统API获取
      
      // 如果有其他分辨率的设备，可以在这里处理
      // 例如: 454x454, 480x480, 390x390等
      
    } catch (error) {
      console.warn('⚠️ 无法获取设备尺寸，使用默认值')
      this.deviceWidth = this.baseWidth
      this.deviceHeight = this.baseHeight
    }
  }
  
  /**
   * 计算缩放比例
   */
  calculateScale() {
    this.scaleX = this.deviceWidth / this.baseWidth
    this.scaleY = this.deviceHeight / this.baseHeight
    
    // 使用较小的缩放比例以确保内容完全显示
    this.scale = Math.min(this.scaleX, this.scaleY)
    
    // 限制缩放范围，避免过度缩放
    this.scale = Math.max(0.5, Math.min(2.0, this.scale))
  }
  
  /**
   * 计算安全区域
   */
  calculateSafeArea() {
    // 计算屏幕对角线长度
    const diagonal = Math.sqrt(this.deviceWidth * this.deviceWidth + this.deviceHeight * this.deviceHeight)
    
    // 安全区域是对角线长度的正方形的一定比例
    const safeSize = diagonal * this.safeAreaRatio / Math.sqrt(2)
    
    this.safeArea = {
      width: Math.min(safeSize, this.deviceWidth * 0.95),
      height: Math.min(safeSize, this.deviceHeight * 0.95),
      offsetX: (this.deviceWidth - Math.min(safeSize, this.deviceWidth * 0.95)) / 2,
      offsetY: (this.deviceHeight - Math.min(safeSize, this.deviceHeight * 0.95)) / 2
    }
  }
  
  /**
   * 获取响应式尺寸
   * @param {number} baseSize 基准尺寸
   * @returns {number} 响应式尺寸
   */
  getResponsiveSize(baseSize) {
    return Math.round(baseSize * this.scale)
  }
  
  /**
   * 获取响应式字体大小
   * @param {number} baseFontSize 基准字体大小
   * @returns {number} 响应式字体大小
   */
  getResponsiveFontSize(baseFontSize) {
    const scaledSize = baseFontSize * this.scale
    // 字体大小限制在合理范围内
    return Math.max(8, Math.min(24, Math.round(scaledSize)))
  }
  
  /**
   * 计算地图容器的最佳尺寸
   * @returns {object} 地图容器尺寸配置
   */
  calculateMapContainerSize() {
    const statusBarHeight = this.getResponsiveSize(this.componentSizes.statusBar.height)
    const resourceBarHeight = this.getResponsiveSize(this.componentSizes.resourceBar.height)
    const bottomNavHeight = this.getResponsiveSize(this.componentSizes.bottomNav.height)
    
    // 预留位置信息面板的空间（当显示时）
    const locationInfoReservedHeight = this.getResponsiveSize(this.componentSizes.locationInfo.height)
    
    // 计算可用高度（减去所有固定组件的高度）
    const totalFixedHeight = statusBarHeight + resourceBarHeight + bottomNavHeight + locationInfoReservedHeight
    const availableHeight = this.safeArea.height - totalFixedHeight
    
    // 地图容器高度（确保不超出可用空间）
    const mapHeight = Math.max(
      this.getResponsiveSize(this.componentSizes.mapContainer.minHeight),
      Math.min(
        this.getResponsiveSize(this.componentSizes.mapContainer.maxHeight),
        availableHeight - this.getResponsiveSize(20) // 额外的边距
      )
    )
    
    // 地图容器宽度（保持在安全区域内）
    const mapWidth = this.safeArea.width - this.getResponsiveSize(10) // 左右边距
    
    // 计算地图内容的缩放比例（地图网格基准尺寸250x250）
    const contentScale = Math.min(
      (mapWidth - this.getResponsiveSize(20)) / 250, // 减去容器内边距
      (mapHeight - this.getResponsiveSize(40)) / 250  // 减去状态指示器和信息面板的空间
    )
    
    return {
      width: mapWidth,
      height: mapHeight,
      scale: Math.max(0.5, Math.min(1.2, contentScale)), // 限制缩放范围
      padding: this.getResponsiveSize(this.componentSizes.mapContainer.padding)
    }
  }
  
  /**
   * 获取组件样式配置
   * @param {string} componentName 组件名称
   * @returns {object} 样式配置
   */
  getComponentStyles(componentName) {
    const mapSize = this.calculateMapContainerSize()
    
    const styles = {
      statusBar: {
        height: `${this.getResponsiveSize(this.componentSizes.statusBar.height)}px`,
        padding: `${this.getResponsiveSize(8)}px ${this.getResponsiveSize(5)}px`,
        margin: `0 ${this.getResponsiveSize(3)}px`
      },
      
      statusLabel: {
        fontSize: `${this.getResponsiveFontSize(12)}px`
      },
      
      statusValue: {
        fontSize: `${this.getResponsiveFontSize(14)}px`
      },
      
      resourceBar: {
        height: `${this.getResponsiveSize(this.componentSizes.resourceBar.height)}px`,
        padding: `${this.getResponsiveSize(6)}px`,
        fontSize: `${this.getResponsiveFontSize(11)}px`,
        margin: `${this.getResponsiveSize(3)}px ${this.getResponsiveSize(5)}px`
      },
      
      mapContainer: {
        width: `${mapSize.width}px`,
        height: `${mapSize.height}px`,
        padding: `${mapSize.padding}px`,
        margin: `${this.getResponsiveSize(2)}px`,
        borderRadius: `${this.getResponsiveSize(12)}px`,
        borderWidth: `${this.getResponsiveSize(2)}px`
      },
      
      mapComponent: {
        transform: `scale(${mapSize.scale})`,
        transformOrigin: 'center center'
      },
      
      bottomNav: {
        height: `${this.getResponsiveSize(50)}px`,
        padding: `0 ${this.getResponsiveSize(20)}px`,
        margin: `0`,
        borderRadius: `${this.getResponsiveSize(25)}px ${this.getResponsiveSize(25)}px 0 0`
      },
      
      navBtn: {
        height: `${this.getResponsiveSize(35)}px`,
        fontSize: `${this.getResponsiveFontSize(11)}px`,
        borderRadius: `${this.getResponsiveSize(15)}px`,
        margin: `0 ${this.getResponsiveSize(5)}px`,
        padding: `0 ${this.getResponsiveSize(10)}px`
      },
      
      locationInfo: {
        height: `${this.getResponsiveSize(this.componentSizes.locationInfo.height)}px`,
        bottom: `${this.getResponsiveSize(60)}px`,
        padding: `${this.getResponsiveSize(10)}px`,
        margin: `0 ${this.getResponsiveSize(5)}px`,
        borderRadius: `${this.getResponsiveSize(10)}px`,
        borderWidth: `${this.getResponsiveSize(2)}px`
      }
    }
    
    return styles[componentName] || {}
  }
  
  /**
   * 获取当前设备信息
   * @returns {object} 设备信息
   */
  getDeviceInfo() {
    return {
      deviceSize: `${this.deviceWidth}x${this.deviceHeight}`,
      baseSize: `${this.baseWidth}x${this.baseHeight}`,
      scale: this.scale,
      safeArea: this.safeArea,
      isSquareScreen: Math.abs(this.deviceWidth - this.deviceHeight) < 10
    }
  }
}

// 创建全局实例
const responsiveManager = new ResponsiveManager()

module.exports = responsiveManager