<script setup lang="ts">
import { FormInstance, FormRules, UploadInstance, ElMessage } from "element-plus";
import { ref, reactive, toRaw } from "vue";

const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
});

const uploadHeader = { Authorization: localStorage.getItem("token") };

const emit = defineEmits(["open", "opened", "close", "closed", "success", "error"]);

const uploadRef = ref<UploadInstance>();
const fromRef = ref<FormInstance>();

const modelForm = reactive({
	name: "",
	fileList: [],
});

const rules = reactive<FormRules>({
	name: [{ required: true, message: "请输入模型名字", trigger: "blur" }],
	fileList: [{ required: true, message: "请选择模型", trigger: "blur" }],
});

const submitUpload = () => {
	fromRef.value!.validate((valid) => {
		if (!valid) return;
		console.log("表单校验完成");
		uploadRef.value!.submit();
	});
};

const handleClose = (done: any) => {
	fromRef.value?.resetFields();
	emit("close");
};

const handleUploadSuccess = (res: any) => {
	fromRef.value?.resetFields();
	if (res.status === 200) {
		ElMessage({
			type: "success",
			message: res.msg,
		});
	}
	emit("success");
};

const handleUploadFailed = (res: any) => {
	fromRef.value?.resetFields();
	if (res.status === 500) {
		ElMessage({
			type: "error",
			message: res.msg,
		});
	}
	emit("error");
};
</script>

<template>
	<el-dialog
		destroy-on-close
		lock-scroll
		title="添加模型"
		:model-value="props.visible"
		width="30%"
		:before-close="handleClose"
	>
		<el-form ref="fromRef" :rules="rules" label-width="80px" :model="modelForm">
			<el-form-item label="模型名字" prop="name">
				<el-input v-model="modelForm.name" />
			</el-form-item>

			<el-form-item label="模型文件" prop="fileList">
				<el-upload
					v-model:file-list="modelForm.fileList"
					style="width: 100%"
					name="model"
					accept=".glb"
					:auto-upload="false"
					:headers="uploadHeader"
					:data="modelForm"
					ref="uploadRef"
					class="upload-demo"
					action="http://localhost:8000/upload/model"
					@success="handleUploadSuccess"
					@error="handleUploadFailed"
				>
					<template #trigger>
						<el-button type="primary">选择.glb模型文件</el-button>
					</template>
				</el-upload>
			</el-form-item>
		</el-form>
		<el-button type="primary" @click="submitUpload">添加</el-button>
	</el-dialog>
</template>

<style lang="scss" scoped></style>
