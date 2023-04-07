<script setup lang="ts">
import router from "@/router/index";
import { createItemTypes } from "@/utils/api/itemType";
import {
	getItemTypesListByMapId,
	getMapById,
	getMapItemsListByMapId,
	getPropertyListByMapId,
	getStreetListByMapId,
	getChanceCardsListByMapId,
	updateIndexList,
} from "@/utils/api/map";
import { getModelList } from "@/utils/api/model";
import { ChanceCard, ItemType, MapItem, Model, Property } from "@/utils/interfaces";
import { ThreeBuilder } from "@/utils/three-builder";
import { FormInstance, FormRules, ElMessage } from "element-plus";
import { computed, onBeforeMount, onMounted, reactive, ref, toRaw, watch } from "vue";
import { useRoute } from "vue-router";
import { deleteMapItem, linkMapItem } from "../../utils/api/mapItem";
import { createProperty, updateProperty } from "../../utils/api/property";
import { createStreet } from "../../utils/api/street";
import { Street } from "../../utils/interfaces";
import { ModelPreview } from "../../utils/model-preview";
import { MapEditor } from "./map-editor";
import chanceCardVue from "@/components/sample/chance-card.vue";
import { tr } from "element-plus/es/locale";
import ChanceCardSelectorVue from "@/components/chance-card-selector/chance-card-selector.vue";
import { useClipboard } from "@vueuse/core";

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

//类型表单管理

const newTypeForm = reactive({
	name: "",
	modelId: "",
	color: "",
	size: 1,
});
const itemTypeFormRef = ref<FormInstance>();

const itemTypeFormRules = reactive<FormRules>({
	name: [{ required: true, message: "填写添加类型的名称", trigger: "blur" }],
	modelId: [{ required: true, message: "填写添加类型模型的名称", trigger: "blur" }],
	color: [{ required: true, message: "选择颜色", trigger: "blur" }],
	size: [{ required: true, message: "选择大小", trigger: "blur" }],
});

//地皮表单管理
const propertyId = ref("");

const newPropertyForm = reactive({
	name: "",
	sellCost: 0,
	buildCost: 0,
	cost_lv0: 0,
	cost_lv1: 0,
	cost_lv2: 0,
	streetId: "",
});
const propertyFormRef = ref<FormInstance>();

const propertyFormRules = reactive<FormRules>({
	name: [{ required: true, message: "填写地皮的名称", trigger: "blur" }],
	sellCost: [{ required: true, message: "填写空地价格", trigger: "blur" }],
	buildCost: [{ required: true, message: "填写建楼价格", trigger: "blur" }],
	cost_lv0: [{ required: true, message: "填写空地过路费", trigger: "blur" }],
	cost_lv1: [{ required: true, message: "填写有一栋楼的过路费", trigger: "blur" }],
	cost_lv2: [{ required: true, message: "填写有两栋楼的过路费", trigger: "blur" }],
	streetId: [{ required: true, message: "选择街道", trigger: "blur" }],
});

//街道表单管理

const newStreetForm = reactive({
	name: "",
	increase: 1,
});

const streetFormRef = ref<FormInstance>();

const streetFormRules = reactive<FormRules>({
	name: [{ required: true, message: "填写街道的名称", trigger: "blur" }],
	increase: [{ required: true, message: "填写过路费增值", trigger: "blur" }],
});

//数据管理
const _linkTargetId = ref("");
const _currentMapItemId = ref("");
const _currentX = ref(-100);
const _currentY = ref(-100);

const _currentType = ref<ItemType>();

const _modelsList = ref<Model[]>([]);
const _streetList = ref<Street[]>([]);
const _mapItemslist = ref<MapItem[]>([]);
const _mapIndexList = ref<string[]>([]);

const _itemTypeList = ref<Array<ItemType>>([]);
const _propertiesList = ref<Property[]>([]);
const _chanceCardsList = ref<ChanceCard[]>([]);

const _chanceCardSeletorVisible = ref(false);

