<script setup lang='ts'>
import { getItemTypesListByMapId, updateIndexList } from '@/utils/api/map';
import { ItemType, MapItem } from '@/utils/interfaces';
import { ElMessage } from 'element-plus';
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';

const props = withDefaults(defineProps<{ mapItemslist: MapItem[] }>(), { mapItemslist: () => new Array<MapItem> })
const emits = defineEmits(["submit"])

const mapId = useRoute().query.mapId as string;

const _itemTypeList = ref<Array<ItemType>>([]);
const _itemTypeIdToAppendPath = ref<string[]>([]);

async function handleAppendIndexList() {
  const tempMapItemsList = props.mapItemslist.filter((item) => _itemTypeIdToAppendPath.value.includes(item.type.id));
  if (tempMapItemsList.length > 0) {
    let indexList: string[] = [];
    try {
      indexList = findPath(tempMapItemsList);
    } catch (e: any) {
      ElMessage({ message: e.message, type: "error" });
    }
    await updateIndexList(mapId, indexList);
    emits("submit")
  }
};

function findPath(itemList: MapItem[]) {
  const tempList: MapItem[] = [];
  const startItem: MapItem = itemList[0];
  tempList.push(startItem);
  for (let i = 0; i < itemList.length - 1; i++) {
    const tempItem = tempList[tempList.length - 1];
    for (let j = 0; j < itemList.length; j++) {
      const nextTempItem = itemList[j];
      if (isAdjacent(tempItem, nextTempItem) && !tempList.includes(nextTempItem)) {
        tempList.push(nextTempItem);
        break;
      }
    }
  }
  if (!isAdjacent(tempList[0], tempList[tempList.length - 1])) throw Error("不是闭环的的地图");
  return tempList.map((item) => item.id);

  function isAdjacent(sourceItem: MapItem, targetItem: MapItem) {
    return (
      (sourceItem.x + 1 === targetItem.x && sourceItem.y === targetItem.y) ||
      (sourceItem.x - 1 === targetItem.x && sourceItem.y === targetItem.y) ||
      (sourceItem.y + 1 === targetItem.y && sourceItem.x === targetItem.x) ||
      (sourceItem.y - 1 === targetItem.y && sourceItem.x === targetItem.x)
    );
  };
};


onBeforeMount(() => {
  loadItemTypes();
});


async function loadItemTypes() {
  _itemTypeList.value = (await getItemTypesListByMapId(mapId)) as any;
}
</script>

<template>
  <div class="index-creator">
    <el-select multiple value-key="color" clearable v-model="_itemTypeIdToAppendPath" placeholder="选择类型用来生成索引">
      <el-option v-for="(item, index) in _itemTypeList" :key="item.color" :value="item.id" :label="item.name">
        <div class="flex align-center justify-space-between">
          <span :style="{ color: item.color }">{{ item.name }}</span>
        </div>
      </el-option>
    </el-select>
    <el-button @click="handleAppendIndexList" type="primary" style="margin-left: 10px">生成路线</el-button>
  </div>
</template>

<style lang='scss' scoped>
.index-creator {
  padding: 10px;
  background-color: #ffffff;
}
</style>