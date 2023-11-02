
import { createI18n } from 'vue-i18n'
import enLocale from './en' // 本地英文包
import zhLocale from './zh_cn' // 本地中文包

// 引入本地
const messages = {
  en: {
    ...enLocale, // es6的拓展运算符，相当于解析出每个对象
  },
  zh: {
    ...zhLocale,
  }
}
// 创建国际化实例
 const i18n = createI18n({
  locale: localStorage.getItem("language") || 'zh', 
  messages 
})
export default i18n
