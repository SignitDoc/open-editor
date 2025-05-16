<template>
  <el-dropdown :hide-timeout="300">
    <div class="heading-menu">
      <span> {{ getHeadingTitle() }} </span>
      <i class="ri-arrow-drop-down-line"></i>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in headingLevelOptions" :key="item.value" @click="toggleHeadingLevel(item.value)">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3"
import { useDocumentStore } from "@/store"

const documentStore = useDocumentStore()

const props = defineProps<{
  editor: Editor | undefined
}>()

const headingLevelOptions = [
  { value: 0, label: "正文" },
  { value: 1, label: "H1" },
  { value: 2, label: "H2" },
  { value: 3, label: "H3" },
  { value: 4, label: "H4" },
  { value: 5, label: "H5" },
  { value: 6, label: "H6" }
]

// 切换标题类型
function toggleHeadingLevel(level) {
  if (!documentStore.editable) return
  if (level) props.editor?.chain().focus().toggleHeading({ level }).run()
  else props.editor?.chain().focus().setParagraph().run()
}

function getHeadingTitle() {
  if (props.editor?.isActive("heading", { level: 1 })) return "H1"
  else if (props.editor?.isActive("heading", { level: 2 })) return "H2"
  else if (props.editor?.isActive("heading", { level: 3 })) return "H3"
  else if (props.editor?.isActive("heading", { level: 4 })) return "H4"
  else if (props.editor?.isActive("heading", { level: 5 })) return "H5"
  else if (props.editor?.isActive("heading", { level: 6 })) return "H6"
  else return "正文"
}
</script>

<style lang="less" scoped>
.heading-menu {
  width: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  font-size: 14px;
}
</style>
