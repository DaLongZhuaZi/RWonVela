/**
 * 随机姓名生成器
 * 用于生成基于历史名人的随机姓名，支持中西文混搭
 */

class NameGenerator {
  constructor() {
    // 中文名字数据库
    this.chineseFirstNames = [
      // 男性名字
      '伟', '强', '磊', '军', '勇', '涛', '明', '超', '辉', '华', '建', '国', '峰', '雷', '刚',
      '龙', '文', '斌', '鹏', '飞', '志', '敏', '杰', '成', '康', '星', '光', '天', '达', '安',
      '彬', '博', '诚', '德', '方', '刚', '海', '瀚', '昊', '和', '弘', '鸿', '厚', '华', '辉',
      '嘉', '建', '健', '金', '锦', '景', '俊', '凯', '康', '乐', '力', '良', '亮', '林', '龙',
      '茂', '民', '明', '楠', '鹏', '平', '奇', '琦', '强', '庆', '秋', '然', '仁', '荣', '锐',
      '瑞', '睿', '尚', '盛', '思', '涛', '天', '伟', '文', '武', '西', '贤', '翔', '新', '星',
      '旭', '学', '雅', '岩', '彦', '阳', '耀', '叶', '宜', '毅', '英', '勇', '宇', '雨', '玉',
      '裕', '元', '远', '苑', '越', '泽', '哲', '振', '正', '志', '智', '中', '忠', '州', '舟',
      // 女性名字
      '芳', '娜', '敏', '静', '丽', '强', '洁', '美', '娟', '艳', '凤', '燕', '红', '霞', '玲',
      '梅', '莉', '兰', '英', '月', '苗', '佳', '雪', '琳', '晶', '欣', '萍', '雯', '倩', '伟',
      '蓉', '秀', '慧', '巧', '雅', '春', '翠', '青', '聪', '颖', '婷', '宁', '蕾', '薇', '菲',
      '珊', '莎', '锦', '黛', '青', '倩', '婷', '姿', '瑶', '怡', '悦', '昭', '冰', '爽', '琬',
      '茗', '羽', '希', '宁', '欣', '飘', '育', '滢', '馥', '筠', '柔', '竹', '霭', '凝', '晓',
      '欢', '霄', '枫', '芸', '菲', '寒', '伊', '亚', '宜', '可', '姬', '舒', '影', '荔', '枝',
      '思', '丽', '秀', '娟', '英', '华', '慧', '巧', '美', '娜', '静', '淑', '惠', '珠', '翠',
      '雅', '芝', '玉', '萍', '红', '娥', '玲', '芬', '芳', '燕', '彩', '春', '菊', '兰', '凤',
      '洁', '梅', '琳', '素', '云', '莲', '真', '环', '雪', '荣', '爱', '妹', '霞', '香', '月'
    ]

    // 西方名字数据库
    this.westernFirstNames = [
      // 男性名字
      'Alexander', 'William', 'James', 'John', 'Robert', 'Michael', 'David', 'Richard', 'Joseph', 'Thomas',
      'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew',
      'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Jason', 'Edward', 'Jeffrey',
      'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott',
      'Brandon', 'Benjamin', 'Samuel', 'Gregory', 'Frank', 'Raymond', 'Jack', 'Dennis', 'Jerry', 'Tyler',
      'Aaron', 'Jose', 'Henry', 'Adam', 'Douglas', 'Nathan', 'Peter', 'Zachary', 'Kyle', 'Noah',
      'Alan', 'Ethan', 'Jeremy', 'Lionel', 'Arthur', 'Sean', 'Albert', 'Wayne', 'Mason', 'Roy',
      'Martin', 'Louis', 'Philip', 'Eugene', 'Harold', 'Jordan', 'Carl', 'Jerry', 'Arthur', 'Roger',
      // 女性名字
      'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
      'Nancy', 'Lisa', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle',
      'Laura', 'Sarah', 'Kimberly', 'Deborah', 'Dorothy', 'Lisa', 'Nancy', 'Karen', 'Betty', 'Helen',
      'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle', 'Laura', 'Sarah', 'Kimberly', 'Deborah',
      'Amy', 'Angela', 'Ashley', 'Brenda', 'Emma', 'Olivia', 'Cynthia', 'Marie', 'Janet', 'Catherine',
      'Frances', 'Christine', 'Samantha', 'Debra', 'Rachel', 'Carolyn', 'Janet', 'Virginia', 'Maria', 'Heather',
      'Diane', 'Julie', 'Joyce', 'Victoria', 'Kelly', 'Christina', 'Joan', 'Evelyn', 'Lauren', 'Judith',
      'Megan', 'Cheryl', 'Andrea', 'Hannah', 'Jacqueline', 'Martha', 'Gloria', 'Teresa', 'Sara', 'Janice'
    ]

    // 中文姓氏数据库
    this.chineseLastNames = [
      '李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高',
       '林', '何', '郭', '马', '罗', '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧',
       '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕', '苏', '卢', '蒋', '蔡', '贾',
       '丁', '魏', '薛', '叶', '阎', '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜',
       '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆', '郝', '孔', '白', '崔', '康',
       '毛', '邱', '秦', '江', '史', '顾', '侯', '邵', '孟', '龙', '万', '段', '雷', '钱', '汤',
       '欧阳', '太史', '端木', '上官', '司马', '东方', '独孤', '南宫', '万俟', '闻人', '夏侯', '诸葛', '尉迟', '公羊', '赫连',
       '澹台', '皇甫', '宗政', '濮阳', '公冶', '太叔', '申屠', '公孙', '慕容', '仲孙', '钟离', '长孙', '宇文', '司徒', '鲜于'
     ]

     // 西方姓氏数据库
     this.westernLastNames = [
       'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
       'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
       'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
       'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
       'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
       'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
       'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
       'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
       'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
       'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez',
       'Connor', 'Peterson', 'Griffin', 'Hicks', 'Diaz', 'Hayes', 'Myers', 'Ford', 'Hamilton', 'Graham',
       'Sullivan', 'Wallace', 'Woods', 'Cole', 'West', 'Jordan', 'Owens', 'Reynolds', 'Fisher', 'Ellis',
       'Harrison', 'Gibson', 'Mcdonald', 'Cruz', 'Marshall', 'Ortiz', 'Gomez', 'Murray', 'Freeman', 'Wells',
       'Webb', 'Simpson', 'Stevens', 'Tucker', 'Porter', 'Hunter', 'Hicks', 'Crawford', 'Henry', 'Boyd'
     ]
  }

