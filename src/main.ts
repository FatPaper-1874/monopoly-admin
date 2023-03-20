import { createApp } from "vue";
import "./style.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router/index";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { apiLogin } from './utils/api/login';
import "./utils/axios"

const app = createApp(App);
app.use(ElementPlus).use(router).mount("#app");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}

apiLogin('user1', '123456')
