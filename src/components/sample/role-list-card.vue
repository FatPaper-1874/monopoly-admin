<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import { Role } from "../../utils/interfaces";
import { computed } from "vue";
import { _BASEURL_ } from "../../bace";

const { role } = defineProps<{ role: Role }>();
const emit = defineEmits(["delete"]);

const roleSrc = computed(() => `${_BASEURL_}/static/roles/${role.filename}`);

const handleEdit = () => {};
const handleDelete = () => {
	ElMessageBox.alert("你确定要删除吗", "警告", {
		confirmButtonText: "确定删除",
		cancelButtonText: "取消",
		type: "warning",
	}).then(async () => {
		// await deleteModel(model.id);
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
	<el-card class="role-preview-card" :body-style="{ width: '100%', flex: '1', 'box-sizing': 'border-box' }">
		<template #header>
			<div class="card-header">
				<span>{{ role.rolename }}</span>
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
		<div class="img-container">
			<img class="role-preview__img" :src="roleSrc" alt="" />
			<span class="role-name" :style="{ 'background-color': role.color }">{{ role.rolename }}</span>
		</div>
	</el-card>
</template>

<style lang="scss" scoped>
.role-preview-card {
	margin: 10px;
	border-radius: 10px;
	box-sizing: border-box;
}
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.img-container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: relative;

	.role-name {
		position: absolute;
		height: 1.2rem;
		line-height: 1.2rem;
		font-size: 1.1rem;
		font-weight: bold;
		padding: 10px 0;
		width: 100%;
		text-align: center;
		color: #ffffff;
		bottom: 0;
	}
}
.role-preview__img {
	width: 100%;
}
</style>
