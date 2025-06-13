/**
 * 随机姓名生成器
 * 用于生成基于历史名人的随机姓名，支持中西文混搭
 */

class NameGenerator {
  constructor() {
    // 历史名人姓名数据库
    this.historicalFirstNames = [
      // 中国古代
      '李白', '杜甫', '苏轼', '辛弃疾', '陆游', '王维', '孟浩然', '白居易', '刘禹锡', '韩愈',
      '柳宗元', '欧阳修', '范仲淹', '司马迁', '班固', '诸葛亮', '关羽', '张飞', '赵云', '马超',
      '黄忠', '刘备', '曹操', '孙权', '周瑜', '鲁肃', '吕布', '董卓', '袁绍', '袁术',
      '孔子', '孟子', '老子', '庄子', '荀子', '墨子', '韩非子', '商鞅', '李斯', '秦始皇',
      '汉武帝', '唐太宗', '武则天', '康熙', '乾隆', '朱元璋', '刘邦', '项羽', '韩信', '萧何',
      // 中国近现代
      '孙中山', '毛泽东', '周恩来', '邓小平', '鲁迅', '胡适', '梁启超', '康有为', '谭嗣同', '林则徐',
      '曾国藩', '李鸿章', '左宗棠', '张之洞', '袁世凯', '蒋介石', '宋庆龄', '宋美龄', '张学良', '杨虎城',
      // 西方古代
      '亚历山大', '凯撒', '奥古斯都', '图拉真', '马可·奥勒留', '君士坦丁', '查理曼', '阿尔弗雷德', '威廉', '理查德',
      '亨利', '爱德华', '路易', '腓力', '查理', '弗朗西斯', '伊丽莎白', '玛丽', '维多利亚', '拿破仑',
      // 西方哲学家
      '苏格拉底', '柏拉图', '亚里士多德', '伊壁鸠鲁', '芝诺', '奥古斯丁', '阿奎那', '笛卡尔', '斯宾诺莎', '莱布尼茨',
      '洛克', '休谟', '康德', '黑格尔', '叔本华', '尼采', '萨特', '海德格尔', '维特根斯坦', '罗素',
      // 科学家
      '牛顿', '爱因斯坦', '达尔文', '伽利略', '哥白尼', '开普勒', '法拉第', '麦克斯韦', '居里', '爱迪生',
      '特斯拉', '霍金', '图灵', '冯·诺依曼', '薛定谔', '海森堡', '波尔', '普朗克', '费米', '奥本海默',
      // 艺术家
      '达·芬奇', '米开朗基罗', '拉斐尔', '毕加索', '梵高', '莫奈', '雷诺阿', '德加', '塞尚', '高更',
      '马蒂斯', '达利', '蒙德里安', '康定斯基', '波洛克', '安迪·沃霍尔', '巴斯奎特', '班克西', '草间弥生', '村上隆',
      // 音乐家
      '巴赫', '莫扎特', '贝多芬', '肖邦', '李斯特', '舒伯特', '舒曼', '勃拉姆斯', '瓦格纳', '德彪西',
      '拉威尔', '斯特拉文斯基', '普罗科菲耶夫', '肖斯塔科维奇', '柴可夫斯基', '拉赫玛尼诺夫', '西贝柳斯', '格里格', '德沃夏克', '巴托克',
      // 文学家
      '莎士比亚', '但丁', '歌德', '雨果', '巴尔扎克', '狄更斯', '托尔斯泰', '陀思妥耶夫斯基', '契诃夫', '普希金',
      '拜伦', '雪莱', '济慈', '华兹华斯', '艾略特', '乔伊斯', '卡夫卡', '博尔赫斯', '马尔克斯', '海明威',
      // 探险家
      '哥伦布', '麦哲伦', '达·伽马', '库克', '阿蒙森', '斯科特', '沙克尔顿', '林德伯格', '加加林', '阿姆斯特朗',
      // 日本名人
      '织田信长', '丰臣秀吉', '德川家康', '武田信玄', '上杉谦信', '伊达政宗', '真田幸村', '坂本龙马', '西乡隆盛', '大久保利通',
      '明治天皇', '昭和天皇', '福泽谕吉', '夏目漱石', '芥川龙之介', '川端康成', '三岛由纪夫', '村上春树', '宫崎骏', '黑泽明',
      // 印度名人
      '甘地', '尼赫鲁', '泰戈尔', '佛陀', '阿育王', '阿克巴', '沙贾汗', '奥朗则布', '提普苏丹', '拉马努金',
      // 阿拉伯名人
      '穆罕默德', '哈伦·拉希德', '萨拉丁', '伊本·西那', '伊本·赫勒敦', '鲁米', '哈菲兹', '奥马尔·海亚姆', '阿尔·花拉子米', '阿维森纳',
      // 非洲名人
      '曼德拉', '图图', '恩克鲁玛', '凯尼雅塔', '塞拉西', '纳赛尔', '萨达特', '卡扎菲', '阿明', '博卡萨',
      // 美洲名人
      '华盛顿', '杰斐逊', '林肯', '罗斯福', '肯尼迪', '马丁·路德·金', '马尔科姆·X', '切·格瓦拉', '卡斯特罗', '皮诺切特',
      '玻利瓦尔', '圣马丁', '伊达尔戈', '华雷斯', '迪亚斯', '庇隆', '阿连德', '富兰克林', '爱迪生', '福特',
      // 俄国名人
      '彼得大帝', '叶卡捷琳娜', '亚历山大', '尼古拉', '列宁', '斯大林', '赫鲁晓夫', '勃列日涅夫', '戈尔巴乔夫', '叶利钦',
      '普京', '托尔斯泰', '陀思妥耶夫斯基', '契诃夫', '普希金', '莱蒙托夫', '屠格涅夫', '高尔基', '帕斯捷尔纳克', '索尔仁尼琴'
    ]

    this.historicalLastNames = [
      // 中国姓氏
      '李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高',
      '林', '何', '郭', '马', '罗', '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧',
      '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕', '苏', '卢', '蒋', '蔡', '贾',
      '丁', '魏', '薛', '叶', '阎', '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜',
      '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆', '郝', '孔', '白', '崔', '康',
      '毛', '邱', '秦', '江', '史', '顾', '侯', '邵', '孟', '龙', '万', '段', '雷', '钱', '汤',
      // 西方姓氏
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
      // 欧洲贵族姓氏
      'von Habsburg', 'de Bourbon', 'Plantagenet', 'Tudor', 'Stuart', 'Hanover', 'Windsor', 'Romanov', 'Hohenzollern', 'Medici',
      'Borgia', 'Sforza', 'Visconti', 'Este', 'Gonzaga', 'Farnese', 'Orsini', 'Colonna', 'Savoy', 'Valois',
      'Capet', 'Carolingian', 'Merovingian', 'Ottonian', 'Salian', 'Hohenstaufen', 'Luxembourg', 'Wittelsbach', 'Wettin', 'Oldenburg',
      // 日本姓氏
      '田中', '佐藤', '鈴木', '高橋', '渡辺', '伊藤', '山本', '中村', '小林', '加藤',
      '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '斎藤', '清水',
      '山崎', '森', '池田', '橋本', '石川', '中島', '前田', '藤田', '後藤', '岡田',
      // 阿拉伯姓氏
      'al-Rashid', 'ibn Sina', 'al-Kindi', 'al-Farabi', 'ibn Rushd', 'al-Ghazali', 'ibn Khaldun', 'al-Biruni', 'al-Razi', 'ibn Battuta',
      'al-Tabari', 'al-Masudi', 'ibn Ishaq', 'al-Bukhari', 'al-Tirmidhi', 'ibn Majah', 'al-Nasai', 'abu Dawud', 'al-Hakim', 'al-Bayhaqi'
    ]
  }

  /**
   * 生成随机姓名
   * @param {number} chineseNameProbability - 生成中文风格姓名的概率 (0-1)，默认0.6
   * @returns {string} 生成的随机姓名
   */
  generateRandomName(chineseNameProbability = 0.6) {
    // 随机选择姓和名
    const firstName = this.historicalFirstNames[Math.floor(Math.random() * this.historicalFirstNames.length)]
    const lastName = this.historicalLastNames[Math.floor(Math.random() * this.historicalLastNames.length)]
    
    // 随机决定姓名顺序（中文姓在前，西文名在前）
    const isChineseName = Math.random() < chineseNameProbability
    
    if (isChineseName) {
      // 中文风格：姓+名
      return lastName + firstName
    } else {
      // 西文风格：名+姓
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
    return {
      firstNamesCount: this.historicalFirstNames.length,
      lastNamesCount: this.historicalLastNames.length,
      totalCombinations: this.historicalFirstNames.length * this.historicalLastNames.length * 2 // 乘以2因为有中西文两种风格
    }
  }
}

// 创建全局实例
const nameGenerator = new NameGenerator()

// 导出模块
export default nameGenerator
export { NameGenerator }