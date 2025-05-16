<template>
  <el-dropdown :hide-timeout="300" :disabled="!documentStore.editable" max-height="400px">
    <div style="outline: none; cursor: pointer; white-space: nowrap">
      <span v-if="currentFontSize">{{ currentFontSize }}</span>
      <i v-else class="ri-font-size"></i>
      <i class="ri-arrow-drop-down-line"></i>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in fontSizeOptions" :key="item.value" @click="toggleFontSize(item.value)">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { Editor } from "@tiptap/vue-3"
import type { BaseOption } from "@/types"
import { useDocumentStore } from "@/store"

const documentStore = useDocumentStore()

const props = defineProps<{
  editor: Editor | undefined
}>()

let fontSizeOptions: Array<BaseOption> = [
  { label: "初号", value: "56px" },
  { label: "小初", value: "48px" },
  { label: "一号", value: "34.7px" },
  { label: "小一", value: "32px" },
  { label: "二号", value: "29.3px" },
  { label: "小二", value: "24px" },
  { label: "三号", value: "21.3px" },
  { label: "小三", value: "20px" },
  { label: "四号", value: "18.7px" },
  { label: "小四", value: "16px" },
  { label: "五号", value: "14px" },
  { label: "小五", value: "12px" },
  { label: "六号", value: "10px" },
  { label: "小六", value: "8.7px" },
  { label: "七号", value: "7.3px" },
  { label: "八号", value: "6.7px" },
  { label: "9", value: "12px" },
  { label: "10", value: "13.3px" },
  { label: "12", value: "16px" },
  { label: "14", value: "18.7px" },
  { label: "16", value: "21.3px" },
  { label: "18", value: "24px" },
  { label: "20", value: "26.7px" },
  { label: "22", value: "29.3px" },
  { label: "24", value: "32px" },
  { label: "26", value: "34.7px" },
  { label: "28", value: "37.3px" },
  { label: "36", value: "48px" },
  { label: "48", value: "64px" }
]

const currentFontSize = computed(() => {
  const currentFontSize = props.editor?.getAttributes("textStyle").fontSize
  const filterOption = fontSizeOptions.find(item => item.value === currentFontSize)
  return filterOption ? filterOption.label : ""
})

// 切换标题类型
function toggleFontSize(value: string) {
  props.editor?.chain().focus().setFontSize(value).run()
}
</script>
