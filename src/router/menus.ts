import chanceCardManageVue from "@/views/manage/chance-card-manage/chance-card-manage.vue";
import chanceCardEditorVue from "@/views/manage/chance-card-manage/components/chance-card-editor.vue";
import eventItemtypeManageVue from "@/views/manage/event-itemtype-manage/event-itemtype-manage.vue";
import eventItemtypeEditorVue from "@/views/manage/event-itemtype-manage/components/event-itemtype-editor.vue";
import newMapEditorVue from "@/views/manage/map-manage/components/map-editor/map-editor.vue";
import mapManageVue from "@/views/manage/map-manage/map-manage.vue";
import modelManageVue from "@/views/manage/model-manage/model-manage.vue";
import roleManageVue from "@/views/manage/role-manage/role-manage.vue";
import userManageVue from "@/views/manage/user-manage/user-manage.vue";
import { Component } from "vue";
import loginVue from "@/views/login/login.vue";

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
	{
		path: "/event-itemtype",
		menuName: "特殊ItemType管理",
		name: "event-itemtype",
		component: eventItemtypeManageVue,
		icon: "wand-magic-sparkles",
	},
];

export const staticRoute: staticRouteItem[] = [
	{ path: "/map-editor", name: "map-editor", component: newMapEditorVue },
	{ path: "/chance-card-editor", name: "chance-card-editor", component: chanceCardEditorVue },
	{ path: "/event-itemtype-editor", name: "event-itemtype-editor", component: eventItemtypeEditorVue },
];
