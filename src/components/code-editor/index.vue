<script setup lang="ts">
import {basicSetup} from "codemirror";
import {EditorView, keymap} from '@codemirror/view';
import {javascript} from '@codemirror/lang-javascript'
import {EditorState} from '@codemirror/state'
import {indentWithTab} from '@codemirror/commands'
import {autocompletion} from '@codemirror/autocomplete'
import {onMounted, watch} from "vue";

let codeMirrorView: EditorView | undefined;
let codeMirrorState: EditorState | undefined;

const props = defineProps<{ modelText: string }>();

watch(() => props.modelText, (newValue, oldValue) => {
  if (codeMirrorState && codeMirrorView) {
    const tr =  codeMirrorState.update({changes: {from: 0, to: codeMirrorState.doc.length, insert: newValue}});
    codeMirrorView.dispatch(tr)
  }
})
const emits = defineEmits(["update:modelValue"])


onMounted(() => {
  const container = document.getElementById('code-editor-container') as HTMLElement
  const startNum = props.modelText.split('\n').findIndex((str) => str.includes('CODING AREA')) + 1;
  codeMirrorState = EditorState.create({
    doc: props.modelText,
    selection: {anchor: startNum},
    extensions: [basicSetup,
      javascript({typescript: true}),
      EditorView.theme({
            "&": {'max-height': container.clientHeight + 'px', 'max-width': container.clientWidth + 'px'},
            ".cm-scroller": {overflow: "auto"}
          }
      ),
      EditorView.updateListener.of((v) => {
        const startNum = v.state.doc.toString().split('\n').findIndex((str) => str.includes('CODING AREA')) + 2;
        const endNum = v.state.doc.toString().split('\n').findLastIndex((str) => str.includes('CODING AREA')) + 1;
        const tempStrArr = [];
        // console.log("startNum: ", startNum, "endNum: ", endNum);
        for (let i = startNum; i < endNum; i++) {
          tempStrArr.push(v.state.doc.line(i).text);
        }
        const res = tempStrArr.join('\n');
        emits('update:modelValue', res);
      }),
      keymap.of([indentWithTab]),

      autocompletion(),
    ],
  });
  codeMirrorView = new EditorView({
    state: codeMirrorState,
    parent: document.getElementById('code-editor') as HTMLElement,
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