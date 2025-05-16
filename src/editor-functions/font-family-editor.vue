<template>
  <el-dropdown :hide-timeout="300" :disabled="!documentStore.editable" max-height="300px">
    <div style="outline: none; cursor: pointer; white-space: nowrap">
      <span>{{ currentFontFamily }}</span>
      <i class="ri-arrow-drop-down-line"></i>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in fontFamilyOptions"
          :key="item.value"
          @click="toggleFontFamily(item.value)"
          :style="{ 'font-family': item.value }"
        >
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

let fontFamilyOptions: Array<BaseOption> = [
  { label: "宋体", value: "SimSun" },
  { label: "黑体", value: "SimHei" },
  { label: "微软雅黑", value: "Microsoft YaHei" },
  { label: "仿宋", value: "FangSong" },
  { label: "楷体", value: "KaiTi" },
  { label: "无衬线(Inter)", value: "Inter" },
  { label: "手写风格(Comic Sans MS)", value: "Comic Sans MS" },
  { label: "手写风格(Comic Sans)", value: "Comic Sans" },
  { label: "有衬线(serif)", value: "serif" },
  { label: "等宽字体(monospace)", value: "monospace" },
  { label: "草书", value: "cursive" },
  { label: "新罗马字体", value: "Times New Roman" },
  { label: "等宽字体(Courier New)", value: "Courier New" },
  { label: "Arial", value: "Arial" },
  { label: "Helvetica", value: "Helvetica" },
  { label: "Verdana", value: "Verdana" },
  { label: "Georgia", value: "Georgia" },
  { label: "Palatino Linotype", value: "Palatino Linotype" },
  { label: "Tahoma", value: "Tahoma" },
  { label: "Lucida Sans", value: "Lucida Sans" },
  { label: "Lucida Grande", value: "Lucida Grande" }
]

const currentFontFamily = computed(() => {
  const currentFontFamily = props.editor?.getAttributes("textStyle").fontFamily
  if (currentFontFamily?.length < 20) {
    const filterOption = fontFamilyOptions.find(item => item.value === currentFontFamily)
    return filterOption ? filterOption.label : "默认字体"
  } else return "默认字体"
})

// 切换标题类型
function toggleFontFamily(value: string) {
  props.editor?.chain().focus().setFontFamily(value).run()
}
</script>
