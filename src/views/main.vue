<script setup lang="ts">
import { menus } from "../router/menus";
import { computed } from "vue";
import router from "@/router/index";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const currentRoutePath = computed(() => router.currentRoute.value.path);
</script>

<template>
	<el-container class="main-page">
		<el-header class="top-bar" height="50px"><h3>多人在线大富翁后台</h3></el-header>

		<el-container>
			<el-aside class="menu-container" width="240px">
				<el-menu router :default-active="currentRoutePath">
					<el-menu-item v-for="item in menus" :index="item.path">
						<FontAwesomeIcon class="icon" :icon="item.icon"></FontAwesomeIcon>
						<span>{{ item.menuName }}</span>
					</el-menu-item>
				</el-menu>
			</el-aside>

			<el-main class="router-view-container">
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<style lang="scss" scoped>
.main-page {
	width: 100%;
	height: 100%;

	& > .top-bar {
		background-color: var(--el-color-primary);
		box-shadow: var(--el-box-shadow-lighter);

		line-height: 50px;
		color: #ffffff;
	}
}

.menu-container {
	box-shadow: var(--el-box-shadow-lighter);

	.icon{
		width: 1.5rem;
	}
}
</style>