const _itemTypeIdToAppendPath = ref("");

const _currentMapItem = computed(() => getMapItemById(_currentMapItemId.value));
const _currentModelName = computed(() => {
	if (_currentType.value) {
		return _currentType.value.model.fileName;
	} else {
		return "";
	}
});

const getMapItemById = (id: string) => {
	return _mapItemslist.value.find((item) => item.id === id);
};

const loadProperList = async () => {
	_propertiesList.value = (await getPropertyListByMapId(_mapId)) as any;
};

const loadModelList = async () => {
	const { modelList } = await getModelList(1, 100);

	_modelsList.value = modelList;
};

const loadChanceCardList = async () => {
	const chanceCardsList = (await getChanceCardsListByMapId(_mapId)) as any;
	console.log(chanceCardsList);

	_chanceCardsList.value = chanceCardsList;
};

const loadMapItemsList = async () => {
	_mapItemslist.value = (await getMapItemsListByMapId(_mapId)) as any;
};

const handleChooseChanceCard = async () => {
	_chanceCardSeletorVisible.value = true;
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

const handleCreateStreet = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid) => {
		if (valid) {
			const { name, increase } = { ...toRaw(newStreetForm) };
			console.log(name, increase);

			await createStreet(name, increase, _mapId);
			_streetList.value = (await getStreetListByMapId(_mapId)) as any;
			console.log(_streetList.value);

			formEl.resetFields();
		} else {
			console.log("error submit!");
			return false;
		}
	});
};

const handleCreateOrUpdateProperty = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid) => {
		if (valid) {
			const { name, sellCost, buildCost, cost_lv0, cost_lv1, cost_lv2, streetId } = {
				...toRaw(newPropertyForm),
			};

			if (propertyId.value) {
				await updateProperty(propertyId.value, name, sellCost, buildCost, cost_lv0, cost_lv1, cost_lv2, streetId);
			} else {
				await createProperty(
					name,
					sellCost,
					buildCost,
					cost_lv0,
					cost_lv1,
					cost_lv2,
					_currentMapItemId.value,
					streetId,
					_mapId
				);
			}
			await loadProperList();
		} else {
			console.log("error submit!");
			return false;
		}
	});
};

const handleChanceCardSelectorClose = async () => {
	_chanceCardSeletorVisible.value = false;
};

const handleChanceCardSelectorConfirm = async () => {
	await loadChanceCardList();
	_chanceCardSeletorVisible.value = false;
};

const handleAppendIndexList = async () => {
	const tempMapItemsList = _mapItemslist.value.filter((item) => item.type.id === _itemTypeIdToAppendPath.value);
	if (tempMapItemsList.length > 0) {
		let indexList: string[] = [];
		try {
			indexList = findPath(tempMapItemsList);
		} catch (e: any) {
			ElMessage({ message: e.message, type: "error" });
		}
		await updateIndexList(_mapId, indexList);
		await loadMapInfo();
	}
};

const handleCopyCurrentId = async () => {
	_linkTargetId.value = _currentMapItemId.value;
	ElMessage({ message: "复制成功", type: "success" });
};

const findPath = (itemList: MapItem[]) => {
	const tempList: MapItem[] = [];
	const startItem: MapItem = itemList[0];
	const isAdjacent = (sourceItem: MapItem, targetItem: MapItem) => {
		return (
			(sourceItem.x + 1 === targetItem.x && sourceItem.y === targetItem.y) ||
			(sourceItem.x - 1 === targetItem.x && sourceItem.y === targetItem.y) ||
			(sourceItem.y + 1 === targetItem.y && sourceItem.x === targetItem.x) ||
			(sourceItem.y - 1 === targetItem.y && sourceItem.x === targetItem.x)
		);
	};
	tempList.push(startItem);
	for (let i = 0; i < itemList.length - 1; i++) {
		const tempItem = tempList[tempList.length - 1];
		for (let j = 0; j < itemList.length; j++) {
			const nextTempItem = itemList[j];
			if (isAdjacent(tempItem, nextTempItem) && !tempList.includes(nextTempItem)) {
				tempList.push(nextTempItem);
				break;
			}
		}
	}
	if (!isAdjacent(tempList[0], tempList[tempList.length - 1])) throw Error("不是闭环的的地图");
	return tempList.map((item) => item.id);
};

