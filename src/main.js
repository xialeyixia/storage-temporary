// import 'babel-polyfill';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import i18n from './lang'
import api from './assets/js/api'
import Dialog from '@/common/dialog.vue'
import "./assets/css/common.scss"

const app = createApp(App)
app.component("re-dialog", Dialog)
app.use(router);
app.use(ElementPlus);
app.use(i18n);
app.config.globalProperties.$api = api
app.mount("#app");
