<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRaw, watch, onBeforeMount } from "vue";
import { FormRules, FormInstance } from "element-plus";
import { MapItem, ItemType, Model, Property, ChanceCard } from "@/utils/interfaces";
import { MapEditor } from "./map-editor";
import { getModelList } from "@/utils/api/model";
import router from "@/router/index";
import { useRoute } from "vue-router";
import { getItemTypesListByMapId, getMapItemsListByMapId, getMapById } from "@/utils/api/map";
import { createItemTypes } from "@/utils/api/itemType";
import { deleteMapItem } from "../../utils/api/mapItem";
import { ThreeBuilder } from "@/utils/three-builder";

const props = defineProps({
	column: {
		type: Number,
		default: 30,
	},
	row: {
		type: Number,
		default: 20,
	},
	cellSize: {
		type: Number,
		default: 20,
	},
});

const route = useRoute();
const _mapId = route.query.mapId as string;
const _mapName = ref("");

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
	return tempList.map((item) => item.id);
};

//类型管理

const newTypeForm = reactive({
	name: "",
	modelId: "",
	color: "",
	size: 1,
});
const formRef = ref<FormInstance>();

const rules = reactive<FormRules>({
	name: [{ required: true, message: "填写添加类型的名称", trigger: "blur" }],
	modelId: [{ required: true, message: "填写添加类型模型的名称", trigger: "blur" }],
	color: [{ required: true, message: "选择颜色", trigger: "blur" }],
	size: [{ required: true, message: "选择大小", trigger: "blur" }],
});

//数据管理
const _linkTargetId = ref("");
const _currentMapItemId = ref("");
const _currentX = ref(-100);
const _currentY = ref(-100);

const _currentType = ref<ItemType>();

const _modelsList = ref<Model[]>([]);
const _mapItemslist = ref<Array<MapItem>>([]);

const _itemTypeList = ref<Array<ItemType>>([]);
const _propertiesList = ref<Property[]>([]);
const _chanceCardsList = ref<ChanceCard[]>([]);

const _currentMapItem = computed(() => getMapItemById(_currentMapItemId.value));

const getMapItemById = (id: string) => {
	return _mapItemslist.value.find((item) => item.id === id);
};

const loadModelList = async () => {
	const { modelList } = await getModelList(1, 100);

	_modelsList.value = modelList;
};

const loadMapItemsList = async () => {
	_mapItemslist.value = (await getMapItemsListByMapId(_mapId)) as any;
};

const handleAddType = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid) => {
		if (valid) {
			const { name, color, modelId, size } = { ...toRaw(newTypeForm) };
			await createItemTypes(name, color, size, modelId, _mapId);
			_itemTypeList.value = (await getItemTypesListByMapId(_mapId)) as any;
			formEl.resetFields();
		} else {
			console.log("error submit!");
			return false;
		}
	});
};

const removeItem = async () => {
	if (_currentMapItem.value) {
		await deleteMapItem(_currentMapItem.value.id);
		_currentMapItemId.value = "";
		await loadMapItemsList();
	}
};

const handleRemoveType = (id: number) => {};

onBeforeMount(async () => {
	if (_mapId) {
		const { name, mapItems, properties, chanceCards, itemTypes } = (await getMapById(_mapId)) as any;

		_mapName.value = name;
		_mapItemslist.value = mapItems;
		_propertiesList.value = properties;
		_chanceCardsList.value = chanceCards;
		_itemTypeList.value = itemTypes;
	} else {
		router.replace("/map");
	}
});

