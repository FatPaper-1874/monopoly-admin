export interface MapItem {
	id: string;
	x: number;
	y: number;
	type: TypeItem;
	link?: MapItem;
}

export interface TypeItem {
	color: string;
	name: string;
	module: string;
	size: number;
}
