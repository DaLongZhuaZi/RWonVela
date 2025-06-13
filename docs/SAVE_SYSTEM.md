# RimWorld 存档系统文档

## 概述

本项目实现了一个完整的游戏存档系统，基于 VelaOS 的 storage 模块，提供了可靠的数据持久化功能。

## 系统架构

### 核心模块

1. **saveManager.js** - 存档管理器
   - 基础的存档、读档、删档功能
   - 自动存档机制
   - 存档列表管理
   - 设置数据管理

2. **saveUtils.js** - 存档工具类
   - 数据验证和完整性检查
   - 存档压缩和解压
   - 导入导出功能
   - 存档统计和清理

3. **saveTest.ux** - 测试页面
   - 完整的功能测试界面
   - 批量测试和压力测试
   - 实时日志显示

## 主要功能

### 基础功能

#### 存档管理
```javascript
// 保存游戏
await saveManager.saveGame('存档名称', gameData)

// 加载游戏
const gameData = await saveManager.loadGame('存档名称')

// 删除存档
await saveManager.deleteSave('存档名称')

// 获取存档列表
const saveList = await saveManager.getSaveList()
```

#### 自动存档
```javascript
// 启动自动存档（每5分钟）
saveManager.startAutoSave(gameData, 5 * 60 * 1000)

// 停止自动存档
saveManager.stopAutoSave()
```

#### 设置管理
```javascript
// 保存设置
await saveManager.saveSettings({
  soundEnabled: true,
  difficulty: 'normal'
})

// 加载设置
const settings = await saveManager.loadSettings()
```

### 高级功能

#### 数据验证
```javascript
// 验证存档数据完整性
const validation = saveUtils.validateSaveData(saveData)
if (!validation.isValid) {
  console.log('验证失败:', validation.errors)
}
```

#### 导入导出
```javascript
// 导出存档
const exportData = await saveUtils.exportSave('存档名称')

// 导入存档
const result = await saveUtils.importSave(exportData, '新存档名称')
```

#### 存档统计
```javascript
// 获取存档统计信息
const stats = await saveUtils.getSaveStatistics()
console.log(`总存档数: ${stats.totalSaves}`)
```

#### 清理功能
```javascript
// 清理过期存档（保留最近10个，或7天内的）
const result = await saveUtils.cleanupOldSaves(7 * 24 * 60 * 60 * 1000, 10)
```

## 数据结构

### 存档数据格式
```javascript
{
  name: '存档名称',
  version: '1.0.0',
  timestamp: 1640995200000,
  data: {
    // 游戏状态数据
    colonistCount: 5,
    resources: {
      food: 100,
      materials: 50,
      energy: 75
    },
    colonist: {
      // 殖民者数据
    },
    gameLog: [
      // 游戏日志
    ]
  }
}
```

### 设置数据格式
```javascript
{
  soundEnabled: true,
  musicEnabled: true,
  difficulty: 'normal',
  autoSaveInterval: 300000, // 5分钟
  language: 'zh-CN'
}
```

## 存储键值规范

- `rimworld_save_${saveName}` - 游戏存档数据
- `rimworld_save_list` - 存档列表索引
- `rimworld_settings` - 游戏设置
- `rimworld_autosave` - 自动存档数据

## 错误处理

### 常见错误类型

1. **存档不存在** - 尝试加载不存在的存档
2. **数据损坏** - 存档数据格式错误或损坏
3. **存储空间不足** - 设备存储空间不够
4. **版本不兼容** - 存档版本与当前游戏版本不兼容

### 错误处理策略

```javascript
try {
  const gameData = await saveManager.loadGame(saveName)
  // 处理成功加载的数据
} catch (error) {
  if (error.message.includes('不存在')) {
    // 处理存档不存在的情况
  } else if (error.message.includes('损坏')) {
    // 处理数据损坏的情况
  } else {
    // 处理其他错误
  }
}
```

## 性能优化

### 数据压缩
- 自动压缩存档数据，减少存储空间占用
- 支持数据完整性验证

### 批量操作
- 支持批量删除存档
- 批量验证存档数据

### 缓存机制
- 存档列表缓存，减少重复查询
- 设置数据缓存

## 测试功能

### 基础测试
- 保存/加载/删除功能测试
- 自动存档测试
- 设置管理测试

### 高级测试
- 数据验证测试
- 压缩功能测试
- 导入导出测试
- 存档统计测试

### 压力测试
- 大量存档创建测试
- 并发操作测试
- 存储空间限制测试

## 使用建议

### 最佳实践

1. **定期备份** - 使用导出功能定期备份重要存档
2. **版本管理** - 在游戏更新时注意存档兼容性
3. **存储清理** - 定期清理过期存档，释放存储空间
4. **错误处理** - 在关键操作中添加适当的错误处理

### 注意事项

1. **存档命名** - 避免使用特殊字符，建议使用中文、英文和数字
2. **数据大小** - 单个存档建议不超过1MB
3. **并发操作** - 避免同时进行多个存档操作
4. **设备兼容** - 确保在不同VelaOS设备上的兼容性

## 故障排除

### 常见问题

**Q: 存档加载失败怎么办？**
A: 首先检查存档是否存在，然后尝试验证存档数据完整性。如果数据损坏，可以尝试从备份恢复。

**Q: 自动存档不工作？**
A: 检查自动存档是否已启动，确认游戏数据获取函数是否正常工作。

**Q: 存储空间不足？**
A: 使用清理功能删除过期存档，或者手动删除不需要的存档。

**Q: 导入存档失败？**
A: 检查导入的数据格式是否正确，确认版本兼容性。

## 更新日志

### v1.0.0 (当前版本)
- 实现基础存档管理功能
- 添加自动存档机制
- 实现数据验证和压缩
- 添加导入导出功能
- 完善测试系统
- 添加存档统计和清理功能

## 技术支持

如果在使用过程中遇到问题，请：

1. 查看测试页面的日志输出
2. 检查浏览器控制台的错误信息
3. 验证VelaOS storage模块是否正常工作
4. 确认设备存储空间是否充足

---

*本文档随系统更新而更新，请关注最新版本。*