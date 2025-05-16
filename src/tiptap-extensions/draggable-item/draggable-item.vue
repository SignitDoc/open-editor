<template>
  <NodeViewWrapper
    class="draggable-item"
    :style="{ background: props.node.attrs.background, borderColor: props.node.attrs.borderColor }"
    @click="changeThemeVisible = true"
    @mouseleave="changeThemeVisible = false"
  >
    <div v-if="changeThemeVisible" class="theme-changer-container" contenteditable="false">
      <div class="theme-changer-wrapper" contenteditable="false">
        <div
          v-for="(color, index) in themePickerOptions"
          :key="index"
          class="theme-item"
          contenteditable="false"
          :style="{ background: color[0], borderColor: color[1] }"
          @click="e => changeTheme(e, index)"
        ></div>
      </div>
    </div>

    <div
      class="drag-handle"
      contenteditable="false"
      draggable="true"
      data-drag-handle
      :style="{ color: props.node.attrs.borderColor }"
    >
      <i class="ri-draggable"></i>
    </div>
    <NodeViewContent />
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from "@tiptap/vue-3"
import { ref } from "vue"
const props = defineProps(nodeViewProps)
const changeThemeVisible = ref(false)

const themePickerOptions = [
  ["#feffef", "#e7f600"],
  ["#fdf6ec", "#f3d19e"],
  ["#ecf5ff", "#a0cfff"],
  ["#c0ddfc", "#57a8ff"],
  ["#fef0f0", "#fab6b6"],
  ["#fbe1f0", "#eea4cf"],
  ["#f0f9eb", "#b3e19d"],
  ["#E0FBE2", "#B0EBB4"],
  ["#f2edf9", "#cfc5f3"],
  ["#dfdeff", "#8f84f0"],
  ["#f4f4f5", "#c8c9cc"],
  ["#dedfe0", "#b1b3b8"]
]
const themePicker = ref(1)

function changeTheme(e, index) {
  e.stopPropagation()
  e.preventDefault()
  themePicker.value = index
  props.updateAttributes({
    background: themePickerOptions[index][0],
    borderColor: themePickerOptions[index][1]
  })
}
</script>

<style lang="scss">
.draggable-item {
  display: flex;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 0.5rem;
  border: 1px solid;
  position: relative;
  box-sizing: border-box;
  .theme-changer-container {
    position: absolute;
    width: 400px;
    height: 40px;
    top: -40px;
    left: 0px;
    right: 0px;
    margin: auto;
    cursor: default;

    .theme-changer-wrapper {
      background: #fff;
      height: 32px;
      border-radius: 5px;
      border: 1px solid #c8c9cc;
      box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }

    .theme-item {
      width: 20px;
      height: 20px;
      border-radius: 5px;
      border: 1px solid;
    }
  }

  .drag-handle {
    flex: 0 0 auto;
    position: relative;
    width: 1rem;
    height: 1rem;
    font-size: 1rem;
    margin-right: 0.5rem;
    cursor: grab;
  }

  .content {
    flex: 1 1 auto;
  }
}
</style>
