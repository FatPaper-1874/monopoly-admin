import {Component} from "vue";

interface menuItem {
    path: string;
    menuName: string;
    name: string;
    component: Component;
    icon: string;
}

interface staticRouteItem {
    path: string;
    name: string;
    component: Component;
}

export const menus: menuItem[] = [
    // { path: "/user", menuName: "用户管理", name: "user", component: userManageVue, icon: "user" },
    {
        path: "/role",
        menuName: "游戏角色管理",
        name: "role",
        component: () => import('@/views/manage/role-manage/role-manage.vue'),
        icon: "crown"
    },
    {
        path: "/map",
        menuName: "地图管理",
        name: "map",
        component: () => import('@/views/manage/map-manage/map-manage.vue'),
        icon: "map-location-dot"
    },
    {
        path: "/model",
        menuName: "模型管理",
        name: "model",
        component: () => import('@/views/manage/model-manage/model-manage.vue'),
        icon: "box"
    },
    {
        path: "/chance-card",
        menuName: "机会卡管理",
        name: "chance-card",
        component: () => import('@/views/manage/chance-card-manage/chance-card-manage.vue'),
        icon: "credit-card",
    },
    {
        path: "/event-itemtype",
        menuName: "特殊ItemType管理",
        name: "event-itemtype",
        component: () => import('@/views/manage/event-itemtype-manage/event-itemtype-manage.vue'),
        icon: "wand-magic-sparkles",
    },
];

export const staticRoute: staticRouteItem[] = [
    {
        path: "/map-editor",
        name: "map-editor",
        component: () => import('@/views/manage/map-manage/components/map-editor/map-editor.vue')
    },
    {
        path: "/chance-card-editor", name: "chance-card-editor",
        component: () => import('@/views/manage/chance-card-manage/components/chance-card-editor.vue')
    },
    {
        path: "/event-itemtype-editor", name: "event-itemtype-editor",
        component: () => import('@/views/manage/event-itemtype-manage/components/event-itemtype-editor.vue')
    },
];
