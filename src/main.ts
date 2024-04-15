import { createApp } from "vue";
import "@/assets/style.scss";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router/index";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "@/utils/axios";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { fas } from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(fas);

const app = createApp(App);
app.use(router).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}
