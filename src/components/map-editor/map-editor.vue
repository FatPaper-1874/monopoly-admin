<script setup lang="ts">
import * as PIXI from "pixi.js";
import { computed, onBeforeMount, onMounted, reactive, ref, toRaw, watch } from "vue";
import { FormRules, FormInstance } from "element-plus";
import { MapItem, TypeItem } from "../../utils/interfaces";
import { ThreeBuilder } from "../../utils/three-builder";

const props = defineProps({
	column: {
		type: Number,
		default: 20,
	},
	row: {
		type: Number,
		default: 20,
	},
	width: {
		type: Number,
		default: 600,
	},
	height: {
		type: Number,
		default: 600,
	},
});

//导出
const mapName = ref("");
const handleExportMapData = () => {
	const tempMapItemIndex = pathFind(toRaw(mapData).filter((item) => item.type.name === "item"));

	const dataToExport = {
		name: mapName.value,
		data: toRaw(mapData),
		index: tempMapItemIndex,
	};

	const urlObject = window.URL || window.webkitURL || window;
	const exportData = new Blob([JSON.stringify(dataToExport)]);
	const save_link = document.createElement("a");
	save_link.href = urlObject.createObjectURL(exportData);
	save_link.download = `map-${mapName.value}.json`;
	save_link.click();
};

const pathFind = (itemList: MapItem[]) => {
	const tempList: MapItem[] = [];
	const startItem: MapItem = itemList[0];
	tempList.push(startItem);
	for (let i = 0; i < itemList.length - 1; i++) {
		const tempItem = tempList[tempList.length - 1];
		for (let j = 0; j < itemList.length; j++) {
			const nextTempItem = itemList[j];
			if (
				((tempItem.x + 1 === nextTempItem.x && tempItem.y === nextTempItem.y) ||
					(tempItem.x - 1 === nextTempItem.x && tempItem.y === nextTempItem.y) ||
					(tempItem.y + 1 === nextTempItem.y && tempItem.x === nextTempItem.x) ||
					(tempItem.y - 1 === nextTempItem.y && tempItem.x === nextTempItem.x)) &&
				!tempList.includes(nextTempItem)
			) {
				tempList.push(nextTempItem);
				break;
			}
		}
	}
	return tempList.map(item => item.id);
};

//类型管理

const typeList = reactive<Array<TypeItem>>([]);

const newTypeForm = reactive({
	name: "",
	module: "",
	color: "",
	size: 1,
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
	name: [{ required: true, message: "填写添加类型的名称", trigger: "blur" }],
	module: [{ required: true, message: "填写添加类型模型的名称", trigger: "blur" }],
	color: [{ required: true, message: "选择颜色", trigger: "blur" }],
	size: [{ required: true, message: "选择大小", trigger: "blur" }],
});

const currentType = ref<TypeItem>();

const handleAddType = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid) => {
		if (valid) {
			const data = { ...toRaw(newTypeForm) };
			console.log(data);

			typeList.push(data);
			localStorage.setItem("type-data", JSON.stringify(toRaw(typeList)));
			formEl.resetFields();
		} else {
			console.log("error submit!");
			return false;
		}
	});
};

const handleRemoveType = (index: number) => {
	currentType.value = undefined;
	typeList.splice(index, 1);
	localStorage.setItem("type-data", JSON.stringify(toRaw(typeList)));
};

//数据管理

const mapData = reactive<Array<MapItem>>([]);
const currentMapItemId = ref("");

const currentMapItem = computed(() => getMapItemById(currentMapItemId.value));

const getMapItemById = (id: string) => {
	return mapData.find((item) => item.id === id);
};

const handleAddMapItem = (mapItem: MapItem) => {
	const itemIndex = mapData.findIndex((item) => item.id === mapItem.id);
	if (itemIndex == -1) {
		mapData.push(mapItem);
	} else {
		mapData[itemIndex] = mapItem;
	}
	localStorage.setItem("map-data", JSON.stringify(toRaw(mapData)));
};

const handleRemoveMapItem = (id: string) => {
	const itemIndex = mapData.findIndex((item) => item.id === id);
	if (itemIndex != -1) {
		mapData.splice(itemIndex, 1);
		currentMapItemId.value = "";
		localStorage.setItem("map-data", JSON.stringify(toRaw(mapData)));
	}
};

const getMapItemCenter = (mapItem: MapItem, cellSize: number) => {
	const x = (mapItem.x + mapItem.type.size / 2) * cellSize;
	const y = (mapItem.y + mapItem.type.size / 2) * cellSize;
	return [x, y];
};

const linkTargetId = ref("");
const handleLink = (source: string, target: string) => {
	if (source === target) return;
	const sourceItem = getMapItemById(source);
	const targetItem = getMapItemById(target);
	if (sourceItem && targetItem) {
		sourceItem.link = targetItem;
	} else {
		if (sourceItem?.link) sourceItem.link = undefined;
	}
	localStorage.setItem("map-data", JSON.stringify(toRaw(mapData)));
};

