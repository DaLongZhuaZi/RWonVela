/**
 * 游戏存档管理器
 * 基于 velaOS storage API 实现游戏数据的持久化存储
 */
import storage from '@system.storage'

class SaveManager {
  constructor() {
    this.SAVE_PREFIX = 'rimworld_save_'
    this.SAVE_LIST_KEY = 'rimworld_save_list'
    this.AUTO_SAVE_KEY = 'rimworld_auto_save'
    this.SETTINGS_KEY = 'rimworld_settings'
  }

  /**
   * 保存游戏数据
   * @param {string} saveName 存档名称
   * @param {Object} gameData 游戏数据
   * @param {boolean} isAutoSave 是否为自动存档
   * @returns {Promise}
   */
  saveGame(saveName, gameData, isAutoSave = false) {
    return new Promise((resolve, reject) => {
      const saveKey = isAutoSave ? this.AUTO_SAVE_KEY : this.SAVE_PREFIX + saveName
      const saveData = {
        name: saveName,
        timestamp: Date.now(),
        version: '1.0.0',
        data: gameData,
        isAutoSave: isAutoSave
      }

      storage.set({
        key: saveKey,
        value: JSON.stringify(saveData),
        success: function() {
          console.log(`存档保存成功: ${saveName}`)
          if (!isAutoSave) {
            this.updateSaveList(saveName, saveKey)
          }
          resolve(saveData)
        }.bind(this),
        fail: function(data, code) {
          console.error(`存档保存失败: ${saveName}, 错误代码: ${code}`)
          reject(new Error(`保存失败: ${code}`))
        }
      })
    })
  }

  /**
   * 加载游戏数据
   * @param {string} saveName 存档名称
   * @param {boolean} isAutoSave 是否为自动存档
   * @returns {Promise}
   */
  loadGame(saveName, isAutoSave = false) {
    return new Promise((resolve, reject) => {
      const saveKey = isAutoSave ? this.AUTO_SAVE_KEY : this.SAVE_PREFIX + saveName

      storage.get({
        key: saveKey,
        success: function(data) {
          try {
            const saveData = JSON.parse(data)
            console.log(`存档加载成功: ${saveName}`)
            resolve(saveData)
          } catch (error) {
            console.error('加载游戏数据失败:', error)
            reject(new Error('存档数据损坏或不存在'))
          }
        },
        fail: function(data, code) {
          console.error(`存档加载失败: ${saveName}, 错误代码: ${code}`)
          reject(new Error(`加载失败: ${code}`))
        }
      })
    })
  }

  /**
   * 删除存档
   * @param {string} saveName 存档名称
   * @returns {Promise}
   */
  deleteSave(saveName) {
    return new Promise((resolve, reject) => {
      const saveKey = this.SAVE_PREFIX + saveName

      storage.delete({
        key: saveKey,
        success: function() {
          console.log(`存档删除成功: ${saveName}`)
          this.removeSaveFromList(saveName)
          resolve()
        }.bind(this),
        fail: function(data, code) {
          console.error(`存档删除失败: ${saveName}, 错误代码: ${code}`)
          reject(new Error(`删除失败: ${code}`))
        }
      })
    })
  }

  /**
   * 获取存档列表
   * @returns {Promise}
   */
  getSaveList() {
    return new Promise((resolve, reject) => {
      storage.get({
        key: this.SAVE_LIST_KEY,
        default: '[]',
        success: function(data) {
          try {
            const saveList = JSON.parse(data)
            resolve(saveList)
          } catch (error) {
            console.error('存档列表解析失败')
            resolve([])
          }
        },
        fail: function(data, code) {
          console.error(`获取存档列表失败, 错误代码: ${code}`)
          reject(new Error(`获取列表失败: ${code}`))
        }
      })
    })
  }