onMounted(async () => {
	await loadModelList();
	const pixiCanvas = document.getElementById("pixiCanvas") as HTMLCanvasElement;
	const mapEditor = new MapEditor(
		pixiCanvas,
		props.column,
		props.row,
		props.cellSize,
		_mapItemslist,
		_currentMapItemId,
		_currentType,
		_currentX,
		_currentY,
		_mapId
	);
	mapEditor.updateDataContainer(_mapItemslist.value);

	const threeCanvas = document.getElementById("threeCanvas") as HTMLCanvasElement;
	const threeBuilder = new ThreeBuilder(threeCanvas);
	
	await threeBuilder.loadModels(_itemTypeList.value);
	await threeBuilder.loadMapItems(_mapItemslist.value);

	watch(_mapItemslist, (newDataList) => {
		threeBuilder.reloadMapItems(newDataList);
	});

	watch(_itemTypeList, (newDataList) => {
		threeBuilder.loadModels(newDataList);
	});
});
</script>

<template>
	<div class="map-editor-page">
		<div style="display: flex; flex-direction: column">
			<div class="canvas-container">
				<canvas :width="props.column * props.cellSize" :height="props.row * props.cellSize" id="threeCanvas"></canvas>
			</div>
			<div class="canvas-container">
				<div class="current-coordinate">当前坐标: ({{ _currentX }}, {{ _currentY }})</div>
				<canvas :width="props.column * props.cellSize" :height="props.row * props.cellSize" id="pixiCanvas"></canvas>
			</div>
		</div>

		<div class="tool-container">
			<div class="type-list-container">
				<div class="type-add">
					<el-form label-position="left" label-width="100px" ref="formRef" :rules="rules" :model="newTypeForm">
						<el-form-item label="类型名称" prop="name">
							<el-input v-model="newTypeForm.name" placeholder=""></el-input>
						</el-form-item>

						<el-form-item label="模型" prop="modelId">
							<el-select clearable v-model="newTypeForm.modelId" placeholder="选择模型">
								<el-option v-for="model in _modelsList" :key="model.id" :value="model.id" :label="model.name">
								</el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="代表颜色" prop="color">
							<el-color-picker color-format="hex" v-model="newTypeForm.color" placeholder=""></el-color-picker>
						</el-form-item>

						<el-form-item label="占用格数" prop="size">
							<el-input-number v-model="newTypeForm.size" :min="1" :max="3"></el-input-number>
						</el-form-item>

						<el-form-item>
							<el-button @click="handleAddType(formRef)" type="primary">添加类型</el-button>
						</el-form-item>
					</el-form>
				</div>

				<div class="current-type-preview">
					<el-select value-key="color" clearable v-model="_currentType" placeholder="选择类型进入添加模式">
						<el-option v-for="(item, index) in _itemTypeList" :key="item.color" :value="item" :label="item.name">
							<div class="flex align-center justify-space-between">
								<span :style="{ color: item.color }">{{ item.name }}</span>
							</div>
						</el-option>
					</el-select>
				</div>
			</div>

			<div class="map-item-editor">
				<div class="current-item">
					<p style="margin-bottom: 5px">当前选择id: {{ _currentMapItemId }} type: {{ _currentMapItem?.type.name }}</p>
					<el-input clearable style="margin-bottom: 5px" v-model="_linkTargetId" placeholder="输入连接目标id">
						<template #append>
							<el-button :disabled="_currentMapItemId === ''" type="primary">link</el-button>
						</template>
					</el-input>
					<el-button @click="removeItem()" style="width: 100%" :disabled="_currentMapItemId === ''" type="danger"
						>delete</el-button
					>
				</div>
				<el-table height="150" :data="_mapItemslist" style="width: 100%">
					<el-table-column prop="x" label="x" />
					<el-table-column prop="y" label="y" />
					<el-table-column prop="link.id" label="连接" />
					<el-table-column prop="type.name" label="类型"></el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.map-editor-page {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.canvas-container {
	border-radius: 10px;
	background-color: #ffaa00;
	padding: 10px;
	margin-bottom: 10px;

	& > canvas {
		border-radius: inherit;
		display: block;
	}
}

.current-coordinate {
	font-size: 0.9em;
	font-weight: bold;
	line-height: 2em;
	color: #ffffff;
}

.tool-container {
	width: 300px;
	height: 100%;
	display: flex;
	flex-direction: column;
	border-radius: 10px;
}

.current-type-preview {
}

.type-add,
.current-type-preview,
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
