<template>
  <HeaderItem
    type="style"
    desc="加粗"
    icon="ri-bold"
    :active="editor?.isActive('bold')"
    @click="editor?.chain().focus().toggleBold().run()"
    :disabled="!editor?.can().chain().focus().toggleBold().run() || !documentStore.editable"
  />
  <HeaderItem
    type="style"
    desc="倾斜"
    icon="ri-italic"
    :active="editor?.isActive('italic')"
    @click="editor?.chain().focus().toggleItalic().run()"
    :disabled="!editor?.can().chain().focus().toggleItalic().run() || !documentStore.editable"
  />
  <HeaderItem
    type="style"
    desc="删除线"
    icon="ri-strikethrough"
    :active="editor?.isActive('strike')"
    @click="editor?.chain().focus().toggleStrike().run()"
    :disabled="!editor?.can().chain().focus().toggleStrike().run() || !documentStore.editable"
  />
  <HeaderItem
    type="style"
    desc="下划线"
    icon="ri-underline"
    :active="editor?.isActive('underline')"
    @click="editor?.chain().focus().toggleUnderline().run()"
    :disabled="!editor?.can().chain().focus().toggleUnderline().run() || !documentStore.editable"
  />
  <HeaderItem
    type="action"
    desc="上标"
    icon="ri-superscript"
    @click="editor?.chain().focus().toggleSuperscript().run()"
    :disabled="!editor?.can().chain().focus().toggleSuperscript().run() || !documentStore.editable"
  />
  <HeaderItem
    type="action"
    desc="下标"
    icon="ri-subscript"
    @click="editor?.chain().focus().toggleSubscript().run()"
    :disabled="!editor?.can().chain().focus().toggleSubscript().run() || !documentStore.editable"
  />
  <IconColorPicker
    v-model:color="fontColor"
    desc="字体颜色"
    icon="ri-font-family"
    defaultColor="#000"
    :editable="!documentStore.editable"
    @changeColor="changeColor"
  />
  <IconColorPicker
    v-model:color="highlightColor"
    desc="背景高亮"
    icon="ri-mark-pen-line"
    :editable="!documentStore.editable"
    @changeColor="setHighLight"
  />
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { Editor } from "@tiptap/vue-3"
import { HeaderItem, IconColorPicker } from "@/components"
import { useDocumentStore } from "@/store"

const documentStore = useDocumentStore()

const props = defineProps<{
  editor: Editor | undefined
}>()

/* ========================================== 设置字体颜色 ========================================== */
const fontColor = ref("#000000")

function changeColor() {
  if (fontColor.value) props.editor?.commands.setColor(fontColor.value)
  else {
    //默认设置黑色
    props.editor?.commands.setColor("#000000")
  }
}

/* ========================================== 设置高亮颜色 ========================================== */
const highlightColor = ref()

function setHighLight() {
  if (highlightColor.value) props.editor?.commands.toggleHighlight({ color: highlightColor.value })
  else props.editor?.commands.unsetHighlight()
}
</script>

<style lang="less" scoped>
.color-picker-container {
  :deep(.is-disabled) {
    .el-color-picker__mask {
      cursor: pointer;
      width: 16px;
      height: 16px;
      top: 4px;
      left: 0px;
    }
  }
}
.highlight-container {
  position: relative;
  .ri-text {
    position: absolute;
    font-size: 14px;
    width: 14px;
    height: 14px;
    top: 0px;
    bottom: 0px;
    left: 1px;
    right: 0px;
    margin: auto;
    z-index: 999;
    pointer-events: none;
  }
  :deep(.el-color-picker__empty) {
    display: none;
  }
  :deep(.el-color-picker__icon) {
    display: none;
  }
}
</style>