  /**
   * 更新存档列表
   * @param {string} saveName 存档名称
   * @param {string} saveKey 存档键
   */
  updateSaveList(saveName, saveKey) {
    this.getSaveList().then(saveList => {
      const existingIndex = saveList.findIndex(save => save.name === saveName)
      const saveInfo = {
        name: saveName,
        key: saveKey,
        timestamp: Date.now()
      }

      if (existingIndex >= 0) {
        saveList[existingIndex] = saveInfo
      } else {
        saveList.push(saveInfo)
      }

      // 按时间戳降序排列
      saveList.sort((a, b) => b.timestamp - a.timestamp)

      storage.set({
        key: this.SAVE_LIST_KEY,
        value: JSON.stringify(saveList),
        success: function() {
          console.log('存档列表更新成功')
        },
        fail: function(data, code) {
          console.error(`存档列表更新失败, 错误代码: ${code}`)
        }
      })
    })
  }

  /**
   * 从存档列表中移除存档
   * @param {string} saveName 存档名称
   */
  removeSaveFromList(saveName) {
    this.getSaveList().then(saveList => {
      const filteredList = saveList.filter(save => save.name !== saveName)

      storage.set({
        key: this.SAVE_LIST_KEY,
        value: JSON.stringify(filteredList),
        success: function() {
          console.log('存档列表更新成功')
        },
        fail: function(data, code) {
          console.error(`存档列表更新失败, 错误代码: ${code}`)
        }
      })
    })
  }

  /**
   * 检查是否存在自动存档
   * @returns {Promise}
   */
  hasAutoSave() {
    return new Promise((resolve) => {
      storage.get({
        key: this.AUTO_SAVE_KEY,
        success: function(data) {
          resolve(data && data.length > 0)
        },
        fail: function() {
          resolve(false)
        }
      })
    })
  }

  /**
   * 保存游戏设置
   * @param {Object} settings 设置数据
   * @returns {Promise}
   */
  saveSettings(settings) {
    return new Promise((resolve, reject) => {
      storage.set({
        key: this.SETTINGS_KEY,
        value: JSON.stringify(settings),
        success: function() {
          console.log('设置保存成功')
          resolve()
        },
        fail: function(data, code) {
          console.error(`设置保存失败, 错误代码: ${code}`)
          reject(new Error(`保存设置失败: ${code}`))
        }
      })
    })
  }

  /**
   * 加载游戏设置
   * @returns {Promise}
   */
  loadSettings() {
    return new Promise((resolve, reject) => {
      const defaultSettings = {
        autoSave: true,
        autoSaveInterval: 300000, // 5分钟
        soundEnabled: true,
        difficulty: 'normal'
      }

      storage.get({
        key: this.SETTINGS_KEY,
        default: JSON.stringify(defaultSettings),
        success: function(data) {
          try {
            const settings = JSON.parse(data)
            resolve(settings)
          } catch (error) {
            console.error('设置数据解析失败，使用默认设置')
            resolve(defaultSettings)
          }
        },
        fail: function(data, code) {
          console.error(`设置加载失败, 错误代码: ${code}，使用默认设置`)
          resolve(defaultSettings)
        }
      })
    })
  }

  /**
   * 清空所有存档数据
   * @returns {Promise}
   */
  clearAllSaves() {
    return new Promise((resolve, reject) => {
      this.getSaveList().then(saveList => {
        const deletePromises = saveList.map(save => 
          new Promise((res) => {
            storage.delete({
              key: save.key,
              success: function() { res() },
              fail: function() { res() } // 即使删除失败也继续
            })
          })
        )

        Promise.all(deletePromises).then(() => {
          // 清空存档列表
          storage.set({
            key: this.SAVE_LIST_KEY,
            value: '[]',
            success: function() {
              console.log('所有存档清空成功')
              resolve()
            },
            fail: function(data, code) {
              console.error(`清空存档列表失败, 错误代码: ${code}`)
              reject(new Error(`清空失败: ${code}`))
            }
          })
        })
      })
    })
  }

  /**
   * 获取存储使用情况（估算）
   * @returns {Promise}
   */
  getStorageInfo() {
    return new Promise((resolve) => {
      this.getSaveList().then(saveList => {
        const info = {
          totalSaves: saveList.length,
          hasAutoSave: false,
          oldestSave: null,
          newestSave: null
        }

        if (saveList.length > 0) {
          info.oldestSave = saveList[saveList.length - 1]
          info.newestSave = saveList[0]
        }

        this.hasAutoSave().then(hasAuto => {
          info.hasAutoSave = hasAuto
          resolve(info)
        })
      })
    })
  }
}

// 导出单例实例
export default new SaveManager()