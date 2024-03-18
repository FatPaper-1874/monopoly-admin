<script setup lang='ts'>
import { onMounted, watch } from 'vue';
import { LoginCodeRenderer } from '@/utils/three/LoginCodeRenderer';

const props = withDefaults(defineProps<{ img_data: string }>(), {})

watch(() => props.img_data, (newImgData) => {
  if (!loginCodeRenderer) return;

  if (newImgData) {
    loginCodeRenderer.loadCode(newImgData);
  } else {
    loginCodeRenderer.cleanCode();
  }
})

let loginCodeRenderer: LoginCodeRenderer | undefined;
let diceRotate: boolean = true;

onMounted(() => {
  const canvasEl = document.getElementById("dice-canvas") as HTMLCanvasElement;
  loginCodeRenderer = new LoginCodeRenderer(canvasEl, diceRotate);
})
</script>

<template>
  <canvas id="dice-canvas" class="dice"></canvas>
</template>

<style lang='scss' scoped>
.dice {
  $img_size: 28rem;

  width: $img_size;
  height: $img_size;
  cursor: pointer;
}
</style>