//canvas管理
const currentX = ref(0);
const currentY = ref(0);

onMounted(() => {
	//加载模型预览
	const threeCanvas = document.getElementById("threeCanvas") as HTMLCanvasElement;
	const threeBuilder = new ThreeBuilder(threeCanvas);

	//加载地图编辑器
	const pixiCanvas = document.getElementById("pixiCanvas") as HTMLCanvasElement;
	const app = new PIXI.Application({
		view: pixiCanvas,
		width: props.width,
		height: props.height,
		backgroundColor: 0xffcf70,
	});

	const backGroundContainer = new PIXI.Container(); //背景图层
	const dataContainer = new PIXI.Container(); //渲染以存在的数据图层
	const preContainer = new PIXI.Container(); //渲染预览图层
	backGroundContainer.zIndex = 0;
	dataContainer.zIndex = 50;
	preContainer.zIndex = 100;

	dataContainer.sortableChildren = true;

	// 定义网格单元的大小
	const cellSize = Math.floor(props.width / props.row);

	const preCell = new PIXI.Graphics();
	const lineCell = new PIXI.Graphics();
	preContainer.addChild(preCell);
	preContainer.addChild(lineCell);

	watch(
		currentType,
		(newVal) => {
			if (newVal) preCell.beginFill(newVal.color);
		},
		{ deep: true }
	);

	watch(
		mapData,
		(newArr) => {
			dataContainer.removeChildren();
			threeBuilder.reloadMap(newArr);
			newArr.forEach((item) => {
				//渲染方块
				const cell = new PIXI.Graphics();
				cell.zIndex = 0;
				cell.beginFill(item.type.color);
				cell.lineStyle(1, 0xffffff);
				cell.drawRect(item.x * cellSize, item.y * cellSize, cellSize * item.type.size, cellSize * item.type.size);
				cell.endFill();

				cell.eventMode = "dynamic";
				cell.on("mouseenter", () => {
					currentX.value = item.x;
					currentY.value = item.y;
				});
				cell.on("mouseout", () => {
					currentX.value = -100;
					currentY.value = -100;
				});
				cell.on("click", () => {
					if (currentType.value) return;
					currentMapItemId.value = item.id;
				});

				dataContainer.addChild(cell);

				//渲染连接
				if (item.link) {
					const linkLine = new PIXI.Graphics();
					const [sourceX, sourceY] = getMapItemCenter(item, cellSize);
					const [targetX, targetY] = getMapItemCenter(item.link, cellSize);
					linkLine.zIndex = 100;

					linkLine.lineStyle(3, 0xffffff, 1, 0.5);
					linkLine.moveTo(sourceX, sourceY);
					linkLine.lineTo(targetX, targetY);
					dataContainer.addChild(linkLine);
				}
			});
			app.render();
		},
		{ deep: true }
	);

	watch([currentX, currentY], (newVal) => {
		if (!currentType.value) return;
		preCell.clear();
		preCell.beginFill(currentType.value.color);
		preCell.lineStyle(1, 0xffffff);
		preCell.drawRect(0, 0, cellSize * currentType.value.size, cellSize * currentType.value.size);
		preCell.endFill();
		preCell.x = newVal[0] * cellSize;
		preCell.y = newVal[1] * cellSize;
		app.render();
	});

	watch(currentMapItemId, (newVal) => {
		if (currentType.value) return;
		const mapItem = getMapItemById(newVal);
		if (mapItem) {
			lineCell.clear();
			lineCell.beginFill(0, 0);
			lineCell.lineStyle(3, 0xffffff);
			lineCell.drawRect(
				mapItem.x * cellSize,
				mapItem.y * cellSize,
				cellSize * mapItem.type.size,
				cellSize * mapItem.type.size
			);
			lineCell.endFill();
			app.render();
		} else {
			lineCell.clear();
			app.render();
			return;
		}
	});

	//读取之前保存的数据
	const storeTypeList = localStorage.getItem("type-data");
	const tempTypeList: Array<TypeItem> = storeTypeList ? JSON.parse(storeTypeList) : [];
	tempTypeList.forEach((item) => {
		typeList.push(item);
	});
	const storeMapData = localStorage.getItem("map-data");
	const tempMapData: Array<MapItem> = storeMapData ? JSON.parse(storeMapData) : [];
	tempMapData.forEach((item) => {
		mapData.push(item);
	});

	//初始化背景层
	for (let x = 0; x < 20; x++) {
		for (let y = 0; y < 20; y++) {
			// 创建一个Graphics对象
			const cell = new PIXI.Graphics();
			let mapItem: MapItem;
			const id = `item-${x}-${y}`;

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
				currentX.value = x;
				currentY.value = y;
			});
			cell.on("mouseout", () => {
				currentX.value = -100;
				currentY.value = -100;
			});
			cell.on("click", () => {
				if (currentType.value) {
					mapItem = {
						id,
						x,
						y,
						type: toRaw(currentType.value),
					};
					handleAddMapItem(mapItem);
				}
			});
			// 将正方形添加到容器中
			backGroundContainer.addChild(cell);
		}
	}

	app.stage.addChild(backGroundContainer);
	app.stage.addChild(dataContainer);
	app.stage.addChild(preContainer);
	app.render();
});
</script>

