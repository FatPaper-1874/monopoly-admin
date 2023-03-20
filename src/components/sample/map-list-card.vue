<script setup lang="ts">
import { deleteMap } from "@/utils/api/map";
import { GameMap } from "@/utils/interfaces";
import { ElMessageBox } from "element-plus";

const { map } = defineProps<{ map: GameMap }>();
const emit = defineEmits(["delete", "edit"]);

const handleEdit = () => {
	emit("edit", map.id);
};

const handleDelete = () => {
	ElMessageBox.alert("删除这个地图会导致这个地图的其他数据一并删除,如( Property, MapItem ),你确定要删除吗", "警告", {
		confirmButtonText: "确定删除",
		cancelButtonText: "取消",
		type: "warning",
	}).then(async () => {
		await deleteMap(map.id);
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
	<el-card class="map-preview-card" :body-style="{ width: '100%', flex: '1', 'box-sizing': 'border-box' }">
		<template #header>
			<div class="card-header">
				<span>{{ map.name }}</span>
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
		<canvas class="map-preview__canvas" :id="map.id"></canvas>
	</el-card>
</template>

<style lang="scss" scoped>
.map-preview-card {
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
.map-preview__canvas {
	display: block;
	border-radius: 10px;
	width: 100%;
	height: 100%;
}
</style>
