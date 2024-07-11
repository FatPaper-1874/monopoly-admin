<script setup lang="ts">
import * as monaco from "monaco-editor"
import {nextTick, onMounted, watch} from "vue";
import {ElMessage} from "element-plus";


const props = defineProps<{ modelText: string }>();
const emits = defineEmits(["update:modelValue"])
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

onMounted(() => {
  const container = document.getElementById('code-editor-container') as HTMLElement
  editor = monaco.editor.create(container, {value: props.modelText, language: "typescript", automaticLayout: true})
  editor.onDidChangeModelContent((e) => {
    if (!editor) return
    console.log(editor.getValue())
    const content = editor.getValue();
    const match = content.match(/\/\/CODING AREA\s*([\s\S]*?)\s*\/\/CODING AREA/);
    if (!match) {
      ElMessage({type: "error", message: "请不要删除 //CODING AREA"});
      return;
    }
    emits("update:modelValue", match[1].trim())
  })
  nextTick(() => {
    if (!editor) return
    const formatAction = editor.getAction('editor.action.formatDocument');
    formatAction && formatAction.run();
    editor.setValue(editor.getValue());
  })
  import('./base-interface.d.ts?raw').then(res => {
    const baseInterface = res.default;
    monaco.languages.typescript.typescriptDefaults.addExtraLib(baseInterface)
  })
})
</script>

<template>
  <div id="code-editor-container">
    <div id="code-editor"></div>
  </div>
</template>

<style scoped lang="scss">
#code-editor-container {
  width: 100%;
  height: 100%;
}
</style>