const handleLinkMapItem = async () => {
	await linkMapItem(_currentMapItemId.value, _linkTargetId.value);
	await loadMapItemsList();
	_linkTargetId.value = "";
};

watch(_currentMapItem, (newMapItem) => {
	if (newMapItem) {
		if (newMapItem.property) {
			const newPropertyId = newMapItem.property.id;
			const currentProperty = _propertiesList.value.find((property) => property.id === newPropertyId);
			if (!currentProperty) return;
			propertyId.value = currentProperty.id;
			newPropertyForm.name = currentProperty.name;
			newPropertyForm.sellCost = currentProperty.sellCost;
			newPropertyForm.buildCost = currentProperty.buildCost;
			newPropertyForm.cost_lv0 = currentProperty.cost_lv0;
			newPropertyForm.cost_lv1 = currentProperty.cost_lv1;
			newPropertyForm.cost_lv2 = currentProperty.cost_lv2;
			newPropertyForm.streetId = currentProperty.street.id;
		} else {
			propertyId.value = "";
			propertyFormRef.value?.resetFields();
		}
	} else {
		propertyFormRef.value?.resetFields();
	}
});

const loadMapInfo = async () => {
	if (_mapId) {
		const { name, mapItems, properties, chanceCards, itemTypes, streets, indexList } = (await getMapById(
			_mapId
		)) as any;

		_mapName.value = name;
		_itemTypeList.value = itemTypes;
		_mapItemslist.value = mapItems;
		_propertiesList.value = properties;
		_chanceCardsList.value = chanceCards;
		_streetList.value = streets;
		_mapIndexList.value = indexList;
	} else {
		router.replace({ path: "/map" });
	}
};

onMounted(async () => {
	await loadMapInfo();
	await loadModelList();

	const pixiCanvas = document.getElementById("pixiCanvas") as HTMLCanvasElement;
	const mapEditor = new MapEditor(
		pixiCanvas,
		props.column,
		props.row,
		props.cellSize,
		_propertiesList,
		_mapItemslist,
		_mapIndexList,
		_currentMapItemId,
		_currentType,
		_currentX,
		_currentY,
		_mapId
	);
	mapEditor.updateMapItemList(_mapItemslist.value);
	mapEditor.updatePropertyList(_propertiesList.value);
	mapEditor.updateIndexList(_mapIndexList.value);

	const threeCanvas = document.getElementById("threeCanvas") as HTMLCanvasElement;
	const threeBuilder = new ThreeBuilder(threeCanvas);

	await threeBuilder.loadModels(_itemTypeList.value);
	await threeBuilder.loadMapItems(_mapItemslist.value);

	threeBuilder.lookAtCenter();

	watch(_mapItemslist, async (newDataList) => {
		await threeBuilder.reloadMapItems(newDataList);
	});

	watch(_itemTypeList, async (newDataList) => {
		await threeBuilder.loadModels(newDataList);
	});

	const modelPreviewCanvas = document.getElementById("model-preview__canvas") as HTMLCanvasElement;
	const modelPreview = new ModelPreview(modelPreviewCanvas);

	watch(_currentModelName, async (newModel) => {
		await modelPreview.loadModel(newModel, true);
	});
});
</script>

