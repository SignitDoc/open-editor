<template>
  <div class="footer-toolbar">
    <span>
      {{
        `文字统计: 共${editor?.storage.characterCount.characters() || 0}个字符，${
          editor?.storage.characterCount.words() || 0
        }个字`
      }}
    </span>
    <div class="scale-tool">
      <IconButton
        v-if="documentStore.editable"
        label="页面设置"
        icon="ri-tools-fill"
        @click="$emit('openPageSetting')"
      />
      <IconButton
        :label="isFullscreen ? '退出全屏' : '进入全屏'"
        :icon="isFullscreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'"
        @click="toggleFullScreen"
      />
      <IconButton
        label="缩小"
        :disabled="currentScaleIndex === 0"
        icon="ri-zoom-out-line"
        @click="changeScale('decrease')"
      />
      <div class="dropdown">
        <el-dropdown trigger="click">
          <span style="line-height: 17px">{{ scaleOptions[currentScaleIndex].label }}</span>
          <template #dropdown>
            <el-dropdown-menu style="overflow: hidden">
              <el-dropdown-item
                class="dropdown-item"
                v-for="item in scaleOptions"
                :key="item.value"
                @click="$emit('update:scaleRatio', item.value)"
              >
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <IconButton
        label="放大"
        :disabled="currentScaleIndex === scaleOptions.length - 1"
        icon="ri-zoom-in-line"
        @click="changeScale('increase')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { Editor } from "@tiptap/vue-3"
import { IconButton } from "@/components"
import { useFullscreen } from "@vueuse/core"
import { useDocumentStore } from "@/store"

const documentStore = useDocumentStore()

const props = defineProps<{
  editor: Editor | undefined
  editorRef: HTMLElement | null
  scaleRatio: number
}>()

const emits = defineEmits(["update:scaleRatio", "openPageSetting"])

const { toggle: toggleFullScreen, isFullscreen } = useFullscreen(props.editorRef)

const scaleOptions = [
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "100%", value: 1.0 },
  { label: "125%", value: 1.25 },
  { label: "150%", value: 1.5 },
  { label: "200%", value: 2.0 }
]

const currentScaleIndex = computed(() => scaleOptions.findIndex(item => item.value === props.scaleRatio))

function changeScale(type: "increase" | "decrease") {
  if (type === "increase" && currentScaleIndex.value < scaleOptions.length - 1) {
    emits("update:scaleRatio", scaleOptions[currentScaleIndex.value + 1].value)
  } else if (type === "decrease" && currentScaleIndex.value > 0) {
    emits("update:scaleRatio", scaleOptions[currentScaleIndex.value - 1].value)
  }
}
</script>

<style lang="less" scoped>
.footer-toolbar {
  z-index: 9999;
  position: fixed;
  bottom: 0px;
  height: 36px;
  border-top: 1px solid #ccc;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  color: #666;
  font-size: 14px;
  background-color: #fff;

  .scale-tool {
    display: flex;
    align-items: center;

    i {
      padding-right: 10px;
    }
    .dropdown {
      padding: 0 4px;
      color: #aaa;
      cursor: pointer;
    }
  }
}
</style>
