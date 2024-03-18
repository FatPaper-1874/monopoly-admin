<script setup lang="ts">
import { ItemType } from "@/utils/interfaces";
import { ModelPreviewer } from "@/utils/three/ModelPreviewer";
import { ElMessageBox } from "element-plus";
import { onMounted, onUnmounted } from "vue";
import { deleteItemType } from "@/utils/api/itemType";

const props = defineProps<{ eventItemtype: ItemType }>();
const emit = defineEmits(["delete", "edit"]);

let modelPreview: ModelPreviewer;

onMounted(async () => {
	const canvas = document.getElementById(props.eventItemtype.id) as HTMLCanvasElement;

	modelPreview = new ModelPreviewer(canvas);
	modelPreview.loadModel(props.eventItemtype.model.fileName, true);
});

onUnmounted(() => {
	modelPreview.distory();
});

const handleEdit = () => {
	emit("edit", props.eventItemtype.id);
};

const handleDelete = () => {
	ElMessageBox.alert("删除这个特殊ItemType会导致使用这个ItemType的MapItem一并删除,你确定要删除吗", "警告", {
		confirmButtonText: "确定删除",
		cancelButtonText: "取消",
		type: "warning",
	}).then(async () => {
		await deleteItemType(props.eventItemtype.id);
		emit("delete");
	});
};

const handleCommand = (command: string) => {
	switch (command) {
		case "edit":
			handleEdit();
			break;
		case "delete":
			handleDelete();
			break;
	}
};
</script>

<template>
	<el-card class="event-itemtype-list-card" :body-style="{ width: '100%', flex: '1', 'box-sizing': 'border-box' }">
		<template #header>
			<div class="card-header">
				<span>{{ eventItemtype.name }}</span>
				<el-dropdown trigger="click" @command="handleCommand">
					<el-button class="button" text style="color: #409eff">操作</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="edit">编辑</el-dropdown-item>
							<el-dropdown-item command="delete" style="color: red">删除</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</template>
		<canvas class="event-itemtype-list__canvas" :id="eventItemtype.id"></canvas>
	</el-card>
</template>

<style lang="scss" scoped>
.event-itemtype-list-card {
	margin: 10px;
	border-radius: 10px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.event-itemtype-list__canvas {
	display: block;
	border-radius: 10px;
	width: 100%;
	height: 100%;
}
</style>
