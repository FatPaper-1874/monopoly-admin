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

const roleForm = reactive({
	name: "",
	color: "",
	fileList: [],
});

const rules = reactive<FormRules>({
	name: [{ required: true, message: "请输入角色名字", trigger: "blur" }],
	color: [{ required: true, message: "请选择角色代表颜色", trigger: "blur" }],
	fileList: [{ required: true, message: "请选择角色", trigger: "blur" }],
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
		title="添加角色"
		:model-value="props.visible"
		width="30%"
		:before-close="handleClose"
	>
		<el-form ref="fromRef" :rules="rules" label-width="80px" :model="roleForm">
			<el-form-item label="角色名字" prop="name">
				<el-input v-model="roleForm.name" />
			</el-form-item>

			<el-form-item label="代表颜色" prop="color">
				<el-color-picker color-format="hex" v-model="roleForm.color" />
			</el-form-item>

			<el-form-item label="角色图片" prop="fileList">
				<el-upload
					v-model:file-list="roleForm.fileList"
					style="width: 100%"
					name="role"
					accept=".png"
					:auto-upload="false"
					:headers="uploadHeader"
					:data="roleForm"
					ref="uploadRef"
					class="upload-demo"
					action="http://localhost:8000/upload/role"
					@success="handleUploadSuccess"
					@error="handleUploadFailed"
				>
					<template #trigger>
						<el-button type="primary">选择512*512尺寸的.png图片文件</el-button>
					</template>
				</el-upload>
			</el-form-item>
		</el-form>
		<el-button type="primary" @click="submitUpload">添加</el-button>
	</el-dialog>
</template>

<style lang="scss" scoped></style>
