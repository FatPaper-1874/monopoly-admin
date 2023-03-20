import { createRouter, createWebHashHistory } from "vue-router";
import mainVue from "@/views/main.vue";
import { menus, staticRoute } from './menus';

const menuRoutes = menus.map((menu) => {
	const { path, name, component } = menu;
	return { path, name, component };
});

const routes = [{ path: "/", component: mainVue, children: menuRoutes.concat(staticRoute) }];

const router = createRouter({ history: createWebHashHistory(), routes });

export default router;