<template>
	<div class="map-editor-page">
		<div class="tool-container">
			<div class="chance-card-container">
				<el-button type="primary" size="large" @click="handleChooseChanceCard">选择机会卡</el-button>
				<div class="chance-card-list">
					<chanceCardVue
						v-for="chanceCard in _chanceCardsList"
						:key="chanceCard.id"
						:id="chanceCard.id"
						:name="chanceCard.name"
						:describe="chanceCard.describe"
						:icon="chanceCard.icon"
						:color="chanceCard.color"
					></chanceCardVue>
				</div>
			</div>

			<div class="type-list-container">
				<div class="type-add">
					<el-form
						label-position="left"
						label-width="100px"
						ref="itemTypeFormRef"
						:rules="itemTypeFormRules"
						:model="newTypeForm"
					>
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
							<el-button @click="handleAddType(itemTypeFormRef)" type="primary">添加类型</el-button>
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
					<canvas id="model-preview__canvas"></canvas>
				</div>
			</div>
		</div>

		<div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%">
			<div class="canvas-container">
				<div class="current-coordinate">地图预览</div>
				<canvas :width="props.column * props.cellSize" :height="props.row * props.cellSize" id="threeCanvas"></canvas>
			</div>
			<div class="canvas-container">
				<div class="current-coordinate">当前坐标: ({{ _currentX }}, {{ _currentY }})</div>
				<canvas :width="props.column * props.cellSize" :height="props.row * props.cellSize" id="pixiCanvas"></canvas>
			</div>
		</div>

		<div class="tool-container-2">
			<div class="map-name">
				<el-input v-model="_mapName"></el-input><el-button inline type="primary">修改</el-button>
			</div>

			<div class="street-add">
				<el-form
					:inline="true"
					label-position="top"
					label-width="100px"
					ref="streetFormRef"
					:rules="streetFormRules"
					:model="newStreetForm"
					size="small"
				>
					<el-form-item label="街道名称" prop="name">
						<el-input v-model="newStreetForm.name" placeholder=""></el-input>
					</el-form-item>

					<el-form-item label="过路费增值" prop="name">
						<el-input-number :min="1" :step="0.1" v-model="newStreetForm.increase" placeholder=""></el-input-number>
					</el-form-item>

					<el-form-item label="&nbsp">
						<el-button @click="handleCreateStreet(streetFormRef)" type="primary">添加街道</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="property-add">
				<div class="map-item-editor">
					<el-descriptions border title="MapItem详情" direction="horizontal" :column="4" size="small">
						<el-descriptions-item label-align="center" align="center" :span="4" label="id"
							>{{ _currentMapItem?.id
							}}<el-button style="margin-left: 10px" @click="handleCopyCurrentId" size="small" type="primary" link
								>复制ID到Link输入框</el-button
							></el-descriptions-item
						>
						<el-descriptions-item label-align="center" align="center" :span="4" label="名称">{{
							_currentMapItem?._id
						}}</el-descriptions-item>
						<el-descriptions-item label-align="center" align="center" :span="2" label="类型">{{
							_currentMapItem?.type.name
						}}</el-descriptions-item>
						<el-descriptions-item label-align="center" align="center" :span="2" label="坐标"
							>[{{ _currentMapItem?.x }} - {{ _currentMapItem?.y }}]</el-descriptions-item
						>
						<el-descriptions-item label-align="center" align="center" :span="4" label="link">{{
							_currentMapItem?.linkto?._id
						}}</el-descriptions-item>
					</el-descriptions>
					<div class="current-item">
						<el-input clearable style="margin: 10px 0" v-model="_linkTargetId" placeholder="输入连接目标id">
							<template #append>
								<el-button @click="handleLinkMapItem" :disabled="_currentMapItemId === ''" type="primary"
									>link</el-button
								>
							</template>
						</el-input>
						<el-button @click="removeItem()" style="width: 100%" :disabled="_currentMapItemId === ''" type="danger"
							>删除选中MapItem</el-button
						>
					</div>
				</div>

				<span class="form-title">为MapItem绑定地皮</span>
				<el-form
					:inline="true"
					label-position="top"
					ref="propertyFormRef"
					:rules="propertyFormRules"
					:model="newPropertyForm"
					:disabled="_currentMapItemId === '' || _currentMapItem?.linkto"
				>
					<el-form-item label="地皮名称" prop="name">
						<el-input v-model="newPropertyForm.name" placeholder=""></el-input>
					</el-form-item>

					<el-form-item label="空地价格" prop="sellCost">
						<el-input-number :min="0" :step="100" v-model="newPropertyForm.sellCost" placeholder=""></el-input-number>
					</el-form-item>

					<el-form-item label="建楼价格" prop="buildCost">
						<el-input-number :min="0" :step="100" v-model="newPropertyForm.buildCost" placeholder=""></el-input-number>
					</el-form-item>

					<el-form-item label="空地过路费" prop="cost_lv0">
						<el-input-number :min="0" :step="100" v-model="newPropertyForm.cost_lv0" placeholder=""></el-input-number>
					</el-form-item>

					<el-form-item label="一栋楼过路费" prop="cost_lv1">
						<el-input-number :min="0" :step="100" v-model="newPropertyForm.cost_lv1" placeholder=""></el-input-number>
					</el-form-item>

					<el-form-item label="两栋楼过路费" prop="cost_lv2">
						<el-input-number :min="0" :step="100" v-model="newPropertyForm.cost_lv2" placeholder=""></el-input-number>
					</el-form-item>

					<el-form-item label="所属街道" prop="streetId">
						<el-select clearable v-model="newPropertyForm.streetId" placeholder="选择所属街道">
							<el-option v-for="street in _streetList" :key="street.id" :value="street.id" :label="street.name">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="&nbsp">
						<el-button @click="handleCreateOrUpdateProperty(propertyFormRef)" type="primary">绑定地皮</el-button>
					</el-form-item>
				</el-form>
			</div>

			<div>
				<el-select value-key="color" clearable v-model="_itemTypeIdToAppendPath" placeholder="选择类型用来生成索引">
					<el-option v-for="(item, index) in _itemTypeList" :key="item.color" :value="item.id" :label="item.name">
						<div class="flex align-center justify-space-between">
							<span :style="{ color: item.color }">{{ item.name }}</span>
						</div>
					</el-option>
				</el-select>
				<el-button @click="handleAppendIndexList" type="primary" style="margin-left: 10px">生成路线</el-button>
			</div>
		</div>

		<ChanceCardSelectorVue
			:isVisible="_chanceCardSeletorVisible"
			:map-id="_mapId"
			@close="handleChanceCardSelectorClose"
			@confirm="handleChanceCardSelectorConfirm"
		></ChanceCardSelectorVue>
	</div>
