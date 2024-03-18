<script setup lang="ts">
import chanceCardVue from "@/components/sample/chance-card.vue";
import ItemSelector from "@/components/sample/item-selector.vue";
import { getChanceCardsList } from "@/utils/api/chanceCard";
import { getChanceCardsListByMapId } from "@/utils/api/map";
import { ChanceCard } from "@/utils/interfaces";
import { onUpdated, ref } from "vue";

const props = defineProps({ isVisible: { type: Boolean, default: false }, mapId: { type: String, default: "" } });

const emit = defineEmits(["close", "confirm"]);

const _chanceCardList = ref<ChanceCard[]>([]);
const _selectedIdList = ref<string[]>([]);

onUpdated(async () => {
	const currentCardList = (await getChanceCardsListByMapId(props.mapId)) as any;
	_selectedIdList.value = currentCardList.map((item: any) => item.id);
	const { chanceCardsList } = await getChanceCardsList(1, 10000);
	_chanceCardList.value = chanceCardsList;
});

const handleSelected = (selectedList: string[]) => {
	_selectedIdList.value = selectedList;
};

const handleClose = () => {
	emit("close");
};

const handleConfirm = () => {
	emit("confirm", _selectedIdList.value);
};
</script>

<template>
	<el-dialog destroy-on-close @close="handleClose" class="chance-card-selector" :model-value="props.isVisible"
		title="选择地图包含的机会卡" width="60%">
		<ItemSelector @select="handleSelected" :item-list="_chanceCardList" key-name="id"
			:selected-key-list="_selectedIdList">
			<template #item="{ id, name, describe, icon, color }">
				<chanceCardVue :id="id" :name="name" :describe="describe" :icon="icon" :color="color" />
			</template>
		</ItemSelector>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">Cancel</el-button>
				<el-button type="primary" @click="handleConfirm"> Confirm </el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style lang="scss" scoped>
.chance-card-selector {
	height: 70%;
	overflow-y: scroll;
}
</style>
