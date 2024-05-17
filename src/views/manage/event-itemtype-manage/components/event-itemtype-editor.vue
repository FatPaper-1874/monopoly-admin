<script setup lang="ts">
import { createItemTypes } from "@/utils/api/itemType";
import { getModelList } from "@/utils/api/model";
import { Model } from "@/utils/interfaces";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { FormInstance, FormRules } from "element-plus";
import { onBeforeMount, onMounted, reactive, ref, toRaw, watch } from "vue";
import { useRoute } from "vue-router";
import { ModelPreviewer } from "@/utils/three/model-previewer";
import { updateItemTypes, getItemTypeById, createEventItemType } from '@/utils/api/itemType';
import router from "@/router";

const route = useRoute();
const _eventItemtypeId = route.query.id as string;

let modelPreviewer: ModelPreviewer;

const _modelsList = ref<Model[]>([]);
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

const handleCreateEventItemtype = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid) => {
		if (valid) {
			const { name, color, modelId, size } = { ...toRaw(newTypeForm) };

      const effectCode = ""

			if (_eventItemtypeId) {
				await updateItemTypes(_eventItemtypeId, name, color, size, modelId, effectCode);
			} else {
				await createEventItemType(name, color, size, modelId, effectCode);
				router.replace({ path: "/event-itemtype" });
			}
		} else {
			console.log("error submit!");
			return false;
		}
	});
};

const loadModelList = async () => {
	const { modelList } = await getModelList(1, 100);
	_modelsList.value = modelList;
};

const loadItemTypeInfo = async (id: string) => {
	const { name, color, size, effectCode, model } = await getItemTypeById(id);
	Object.assign(newTypeForm, { name, color, size, modelId: model.id });
	setEffectCode(effectCode);
};

//代码编辑器相关
onMounted(async () => {

});

watch(
	() => newTypeForm.modelId,
	(newModelId) => {
		const newModel = _modelsList.value.find((m) => m.id === newModelId);
		if (modelPreviewer) {
			if (newModel) modelPreviewer.loadModel(newModel.fileUrl, true);
			else modelPreviewer.clear();
		}
	}
);

const setEffectCode = async (effectCode: string) => {

};
</script>

<template>
	<div class="event-itemtype-editor">
		<div class="left-container">
			<div class="event-itemtype-preview">
				<canvas id="model-preview"></canvas>
			</div>
			<div class="event-itemtype-form-container">
				<el-form label-position="left" label-width="100px" ref="itemTypeFormRef" :rules="itemTypeFormRules"
					:model="newTypeForm">
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
						<el-button @click="handleCreateEventItemtype(itemTypeFormRef)" type="primary">保存类型</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>

		<div class="right-container">
			<div class="explain-area">
				<FontAwesomeIcon icon="warning" />
				<span>
					以下区域编写的代码将会在游戏后端运行时读取并运行，代码上方为定义的接口区域，请在注释为"CODING AREA"
					的区域内编写代码，不能修改上方的接口以及外围的函数定义。
				</span>
			</div>
			<div class="editor-area">
				<div id="code-editor"></div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.event-itemtype-editor {
	width: 100%;
	height: 100%;
	display: flex;

	&>.left-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	&>.right-container {
		flex: 1;
		margin-left: 20px;
		border-radius: 10px;
		padding: 20px;
		box-shadow: var(--el-box-shadow-light);
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
}

.event-itemtype-preview {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	margin-bottom: 50px;

	#model-preview {
		width: 300px;
		height: 300px;
		border-radius: 10px;
	}
}

.event-itemtype-form-container {
	border-radius: 10px;
	padding: 20px;
	box-shadow: var(--el-box-shadow-light);
	background-color: #ffffff;
}

.explain-area {
	user-select: none;
	padding: 8px 16px;
	color: var(--el-color-danger-dark-2);
	background-color: var(--el-color-danger-light-7);
	border-radius: 4px;
	border-left: 5px solid var(--el-color-danger);
	margin-bottom: 20px;
}

.editor-area {
	flex: 1;
}

#code-editor {
	width: 100%;
	height: 100%;
}
</style>
