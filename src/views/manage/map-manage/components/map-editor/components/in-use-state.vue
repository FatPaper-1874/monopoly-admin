<script setup lang="ts">
import { MapData } from "@/interfaces/interfaces";
import { updateMapInUse } from "@/utils/api/map";
import { inject, ref, watch } from "vue";

const mapInfo = inject<MapData>("mapInfo")!;
const emits = defineEmits(["isUseChanged"]);
const inUse = ref(mapInfo.inUse);

watch(mapInfo, (newMapInfo) => {
	inUse.value = newMapInfo.inUse;
});

const handleUpdateMapInUse = async () => {
	if (mapInfo) await updateMapInUse(mapInfo.id, inUse.value);
};
</script>

<template>
	<div class="in-use-state">
		<el-switch
			inline-prompt
			style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
			v-model="inUse"
			active-text="地图启用中"
			inactive-text="地图停用中"
			@change="handleUpdateMapInUse"
		></el-switch>
	</div>
</template>

<style lang="scss" scoped>
.in-use-state {
	padding: 6px 12px;
	background: #fff;
}
</style>