</template>

<style lang="scss" scoped>
.map-editor-page {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;

	& > div {
		margin: 0 5px;
	}
}

.canvas-container {
	border-radius: 10px;
	background-color: #ffbb32;
	box-shadow: var(--el-box-shadow-light);
	padding: 10px;
	padding-top: 0;
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

.tool-container,
.tool-container-2 {
	width: 400px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	border-radius: 10px;
	& > div {
		border-radius: 10px;
		padding: 15px;
		box-shadow: var(--el-box-shadow-light);
		background-color: #ffffff;
	}
}

.tool-container-2 {
	flex: 1;
}

.map-name {
	display: flex;
	justify-content: space-between;

	& > button {
		margin-left: 10px;
	}
}

.chance-card-container {
	flex: 1;
	margin: 10px 0;
	display: flex;
	flex-direction: column;

	& > .chance-card-list {
		flex: 1;
		margin-top: 10px;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		overflow-x: scroll;

		& > div {
			margin: 0 10px;
		}
	}
}

.current-type-preview {
	display: flex;
	flex-direction: column;

	& > #model-preview__canvas {
		width: 100%;
		border-radius: 10px;
		flex: 1;
	}
}
.map-item-editor {
	display: flex;
	flex-direction: column;

	& > .map-item-table {
		flex: 1;
		width: 100%;
	}
}

.form-title {
	margin: 15px 0 10px 0;
	display: block;
	font-size: 14px;
	font-weight: 700;
	color: var(--el-text-color-primary);
}

#model-preview__canvas {
	margin-top: 10px;
}
</style>
