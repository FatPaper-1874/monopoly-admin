export interface MapItem {
	_id: string;
	id: string;
	x: number;
	y: number;
	rotation: 0 | 1 | 2 | 3;
	type: ItemType;
	linkto?: MapItem;
	property?: Property;
}

export interface ItemType {
	id: string;
	color: string;
	name: string;
	model: Model;
	effectCode?: string;
	hasEvent: boolean;
	size: number;
}

export interface Model {
	id: string;
	name: string;
	fileUrl: string;
	fileName: string;
}

export interface Music {
	id: string;
	name: string;
	url: string;
}

export interface Property {
	id: string;
	name: string;
	sellCost: number;
	buildCost: number;
	cost_lv0: number;
	cost_lv1: number;
	cost_lv2: number;
	street: Street;
}

export interface Street {
	id: string;
	name: string;
	increase: number;
}

export interface ChanceCard {
	id: string;
	name: string;
	describe: string;
	icon: string;
	color: string;
	effectCode: string;
}

export interface GameMap {
	id: string;
	name: string;
	mapItems: MapItem[];
	properties: Property[];
	chanceCards: ChanceCard[];
	itemTypes: ItemType[];
}

export interface User {
	id: string;
	username: string;
	avatar: string;
	color: string;
}

export interface Role {
	id: string;
	baseUrl: string;
	roleName: string;
	fileName: string;
	color: string;
}
