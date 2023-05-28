import { Component } from "vue";
import mapManageVue from "@/views/manage/map-manage.vue";
import modelManageVue from "@/views/manage/model-manage.vue";
import mapEditorVue from "@/components/map-editor/map-editor.vue";
import chanceCardManageVue from "@/views/manage/chance-card-manage.vue";
import chanceCardEditorVue from "@/components/chance-card-editor/chance-card-editor.vue";
import userManageVue from "@/views/manage/user-manage.vue";
import roleManageVue from "@/views/manage/role-manage.vue";

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
	{ path: "/user", menuName: "用户管理", name: "user", component: userManageVue, icon: "user" },
	{ path: "/role", menuName: "游戏角色管理", name: "role", component: roleManageVue, icon: "crown" },
	{ path: "/map", menuName: "地图管理", name: "map", component: mapManageVue, icon: "map-location-dot" },
	{ path: "/model", menuName: "模型管理", name: "model", component: modelManageVue, icon: "box" },
	{
		path: "/chance-card",
		menuName: "机会卡管理",
		name: "chance-card",
		component: chanceCardManageVue,
		icon: "credit-card",
	},
];

export const staticRoute: staticRouteItem[] = [
	{ path: "/map-editor", name: "map-editor", component: mapEditorVue },
	{ path: "/chance-card-editor", name: "chance-card-editor", component: chanceCardEditorVue },
];
