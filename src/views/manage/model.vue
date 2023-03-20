<script setup lang="ts">
import { ref, onMounted } from "vue";
import ModelUpload from "@/components/model-upload/model-upload.vue";
import ModelListCard from "@/components/sample/model-list-card.vue";
import { ModelItem } from "@/utils/interfaces";
import { getModelList } from "@/utils/api/model";

//dialog控制
const createModelVisible = ref(false);

const _modelList = ref<ModelItem[]>();

const currentPage = ref(1);
const totalPage = ref(0);
const size = ref(8);

const handleCurrentChange = () => {
	loadModelList();
};

const loadModelList = async () => {
	const { total, modelList, current } = await getModelList(currentPage.value, size.value);
	_modelList.value = modelList;
	totalPage.value = total;
	currentPage.value = current;
};

const handleUploadSuccess = () => {
	createModelVisible.value = false;
	loadModelList();
};

const handleModelDelete = () => {
	loadModelList();
};

onMounted(async () => {
	loadModelList();
});
</script>

<template>
	<div class="model-page">
		<el-row class="top-bar">
			<el-col :span="20" class="title"><h4>模型管理</h4></el-col>
			<el-col :span="4" class="button-container">
				<el-button class="button-create-model" type="primary" @click="createModelVisible = true">添加模型</el-button>
			</el-col>
		</el-row>

		<div class="model-list-container">
			<model-list-card @delete="handleModelDelete" v-for="model in _modelList" :key="model.id" :model="model" />
		</div>

		<el-pagination
			v-model:current-page="currentPage"
			:page-size="size"
			layout="total, prev, pager, next"
			:total="totalPage"
			@current-change="handleCurrentChange"
		/>
	</div>
	<model-upload
		:visible="createModelVisible"
		@close="createModelVisible = false"
		@success="handleUploadSuccess()"
	></model-upload>
</template>

<style lang="scss" scoped>
.model-page {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}
.top-bar {
	width: 100%;
	height: 50px;
	border-radius: 10px;
	padding: 5px 20px;
	display: flex;
	align-items: center;
	box-shadow: var(--el-box-shadow-light);
	& > .button-container > * {
		float: right;
	}
}
.model-list-container {
	flex: 1;
	display: grid;
	grid-template-columns: repeat(4, 25%);
	grid-template-rows: repeat(2, 50%);
}
</style>