  /**
   * 生成随机姓名
   * @param {number} chineseNameProbability - 生成中文风格姓名的概率 (0-1)，默认0.6
   * @returns {string} 生成的随机姓名
   */
  generateRandomName(chineseNameProbability = 0.6) {
    // 随机决定是否生成中文姓名
    const isChineseName = Math.random() < chineseNameProbability
    
    if (isChineseName) {
      // 生成中文姓名：姓+名
      const lastName = this.chineseLastNames[Math.floor(Math.random() * this.chineseLastNames.length)]
      const firstName = this.chineseFirstNames[Math.floor(Math.random() * this.chineseFirstNames.length)]
      return lastName + firstName
    } else {
      // 生成西方姓名：名+姓
      const firstName = this.westernFirstNames[Math.floor(Math.random() * this.westernFirstNames.length)]
      const lastName = this.westernLastNames[Math.floor(Math.random() * this.westernLastNames.length)]
      return firstName + ' ' + lastName
    }
  }

  /**
   * 批量生成随机姓名
   * @param {number} count - 生成数量
   * @param {number} chineseNameProbability - 生成中文风格姓名的概率
   * @returns {Array<string>} 生成的姓名数组
   */
  generateMultipleNames(count, chineseNameProbability = 0.6) {
    const names = []
    for (let i = 0; i < count; i++) {
      names.push(this.generateRandomName(chineseNameProbability))
    }
    return names
  }

  /**
   * 获取姓名数据库统计信息
   * @returns {Object} 包含姓名数据库统计信息的对象
   */
  getStats() {
    const chineseCombinations = this.chineseFirstNames.length * this.chineseLastNames.length
    const westernCombinations = this.westernFirstNames.length * this.westernLastNames.length
    
    return {
      chineseFirstNames: this.chineseFirstNames.length,
      chineseLastNames: this.chineseLastNames.length,
      westernFirstNames: this.westernFirstNames.length,
      westernLastNames: this.westernLastNames.length,
      chineseCombinations: chineseCombinations,
      westernCombinations: westernCombinations,
      totalCombinations: chineseCombinations + westernCombinations
    }
  }

  /**
   * 生成指定类型的随机姓名
   * @param {string} type - 姓名类型 ('chinese' 或 'western')
   * @returns {string} 生成的随机姓名
   */
  generateNameByType(type) {
    if (type === 'chinese') {
      const lastName = this.chineseLastNames[Math.floor(Math.random() * this.chineseLastNames.length)]
      const firstName = this.chineseFirstNames[Math.floor(Math.random() * this.chineseFirstNames.length)]
      return lastName + firstName
    } else if (type === 'western') {
      const firstName = this.westernFirstNames[Math.floor(Math.random() * this.westernFirstNames.length)]
      const lastName = this.westernLastNames[Math.floor(Math.random() * this.westernLastNames.length)]
      return firstName + ' ' + lastName
    } else {
      // 默认使用随机类型
      return this.generateRandomName()
    }
  }
}

// 创建全局实例
const nameGenerator = new NameGenerator()

// 导出模块
export default nameGenerator
export { NameGenerator }