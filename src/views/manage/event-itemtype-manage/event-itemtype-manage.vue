<script setup lang="ts">
import router from "@/router/index";
import { onMounted, ref } from "vue";
import { ItemType } from "@/interfaces/interfaces";
import { getEvenItemtypesList } from "@/utils/api/itemType";
import eventItemtypeListCard from "./components/event-itemtype-list-card.vue";

const _evenItemtypeList = ref<ItemType[]>([]);

const currentPage = ref(1);
const totalPage = ref(0);
const size = ref(10);

const isLoading = ref(true);

const handleEvenItemtypeCreate = () => {
	router.push({ path: "/event-itemtype-editor" });
};

const handleEvenItemtypeEdit = (id: string) => {
	router.push({ path: "/event-itemtype-editor", query: { id } });
};

const handleEvenItemtypeDelete = async () => {
	await loadEvenItemtypeList();
};

const handleCurrentChange = async () => {
	await loadEvenItemtypeList();
};

const loadEvenItemtypeList = async () => {
	isLoading.value = true;
	const { total, eventItemtypesList, current } = await getEvenItemtypesList(currentPage.value, size.value);

	_evenItemtypeList.value = eventItemtypesList;
	totalPage.value = total;
	currentPage.value = current;
	isLoading.value = false;
};

onMounted(async () => {
	await loadEvenItemtypeList();
});
</script>

<template>
	<div class="event-itemtype-page">
		<el-row class="top-bar">
			<el-col :span="20" class="title"><h4>特殊ItemType管理</h4></el-col>
			<el-col :span="4" class="button-container">
				<el-button type="primary" @click="handleEvenItemtypeCreate">创建特殊ItemType</el-button>
			</el-col>
		</el-row>

		<div v-loading="isLoading" element-loading-text="Loading..." class="event-itemtype-list-container">
			<event-itemtype-list-card
				@delete.async="handleEvenItemtypeDelete"
				@edit="handleEvenItemtypeEdit"
				v-for="evenItemtype in _evenItemtypeList"
				:key="evenItemtype.id"
				:event-itemtype="evenItemtype"
			/>
		</div>
		<el-pagination
			background
			v-model:current-page="currentPage"
			:page-size="size"
			layout="total, prev, pager, next"
			:total="totalPage"
			@current-change="handleCurrentChange"
		/>
	</div>
</template>

<style lang="scss" scoped>
.event-itemtype-page {
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
	margin-bottom: 10px;
	& > .button-container > * {
		float: right;
	}
}

.event-itemtype-list-container {
	flex: 1;
	display: grid;
	grid-template-columns: repeat(5, 20%);
	grid-template-rows: repeat(2, 50%);
}
</style>
