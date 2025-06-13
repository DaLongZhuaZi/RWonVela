/**
 * 存档工具类
 * 提供存档数据的处理、验证、压缩等高级功能
 */
import saveManager from './saveManager.js'

class SaveUtils {
  constructor() {
    this.CURRENT_VERSION = '1.0.0'
    this.COMPATIBLE_VERSIONS = ['1.0.0']
  }

  /**
   * 验证存档数据完整性
   * @param {Object} saveData 存档数据
   * @returns {Object} 验证结果
   */
  validateSaveData(saveData) {
    const result = {
      isValid: true,
      errors: [],
      warnings: []
    }

    // 检查基本结构
    if (!saveData || typeof saveData !== 'object') {
      result.isValid = false
      result.errors.push('存档数据格式无效')
      return result
    }

    // 检查版本兼容性
    if (!saveData.version) {
      result.warnings.push('存档缺少版本信息')
    } else if (!this.COMPATIBLE_VERSIONS.includes(saveData.version)) {
      result.isValid = false
      result.errors.push(`存档版本 ${saveData.version} 不兼容，支持的版本: ${this.COMPATIBLE_VERSIONS.join(', ')}`)
    }

    // 检查必要字段
    const requiredFields = ['name', 'timestamp', 'data']
    for (const field of requiredFields) {
      if (!saveData[field]) {
        result.errors.push(`缺少必要字段: ${field}`)
        result.isValid = false
      }
    }

    // 检查游戏数据完整性
    if (saveData.data) {
      const gameDataResult = this.validateGameData(saveData.data)
      result.errors.push(...gameDataResult.errors)
      result.warnings.push(...gameDataResult.warnings)
      if (!gameDataResult.isValid) {
        result.isValid = false
      }
    }

    return result
  }

  /**
   * 验证游戏数据
   * @param {Object} gameData 游戏数据
   * @returns {Object} 验证结果
   */
  validateGameData(gameData) {
    const result = {
      isValid: true,
      errors: [],
      warnings: []
    }

    // 检查基本游戏状态
    if (typeof gameData.colonistCount !== 'number' || gameData.colonistCount < 0) {
      result.warnings.push('殖民者数量异常')
    }

    // 检查资源数据
    if (gameData.resources) {
      const resources = gameData.resources
      if (typeof resources.food !== 'number' || resources.food < 0) {
        result.warnings.push('食物数量异常')
      }
      if (typeof resources.materials !== 'number' || resources.materials < 0) {
        result.warnings.push('材料数量异常')
      }
      if (typeof resources.energy !== 'number' || resources.energy < 0) {
        result.warnings.push('能量数量异常')
      }
    } else {
      result.errors.push('缺少资源数据')
      result.isValid = false
    }

    // 检查殖民者数据
    if (!gameData.colonist) {
      result.warnings.push('缺少殖民者信息')
    }

    return result
  }

  /**
   * 压缩存档数据（简单的JSON字符串压缩）
   * @param {Object} data 要压缩的数据
   * @returns {string} 压缩后的字符串
   */
  compressData(data) {
    try {
      const jsonString = JSON.stringify(data)
      // 简单的压缩：移除不必要的空格和换行
      return jsonString.replace(/\s+/g, ' ').trim()
    } catch (error) {
      console.error('数据压缩失败:', error)
      return JSON.stringify(data)
    }
  }

  /**
   * 解压存档数据
   * @param {string} compressedData 压缩的数据
   * @returns {Object} 解压后的数据
   */
  decompressData(compressedData) {
    try {
      return JSON.parse(compressedData)
    } catch (error) {
      console.error('数据解压失败:', error)
      throw new Error('存档数据损坏')
    }
  }

  /**
   * 创建存档快照
   * @param {Object} gameData 游戏数据
   * @param {string} description 快照描述
   * @returns {Object} 快照数据
   */
  createSnapshot(gameData, description = '') {
    return {
      version: this.CURRENT_VERSION,
      timestamp: Date.now(),
      description: description,
      checksum: this.calculateChecksum(gameData),
      data: this.deepClone(gameData)
    }
  }

  /**
   * 计算数据校验和
   * @param {Object} data 数据
   * @returns {string} 校验和
   */
  calculateChecksum(data) {
    const jsonString = JSON.stringify(data)
    let hash = 0
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    return hash.toString(16)
  }