<template>
	<div class="map-editor-page">
		<div class="three-container">
			<canvas id="threeCanvas" width="700" height="650"></canvas>
		</div>

		<div class="canvas-container">
			<div class="current-coordinate">
				当前坐标: ({{ currentX }}, {{ currentY }}) 当前类型: {{ currentType?.name }} 当前模型: {{ currentType?.module }}
			</div>
			<canvas :width="props.width" :height="props.height" id="pixiCanvas"></canvas>
		</div>

		<div class="tool-container">
			<div class="type-list-container">
				<div class="type-add">
					<el-form label-position="left" label-width="70px" ref="formRef" :rules="rules" :model="newTypeForm">
						<el-form-item label="name" prop="name">
							<el-input v-model="newTypeForm.name" placeholder=""></el-input>
						</el-form-item>
						<el-form-item label="module" prop="module">
							<el-input v-model="newTypeForm.module" placeholder=""></el-input>
						</el-form-item>
						<el-form-item label="color" prop="color">
							<el-color-picker color-format="hex" v-model="newTypeForm.color" placeholder=""></el-color-picker>
						</el-form-item>
						<el-form-item label="size" prop="size">
							<el-input-number v-model="newTypeForm.size" :min="1" :max="3"></el-input-number>
						</el-form-item>
						<el-form-item>
							<el-button @click="handleAddType(formRef)" type="primary">添加类型</el-button>
						</el-form-item>
						<el-form-item label="选择类型">
							<el-select value-key="color" clearable v-model="currentType" placeholder="选择类型进入添加模式">
								<el-option v-for="(item, index) in typeList" :key="item.color" :value="item" :label="item.name">
									<div class="flex align-center justify-space-between">
										<span :style="{ color: item.color }">{{ item.name }}</span>
										<span
											@click.stop="handleRemoveType(index)"
											style="color: var(--el-color-danger); font-size: 0.8; float: right"
											>删除</span
										>
									</div>
								</el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>
			</div>

			<div class="map-item-editor">
				<div class="current-item">
					<p style="margin-bottom: 5px">当前选择id: {{ currentMapItemId }} type: {{ currentMapItem?.type.name }}</p>
					<el-input clearable style="margin-bottom: 5px" v-model="linkTargetId" placeholder="输入连接目标id">
						<template #append>
							<el-button
								:disabled="currentMapItemId === ''"
								@click="handleLink(currentMapItemId, linkTargetId)"
								type="primary"
								>link</el-button
							>
						</template>
					</el-input>
					<el-button
						style="width: 100%"
						:disabled="currentMapItemId === ''"
						type="danger"
						@click="handleRemoveMapItem(currentMapItemId)"
						>delete</el-button
					>
				</div>
				<el-table height="150" :data="mapData" style="width: 100%">
					<el-table-column prop="x" label="x" />
					<el-table-column prop="y" label="y" />
					<el-table-column prop="link.id" label="连接" />
					<el-table-column prop="type.name" label="类型"></el-table-column>
				</el-table>
			</div>

			<div class="map-data-export">
				<el-input v-model="mapName" placeholder="输入地图名称"></el-input>
				<el-button :disabled="mapData.length == 0 || mapName == ''" @click="handleExportMapData()" type="primary"
					>导出</el-button
				>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.map-editor-page {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	& > div {
		margin-left: 20px;
	}
}

.canvas-container,
.three-container {
	border-radius: 10px;
	background-color: #ffaa00;
	padding: 10px;

	& > canvas {
		border-radius: inherit;
		display: block;
	}
}

.canvas-container {
	padding-top: 0;
}

.current-coordinate {
	font-size: 1.1em;
	font-weight: bold;
	line-height: 2em;
	color: #ffffff;
}

.tool-container {
	width: 400px;
	display: flex;
	flex-direction: column;
	border-radius: 10px;
}

.type-add,
.map-item-editor,
.map-data-export {
	border-radius: 10px;
	padding: 15px;
	box-shadow: var(--el-box-shadow-light);
	background-color: #ffffff;
	margin-top: 10px;
}

.map-data-export {
	& > div {
		margin-bottom: 10px;
	}
}
</style>
