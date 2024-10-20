<script setup lang="ts">
import { RoomMapItem } from "@/interfaces/interfaces";

const props = defineProps<{ room: RoomMapItem }>();
</script>

<template>
	<div class="room-item">
		<div class="room-id">
			房间号: <b>{{ room.roomId }}</b>
		</div>
		<div class="foot-bar">
			<div class="owner-name">
				房主: <b>{{ room.hostName }}</b>
			</div>
			<div class="owner-id">
				房主ID: <b>{{ room.hostId }}</b>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.room-item {
	border-radius: 8px;
	margin: 10px;
	margin-left: 5px;
	padding: 20px;
	box-sizing: border-box;
	box-shadow: var(--el-box-shadow-light);
	height: max-content;

	b {
		color: var(--el-color-primary);
	}

	& > .foot-bar {
		margin-top: 20px;
		font-size: 12px;
		display: flex;
		justify-content: space-between;
		align-items: center;

		& > .owner-id {
			margin-left: 50px;
		}
	}
}
</style>
