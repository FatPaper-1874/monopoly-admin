import {createRouter, createWebHashHistory} from "vue-router";
import mainVue from "@/views/main.vue";
import {menus, staticRoute} from "./menus";
import loginVue from "@/views/login/login.vue";
import {checkAdminIdentity} from "@/utils/api/user";
import path from "path";

const menuRoutes = menus.map((menu) => {
    const {path, name, component} = menu;
    return {path, name, component};
});

const routes = [
    {path: "/", alias: "/main", name: "main", component: mainVue, children: menuRoutes.concat(staticRoute)},
    {path: "/login", name: "login", component: loginVue},
];

const router = createRouter({history: createWebHashHistory(), routes});

router.beforeEach(async (to, form) => {
    if (!["/login"].includes(to.path) && (!localStorage.getItem("token"))) {
        // 将用户重定向到登录页面
        return {path: "/login"};
    }
});

export default router;
