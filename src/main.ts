import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

document.addEventListener('contextmenu', event => event.preventDefault());

createApp(App).use(ElementPlus).mount('#app');