  /**
   * 深度克隆对象
   * @param {Object} obj 要克隆的对象
   * @returns {Object} 克隆后的对象
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }
    
    if (obj instanceof Date) {
      return new Date(obj.getTime())
    }
    
    if (obj instanceof Array) {
      return obj.map(item => this.deepClone(item))
    }
    
    const cloned = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepClone(obj[key])
      }
    }
    
    return cloned
  }

  /**
   * 格式化存档大小
   * @param {string} data 存档数据字符串
   * @returns {string} 格式化的大小
   */
  formatSaveSize(data) {
    const bytes = new Blob([data]).size
    if (bytes < 1024) {
      return `${bytes} B`
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }
  }

  /**
   * 导出存档数据为可分享格式
   * @param {string} saveName 存档名称
   * @returns {Promise<Object>} 导出的数据
   */
  async exportSave(saveName) {
    try {
      const saveData = await saveManager.loadGame(saveName)
      const validation = this.validateSaveData(saveData)
      
      return {
        success: true,
        data: {
          exportVersion: this.CURRENT_VERSION,
          exportTime: Date.now(),
          originalSave: saveData,
          validation: validation,
          checksum: this.calculateChecksum(saveData)
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 导入存档数据
   * @param {Object} exportData 导出的存档数据
   * @param {string} newSaveName 新存档名称
   * @returns {Promise<Object>} 导入结果
   */
  async importSave(exportData, newSaveName) {
    try {
      // 验证导出数据格式
      if (!exportData.originalSave) {
        throw new Error('无效的导出数据格式')
      }

      const saveData = exportData.originalSave
      const validation = this.validateSaveData(saveData)
      
      if (!validation.isValid) {
        throw new Error(`存档数据无效: ${validation.errors.join(', ')}`)
      }

      // 更新存档信息
      saveData.name = newSaveName
      saveData.timestamp = Date.now()
      
      await saveManager.saveGame(newSaveName, saveData.data)
      
      return {
        success: true,
        warnings: validation.warnings
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 获取存档统计信息
   * @returns {Promise<Object>} 统计信息
   */
  async getSaveStatistics() {
    try {
      const saveList = await saveManager.getSaveList()
      const storageInfo = await saveManager.getStorageInfo()
      
      let totalSize = 0
      let oldestTimestamp = Date.now()
      let newestTimestamp = 0
      
      for (const save of saveList) {
        if (save.timestamp < oldestTimestamp) {
          oldestTimestamp = save.timestamp
        }
        if (save.timestamp > newestTimestamp) {
          newestTimestamp = save.timestamp
        }
      }
      
      return {
        totalSaves: saveList.length,
        hasAutoSave: storageInfo.hasAutoSave,
        oldestSave: oldestTimestamp < Date.now() ? new Date(oldestTimestamp) : null,
        newestSave: newestTimestamp > 0 ? new Date(newestTimestamp) : null,
        estimatedSize: `${saveList.length * 2} KB` // 估算
      }
    } catch (error) {
      console.error('获取存档统计失败:', error)
      return {
        totalSaves: 0,
        hasAutoSave: false,
        oldestSave: null,
        newestSave: null,
        estimatedSize: '0 KB'
      }
    }
  }

  /**
   * 清理过期存档
   * @param {number} maxAge 最大保留时间（毫秒）
   * @param {number} maxCount 最大保留数量
   * @returns {Promise<Object>} 清理结果
   */
  async cleanupOldSaves(maxAge = 7 * 24 * 60 * 60 * 1000, maxCount = 10) {
    try {
      const saveList = await saveManager.getSaveList()
      const now = Date.now()
      let deletedCount = 0
      
      // 按时间排序，最新的在前
      saveList.sort((a, b) => b.timestamp - a.timestamp)
      
      const toDelete = []
      
      for (let i = 0; i < saveList.length; i++) {
        const save = saveList[i]
        const age = now - save.timestamp
        
        // 删除过期或超出数量限制的存档
        if (age > maxAge || i >= maxCount) {
          toDelete.push(save.name)
        }
      }
      
      // 执行删除
      for (const saveName of toDelete) {
        try {
          await saveManager.deleteSave(saveName)
          deletedCount++
        } catch (error) {
          console.error(`删除存档失败: ${saveName}`, error)
        }
      }
      
      return {
        success: true,
        deletedCount: deletedCount,
        remainingCount: saveList.length - deletedCount
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// 导出单例实例
export default new SaveUtils()