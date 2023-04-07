import { Component } from "vue";
import mapVue from "@/views/manage/map-manage.vue";
import modelVue from "@/views/manage/model-manage.vue";
import mapEditorVue from "@/components/map-editor/map-editor.vue";
import chanceCardVue from "@/views/manage/chance-card-manage.vue";
import chanceCardEditorVue from "@/components/chance-card-editor/chance-card-editor.vue";
import chanceCardSelectorVue from "@/components/chance-card-selector/chance-card-selector.vue";

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
	{ path: "/map", menuName: "地图管理", name: "map", component: mapVue, icon: "MapLocation" },
	{ path: "/model", menuName: "模型管理", name: "model", component: modelVue, icon: "Box" },
	{ path: "/chance-card", menuName: "机会卡管理", name: "chance-card", component: chanceCardVue, icon: "CreditCard" },
];

export const staticRoute: staticRouteItem[] = [
	{ path: "/map-editor", name: "map-editor", component: mapEditorVue },
	{ path: "/chance-card-editor", name: "chance-card-editor", component: chanceCardEditorVue },
];
