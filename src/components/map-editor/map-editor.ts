import { getMapItemsListByMapId } from "@/utils/api/map";
import { createMapItem } from "@/utils/api/mapItem";
import { MapItem, ItemType } from "@/utils/interfaces";
import * as PIXI from "pixi.js";
import { Ref, watch } from "vue";

export class MapEditor {
	private canvasElement: HTMLCanvasElement;
	private column: number;
	private row: number;
	private cellSize: number;

	//Pixi实例
	private app: PIXI.Application;

	//图层
	private backGroundContainer: PIXI.Container;
	private dataContainer: PIXI.Container;
	private preContainer: PIXI.Container;

	//图像对象
	private preCell: PIXI.Graphics;
	private lineCell: PIXI.Graphics;

	//数据
	private currentX: Ref<number>;
	private currentY: Ref<number>;

	private currentType: Ref<ItemType | undefined>;
	private currentMapItemId: Ref<string>;

	private mapItemList: Ref<MapItem[]>;

	private mapId: string;

	constructor(
		canvasElement: HTMLCanvasElement,
		column: number,
		row: number,
		cellSize: number,
		mapItemList: Ref<MapItem[]>,
		currentMapItemId: Ref<string>,
		currentType: Ref<ItemType | undefined>,
		currentX: Ref<number>,
		currentY: Ref<number>,
		mapId: string
	) {
		this.canvasElement = canvasElement;
		this.column = column;
		this.row = row;
		this.cellSize = cellSize;

		this.mapItemList = mapItemList;
		this.currentMapItemId = currentMapItemId;
		this.currentType = currentType;

		this.currentX = currentX;
		this.currentY = currentY;

		this.mapId = mapId;

		this.app = new PIXI.Application({
			view: this.canvasElement,
			width: this.column * this.cellSize,
			height: this.row * this.cellSize,
			backgroundColor: 0xffcf70,
		});

		this.backGroundContainer = new PIXI.Container(); //背景图层
		this.dataContainer = new PIXI.Container(); //渲染以存在的数据图层
		this.preContainer = new PIXI.Container(); //渲染预览图层

		this.backGroundContainer.zIndex = 0;
		this.dataContainer.zIndex = 50;
		this.preContainer.zIndex = 100;

		this.dataContainer.sortableChildren = true;

		this.preCell = new PIXI.Graphics();
		this.lineCell = new PIXI.Graphics();
		this.preContainer.addChild(this.preCell);
		this.preContainer.addChild(this.lineCell);

		//初始化背景层
		for (let x = 0; x < this.column; x++) {
			for (let y = 0; y < this.row; y++) {
				// 创建一个Graphics对象
				const cell = new PIXI.Graphics();

				// 绘制一个矩形
				cell.beginFill(0, 0.5);
				cell.lineStyle(1, 0x999999);
				cell.drawRect(0, 0, cellSize, cellSize);
				cell.endFill();

				// 设置正方形的位置
				cell.x = x * cellSize;
				cell.y = y * cellSize;

				cell.eventMode = "dynamic";
				cell.on("mouseenter", () => {
					this.currentX.value = x;
					this.currentY.value = y;
				});
				cell.on("mouseout", () => {
					this.currentX.value = -100;
					this.currentY.value = -100;
				});
				cell.on("click", () => {
					if (this.currentType.value) this.addItem(x, y, this.currentType.value);
				});
				// 将正方形添加到容器中
				this.backGroundContainer.addChild(cell);
			}
		}

		this.app.stage.addChild(this.backGroundContainer);
		this.app.stage.addChild(this.dataContainer);
		this.app.stage.addChild(this.preContainer);
		this.app.render();

		//添加Watcher
		this.addWatcher();
	}

	private addWatcher() {
		watch(this.mapItemList, (newList) => {
			this.updateDataContainer(newList);
		});
		watch(this.currentMapItemId, (newId) => {
			this.updateCurrentMapItemId(newId);
		});
		watch([this.currentX, this.currentY], (newVal) => {
			const currentType = this.currentType.value;
			const preCell = this.preCell;
			const cellSize = this.cellSize;

			if (!currentType) return;
			preCell.clear();
			preCell.beginFill(currentType.color);
			preCell.lineStyle(1, 0xffffff);
			preCell.drawRect(0, 0, cellSize * currentType.size, cellSize * currentType.size);
			preCell.endFill();
			preCell.x = newVal[0] * cellSize;
			preCell.y = newVal[1] * cellSize;
			this.app.render();
		});
	}

	private async addItem(x: number, y: number, type: ItemType) {
		const id = `item-${x}-${y}`;
		const itemIndex = this.mapItemList.value.findIndex((item) => item.id === id);
		if (itemIndex == -1) {
			await createMapItem(id, x, y, type.id, this.mapId);
			this.mapItemList.value = (await getMapItemsListByMapId(this.mapId)) as any;
		}
	}

	public updateCurrentTypeItem(newTypeItem: ItemType | undefined) {
		this.currentType.value = newTypeItem;
	}

	private updateCurrentMapItemId(newId: string) {
		if (this.currentType.value) return;
		const mapItem = this.getMapItemById(newId);
		if (mapItem) {
			this.lineCell.clear();
			this.lineCell.beginFill(0, 0);
			this.lineCell.lineStyle(3, 0xffffff);
			this.lineCell.drawRect(
				mapItem.x * this.cellSize,
				mapItem.y * this.cellSize,
				this.cellSize * mapItem.type.size,
				this.cellSize * mapItem.type.size
			);
			this.lineCell.endFill();
			this.app.render();
		} else {
			this.lineCell.clear();
			this.app.render();
			return;
		}
	}

	private getMapItemById = (id: string) => {
		return this.mapItemList.value.find((item) => item.id === id);
	};

	public updateDataContainer(newList: MapItem[]) {
		console.log(newList);

		this.dataContainer.removeChildren();
		newList.forEach((item) => {
			//渲染方块
			const cell = new PIXI.Graphics();
			cell.zIndex = 0;
			cell.beginFill(item.type.color);
			cell.lineStyle(1, 0xffffff);
			cell.drawRect(
				item.x * this.cellSize,
				item.y * this.cellSize,
				this.cellSize * item.type.size,
				this.cellSize * item.type.size
			);
			cell.endFill();

			cell.eventMode = "dynamic";
			cell.on("mouseenter", () => {
				this.currentX.value = item.x;
				this.currentY.value = item.y;
			});
			cell.on("mouseout", () => {
				this.currentX.value = -100;
				this.currentY.value = -100;
			});
			cell.on("click", () => {
				if (this.currentType.value) return;
				this.currentMapItemId.value = item.id;
			});

			this.dataContainer.addChild(cell);

			//渲染连接
			if (item.link) {
				const linkLine = new PIXI.Graphics();
				const [sourceX, sourceY] = this.getMapItemCenter(item, this.cellSize);
				const [targetX, targetY] = this.getMapItemCenter(item.link, this.cellSize);
				linkLine.zIndex = 100;

				linkLine.lineStyle(3, 0xffffff, 1, 0.5);
				linkLine.moveTo(sourceX, sourceY);
				linkLine.lineTo(targetX, targetY);
				this.dataContainer.addChild(linkLine);
			}
		});
		this.app.render();
	}

	private getMapItemCenter = (mapItem: MapItem, cellSize: number) => {
		const x = (mapItem.x + mapItem.type.size / 2) * cellSize;
		const y = (mapItem.y + mapItem.type.size / 2) * cellSize;
		return [x, y];
	};
}
