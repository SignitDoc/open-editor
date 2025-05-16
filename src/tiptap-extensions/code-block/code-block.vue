<template>
  <NodeViewWrapper class="code-block">
    <select contenteditable="false" v-model="selectedLanguage">
      <option :value="null">auto</option>
      <option v-for="(language, index) in languages" :value="language" :key="index">
        {{ language }}
      </option>
    </select>
    <pre><code><NodeViewContent /></code></pre>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3"

const props = defineProps(nodeViewProps)

const selectedLanguage = computed({
  get: () => props.node.attrs.language,
  set: language => props.updateAttributes({ language })
})

onMounted(() => {
  languages.value = props.extension.options.lowlight.listLanguages()
})
const languages = ref([])
</script>

<style lang="scss">
.tiptap {
  .code-block {
    position: relative;

    select {
      position: absolute;
      background-color: #fff;
      right: 0.5rem;
      top: 0.5rem;
    }
  }
}
</style>
