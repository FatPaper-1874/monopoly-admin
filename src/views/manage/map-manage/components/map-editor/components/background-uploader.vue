<script setup lang="ts">
import { ElUpload, ElButton, ElMessage } from "element-plus";
import { computed } from "vue";
import { __MONOPOLYSERVER__ } from "@G/global.config";

const props = withDefaults(defineProps<{ mapId: string }>(), { mapId: "" });

const uploadHeader = { Authorization: localStorage.getItem("token") };

const emit = defineEmits<{ (e: "success", res: any): void; (e: "error", res: any): void }>();

function handleUploadSuccess(res: any) {
	if (res.status === 200) {
		ElMessage({
			type: "success",
			message: res.msg,
		});
	}
	emit("success", res);
}

function handleUploadFailed(res: any) {
	if (res.status === 500) {
		ElMessage({
			type: "error",
			message: res.msg,
		});
	}
	emit("error", res);
}

const uploadAction = computed(() => `${__MONOPOLYSERVER__}/map/background`);
</script>

<template>
	<el-upload
		class="background-upload"
		name="background"
		accept=".png, .jpg"
		auto-upload
		:show-file-list="false"
		:headers="uploadHeader"
		:data="{ mapId }"
		ref="uploadRef"
		:action="uploadAction"
		@success="handleUploadSuccess"
		@error="handleUploadFailed"
	>
		<template #trigger>
			<el-button type="primary">上传背景图片</el-button>
		</template>
	</el-upload>
</template>

<style lang="scss" scoped></style>
@/global.config
