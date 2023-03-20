import { Component } from "vue";
import mapVue from "@/views/manage/map.vue";
import modelVue from "@/views/manage/model.vue";
import mapEditorVue from "@/components/map-editor/map-editor.vue";

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
	{ path: "/map", menuName: "地图管理", name: "map", component: mapVue, icon: "" },
	{ path: "/model", menuName: "模型管理", name: "model", component: modelVue, icon: "" },
];

export const staticRoute: staticRouteItem[] = [
	{ path: "/map-editor", name: "map-editor", component: mapEditorVue },
];
