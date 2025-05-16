<template>
  <div class="icon-color-picker">
    <div class="color-picker-container">
      <!-- 上一次使用的颜色记录：直接点击可以再次使用这个颜色赋值 -->
      <el-tooltip :content="props.desc" placement="top-start" effect="dark" :show-after="300" :teleported="false">
        <div class="icon-wrapper" @click="emits('changeColor')">
          <i :class="props.icon" class="icon"></i>
          <div class="select-color-wrapper" :style="{ background: pickerColor }"></div>
        </div>
      </el-tooltip>

      <!-- 色板 -->
      <el-popover ref="ColorWrapperRef" trigger="click" :teleported="false" popper-class="color-wrapper-popover">
        <template #reference>
          <div class="picker-container">
            <i class="ri-arrow-drop-down-line"></i>
          </div>
        </template>
        <!-- 快捷色块 -->
        <div class="predefine-color-wrapper">
          <el-divider content-position="left" class="color-title" style="margin-top: 10px">{{ props.desc }}</el-divider>
          <div class="default-color" @click="setColor(defaultColor, false)">默认颜色</div>

          <!-- 色卡 -->
          <div class="predefine-color-list">
            <div v-for="(column, columnIndex) in predefinedColors" :key="columnIndex" class="predefine-column">
              <div
                v-for="color in column"
                :key="color"
                class="predefine-item"
                :style="{ background: color }"
                @click="setColor(color)"
              ></div>
            </div>
          </div>

          <!-- 标准色 -->
          <el-divider content-position="left" class="color-title">标准色</el-divider>
          <div class="predefine-color-list">
            <div
              v-for="(color, columnIndex) in standardColors"
              :key="columnIndex"
              class="predefine-item"
              :style="{ background: color }"
              @click="setColor(color)"
            ></div>
          </div>

          <!-- 历史记录：记录最近使用的10个颜色 -->
          <el-divider content-position="left" class="color-title">历史记录</el-divider>
          <div class="predefine-color-list">
            <div
              v-for="(color, columnIndex) in historyColor"
              :key="columnIndex"
              class="predefine-item"
              :style="{ background: color }"
              @click="setColor(color, false)"
            ></div>
            <div
              v-for="(color, columnIndex) in historyHintColor"
              :key="columnIndex"
              class="predefine-item"
              :style="{ background: '#fff' }"
            ></div>
          </div>
        </div>

        <!-- 其他自定义颜色 -->
        <div class="more-color">
          <div style="flex: 1; padding-top: 12px" @click="colorPickerRef?.show()">更多颜色</div>
          <el-color-picker
            v-model="pickerColor"
            ref="colorPickerRef"
            style="width: 0px; height: 0px; padding-top: 36px; overflow: hidden"
            :teleported="false"
            :disabled="props.disabled"
            @change="setColor"
          />
          <i
            class="ri-arrow-drop-down-line"
            style="flex: 1; padding-top: 12px; text-align: right"
            @click="colorPickerRef?.show()"
          ></i>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

// 快捷色块
const predefinedColors = [
  ["#ffffff", "#f2f2f2", "#d8d8d8", "#bfbfbf", "#a5a5a5", "#939393"],
  ["#000000", "#7f7f7f", "#595959", "#3f3f3f", "#262626", "#0d0d0d"],
  ["#485368", "#f3f5f7", "#c5cad3", "#808b9e", "#353b45", "#24272e"],
  ["#2972f4", "#e5efff", "#c7dcff", "#99beff", "#1450b8", "#0c306e"],
  ["#00a3f5", "#e5f6ff", "#c7ecff", "#9df9df", "#1274a5", "#0a415c"],
  ["#319b62", "#eafaf1", "#c3ead5", "#98d7b6", "#277c4f", "#184e32"],
  ["#de3c36", "#ffe9e8", "#ffc9c7", "#ff9c99", "#9e1e1a", "#58110e"],
  ["#f88825", "#fff3eb", "#ffdcc4", "#ffba84", "#b86014", "#5c300a"],
  ["#f5c400", "#fff9e3", "#ffeead", "#ffe270", "#a38200", "#665200"],
  ["#9a38d7", "#fdebff", "#f2c7ff", "#d58eff", "#5e2281", "#3b1551"]
]
// 标准色块
const standardColors = [
  "#c00000",
  "#ff0000",
  "#ffc000",
  "#ff0ff0",
  "#92d050",
  "#00b050",
  "#00b0f0",
  "#0070c0",
  "#002060",
  "#7030a0"
]

// 历史记录
const historyColor = ref<Array<string>>([])
const historyHintColor = computed(() => {
  const data: Array<string> = []
  for (let i = 0; i < 10 - historyColor.value.length; i++) {
    data.push("#ffffff")
  }
  return data
})

interface PropsType {
  color: string | undefined
  icon: string
  disabled?: boolean
  desc?: string
  defaultColor?: string
}
const props = withDefaults(defineProps<PropsType>(), {
  desc: "取色器",
  disabled: false,
  defaultColor: ""
})

const emits = defineEmits(["update:color", "changeColor"])

const colorPickerRef = ref()
const ColorWrapperRef = ref()

const pickerColor = computed({
  get: () => props.color,
  set: val => emits("update:color", val)
})

/**
 * @description 设置颜色
 * @param val 颜色
 * @param setHistory 是否需要存储在历史记录
 * @param closePopover 是否需要立即关闭色板
 */
function setColor(val, setHistory = true, closePopover = true) {
  if (setHistory) {
    if (historyColor.value.length >= 10) historyColor.value.pop()
    historyColor.value.unshift(val)
  }

  pickerColor.value = val
  emits("update:color", val)
  if (closePopover) ColorWrapperRef.value?.hide()
  emits("changeColor")
}
</script>

<style lang="less" scoped>
.color-picker-container {
  display: flex;
  align-items: center;

  .icon-wrapper {
    display: flex;
    flex-direction: column;
    padding: 2px 4px;
    .icon {
      font-size: 11px;
    }
    .select-color-wrapper {
      width: 11px;
      height: 2px;
      box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.2);
    }
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
  .picker-container {
    position: relative;
    .ri-arrow-drop-down-line {
      font-size: 14px;
      padding: 2px;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
    :deep(.el-color-picker__panel) {
      margin-top: 5px;
    }

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

  :deep(.color-wrapper-popover) {
    width: fit-content !important;
  }

  .predefine-color-wrapper {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 12px;
    .default-color {
      width: 100%;
      padding: 2px 0px;
      box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.1);
      text-align: center;
      cursor: pointer;
      margin-bottom: 12px;
    }
    .predefine-color-list {
      display: flex;
      gap: 5px;
      .predefine-column {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .predefine-item {
        width: 18px;
        height: 18px;
        box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.2);
        cursor: pointer;
      }
    }
    .color-title {
      margin: 18px 0px;
      :deep(.el-divider__text) {
        padding: 0px 10px;
      }
    }
  }
  .more-color {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    position: relative;
  }
}
</style>
