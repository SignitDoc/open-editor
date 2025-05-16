<template>
  <div v-if="activeNodes.length > 0" class="style-box-wrapper" :class="{ isDark }">
    <div class="sidebar-content">
      <!-- 文字 -->
      <div class="title no-tip">文字</div>
      <div class="row">
        <div class="row-item">
          <span class="name">字体</span>
          <el-select style="width: 100px" v-model="style.fontFamily" placeholder="" @change="update('fontFamily')">
            <el-option
              v-for="item in fontFamilyOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              :style="{ fontFamily: item.value }"
            />
          </el-select>
        </div>
      </div>
      <div class="row">
        <div class="row-item">
          <span class="name">字号</span>
          <el-select style="width: 80px" v-model="style.fontSize" placeholder="" @change="update('fontSize')">
            <el-option v-for="item in fontSizeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="row-item">
          <span class="name">行高</span>
          <el-select style="width: 80px" v-model="style.lineHeight" placeholder="" @change="update('lineHeight')">
            <el-option v-for="item in lineHeightOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
      </div>
      <div class="row">
        <div class="btn-group">
          <el-popover placement="bottom">
            <template #reference>
              <div>
                <el-tooltip content="颜色" placement="right">
                  <div class="style-btn">
                    A
                    <span class="color-show" :style="{ backgroundColor: style.color || '#eee' }" />
                  </div>
                </el-tooltip>
              </div>
            </template>
            <Color v-model:color="style.color" @change-color="changeFontColor" />
          </el-popover>

          <el-tooltip content="加粗" placement="bottom">
            <div class="style-btn" :class="{ active: style.fontWeight === 'bold' }" @click="toggleFontWeight">B</div>
          </el-tooltip>
          <el-tooltip content="斜体" placement="bottom">
            <div class="style-btn i" :class="{ active: style.fontStyle === 'italic' }" @click="toggleFontStyle">I</div>
          </el-tooltip>
        </div>
        <el-popover>
          <template #reference>
            <div>
              <el-tooltip content="划线" placement="top">
                <div
                  class="style-btn"
                  :style="{ textDecoration: style.textDecoration || 'none' }"
                  v-popover="{ popover: popover2 }"
                >
                  U
                </div>
              </el-tooltip>
            </div>
          </template>
          <el-radio-group size="small" v-model="style.textDecoration" @change="update('textDecoration')">
            <el-radio-button label="none">无</el-radio-button>
            <el-radio-button label="underline">下划线</el-radio-button>
            <el-radio-button label="line-through">中划线</el-radio-button>
            <el-radio-button label="overline">上划线</el-radio-button>
          </el-radio-group>
        </el-popover>
      </div>
      <!-- 边框 -->
      <div class="title">边框</div>
      <div class="row">
        <div class="row-item">
          <span class="name">颜色</span>

          <el-popover placement="bottom">
            <template #reference>
              <span class="block" :style="{ width: '80px', backgroundColor: style.borderColor }" />
            </template>
            <Color v-model:color="style.borderColor" @change-color="changeBorderColor" />
          </el-popover>
        </div>
        <div class="row-item">
          <span class="name">样式</span>
          <el-select
            style="width: 80px"
            v-model="style.borderDasharray"
            placeholder=""
            @change="update('borderDasharray')"
          >
            <el-option v-for="item in borderDasharrayOptions" :key="item.value" :label="item.name" :value="item.value">
              <svg width="120" height="34">
                <line
                  x1="10"
                  y1="17"
                  x2="110"
                  y2="17"
                  stroke-width="2"
                  :stroke="style.borderDasharray === item.value ? '#409eff' : isDark ? '#fff' : '#000'"
                  :stroke-dasharray="item.value"
                />
              </svg>
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row">
        <div class="row-item">
          <span class="name">宽度</span>
          <el-select style="width: 80px" v-model="style.borderWidth" placeholder="" @change="update('borderWidth')">
            <el-option v-for="item in borderWidthOptions" :key="item" :label="item" :value="item">
              <span v-if="item > 0" class="border-line" :class="{ isDark }" :style="{ height: `${item}px` }" />
            </el-option>
          </el-select>
        </div>
        <div class="row-item" v-show="style.shape === 'rectangle'">
          <span class="name">圆角</span>
          <el-select style="width: 80px" v-model="style.borderRadius" placeholder="" @change="update('borderRadius')">
            <el-option v-for="item in borderRadiusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
      </div>
      <!-- 背景 -->
      <div class="title">背景</div>
      <div class="row">
        <div class="row-item">
          <span class="name">颜色</span>
          <el-popover placement="bottom">
            <template #reference>
              <span class="block" :style="{ backgroundColor: style.fillColor }" />
            </template>
            <Color v-model:color="style.fillColor" @change-color="changeBgColor" />
          </el-popover>
        </div>
      </div>
      <div class="row">
        <div class="row-item">
          <span class="name">渐变</span>
          <el-checkbox v-model="style.gradientStyle" @change="update('gradientStyle')" />
        </div>
        <div class="row-item">
          <span class="name">起始</span>
          <el-popover placement="bottom" trigger="hover">
            <template #reference>
              <span class="block" :style="{ backgroundColor: style.startColor }" />
            </template>
            <Color v-model:color="style.startColor" @change-color="changeStartColor" />
          </el-popover>
        </div>
        <div class="row-item">
          <span class="name">起始</span>
          <el-popover placement="bottom">
            <template #reference>
              <span class="block" :style="{ backgroundColor: style.endColor }" />
            </template>
            <Color v-model:color="style.endColor" @change-color="changeEndColor" />
          </el-popover>
        </div>
      </div>
      <!-- 形状 -->
      <div class="title">形状</div>
      <div class="row">
        <div class="row-item">
          <span class="name">形状</span>
          <el-select style="width: 120px" v-model="style.shape" placeholder="" @change="update('shape')">
            <el-option v-for="item in shapeOptions" :key="item.value" :label="item.name" :value="item.value">
              <svg width="60" height="26" style="margin-top: 5px">
                <path
                  :d="shapesMap[item.value]"
                  fill="none"
                  :stroke="style.shape === item.value ? '#409eff' : isDark ? '#fff' : '#000'"
                  stroke-width="2"
                />
              </svg>
            </el-option>
          </el-select>
        </div>
      </div>
      <!-- 线条 -->
      <div class="title">线条</div>
      <div class="row">
        <div class="row-item">
          <span class="name">颜色</span>

          <el-popover placement="bottom" trigger="hover">
            <template #reference>
              <span class="block" :style="{ width: '80px', backgroundColor: style.lineColor }" />
            </template>
            <Color v-model:color="style.lineColor" @change-color="changeLineColor" />
          </el-popover>
        </div>
        <div class="row-item">
          <span class="name">样式</span>
          <el-select style="width: 80px" v-model="style.lineDasharray" placeholder="" @change="update('lineDasharray')">
            <el-option v-for="item in borderDasharrayOptions" :key="item.value" :label="item.name" :value="item.value">
              <svg width="120" height="34">
                <line
                  x1="10"
                  y1="17"
                  x2="110"
                  y2="17"
                  stroke-width="2"
                  :stroke="style.lineDasharray === item.value ? '#409eff' : isDark ? '#fff' : '#000'"
                  :stroke-dasharray="item.value"
                />
              </svg>
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row">
        <div class="row-item">
          <span class="name">宽度</span>
          <el-select
            style="width: 80px"
            v-model="style.lineWidth"
            placeholder=""
            @change="
              e => {
                console.log('lineWidth', e)
              }
            "
          >
            <el-option v-for="item in borderWidthOptions" :key="item" :label="item" :value="item">
              <span v-if="item > 0" class="border-line" :class="{ isDark }" :style="{ height: `${item}px` }" />
            </el-option>
          </el-select>
        </div>
        <div class="row-item">
          <span class="name">箭头位置</span>
          <el-select style="width: 80px" v-model="style.lineMarkerDir" placeholder="" @change="update('lineMarkerDir')">
            <el-option key="start" label="头部" value="start" />
            <el-option key="end" label="尾部" value="end" />
          </el-select>
        </div>
      </div>
      <!-- 节点内边距 -->
      <div class="title no-tip">节点内边距</div>
      <div class="row">
        <div class="row-item">
          <span class="name">水平</span>
          <el-slider style="width: 200px" v-model="style.paddingX" @change="update('paddingX')" />
        </div>
      </div>
      <div class="row">
        <div class="row-item">
          <span class="name">垂直</span>
          <el-slider style="width: 200px" v-model="style.paddingY" @change="update('paddingY')" />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="tip-box">
    <!-- <div class="tip-icon" /> -->
    <div class="tipText">请选择一个节点</div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, computed, watch } from "vue"
import Color from "./color.vue"

import { useMindMapStore } from "../config"
import {
  fontFamilyOptions,
  fontSizeOptions,
  borderWidthOptions,
  borderDasharrayOptions,
  borderRadiusOptions,
  lineHeightOptions,
  shapesMap,
  shapeOptions
} from "../constant"

const mindMapStore = useMindMapStore()
// 使用 ref 创建响应式引用
const sidebar = ref()
const popover1 = ref()
const popover2 = ref()
const popover3 = ref()
const popover4 = ref()
const popover5 = ref()
const popover6 = ref()
const popover7 = ref()

const isDark = ref(false)

onMounted(() => {
  initNodeStyle()
})

const style = reactive({
  shape: "",
  paddingX: 0,
  paddingY: 0,
  color: "",
  fontFamily: "",
  fontSize: "",
  lineHeight: "",
  textDecoration: "",
  fontWeight: "",
  fontStyle: "",
  borderWidth: 0 as number | null,
  borderColor: "",
  fillColor: "",
  borderDasharray: "",
  borderRadius: "",
  lineColor: "",
  lineDasharray: "",
  lineWidth: 0 as number | null,
  lineMarkerDir: "",
  gradientStyle: false,
  startColor: "",
  endColor: ""
})

const activeNodes = computed(() => {
  return mindMapStore.activeNodes
})

const initNodeStyle = () => {
  if (activeNodes.value.length <= 0) {
    return
  }
  const list = [
    "shape",
    "paddingX",
    "paddingY",
    "color",
    "fontFamily",
    "fontSize",
    "lineHeight",
    "textDecoration",
    "fontWeight",
    "fontStyle",
    "borderWidth",
    "borderColor",
    "fillColor",
    "borderDasharray",
    "borderRadius",
    "lineColor",
    "lineDasharray",
    "lineWidth",
    "lineMarkerDir",
    "gradientStyle",
    "startColor",
    "endColor"
  ]
  list.forEach(item => {
    style[item] = activeNodes.value[0].getStyle(item, false)
  })
  console.log("样式", style)
}

const update = (prop: string) => {
  activeNodes.value.forEach(node => {
    node.setStyle(prop, style[prop])
  })
}

// 修改字体颜色
const changeFontColor = (e: string) => {
  style.color = e
  update("color")
}

// 修改边框颜色
const changeBorderColor = (e: string) => {
  style.borderColor = e
  if (style.borderWidth === 0) {
    style.borderWidth = 1
    update("borderWidth")
  }
  update("borderColor")
}

// 修改背景颜色
const changeBgColor = (e: string) => {
  style.fillColor = e
  update("fillColor")
}

// 修改渐变起始颜色
const changeStartColor = (e: string) => {
  style.startColor = e
  update("startColor")
}

// 修改渐变结束颜色
const changeEndColor = (e: string) => {
  style.endColor = e
  update("endColor")
}

// 修改线条颜色
const changeLineColor = (e: string) => {
  style.lineColor = e
  update("lineColor")
}

// 改变字重
const toggleFontWeight = () => {
  style.fontWeight = style.fontWeight === "bold" ? "normal" : "bold"
  update("fontWeight")
}

// 改变斜体
const toggleFontStyle = () => {
  style.fontStyle = style.fontStyle === "italic" ? "normal" : "italic"
  update("fontStyle")
}
</script>

<style lang="less" scoped>
.style-box-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  &.isDark {
    .sidebar-content {
      .title {
        color: #fff;
      }

      .row {
        .row-item {
          .name {
            color: hsla(0, 0%, 100%, 0.6);
          }
        }

        .style-btn {
          background-color: #363b3f;
          color: hsla(0, 0%, 100%, 0.6);
          border-color: hsla(0, 0%, 100%, 0.1);
        }
      }
    }
  }

  .tab {
    flex-grow: 0;
    flex-shrink: 0;
    padding: 0 20px;
  }
}

.tip-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;

  .tip-icon {
    font-size: 100px;
  }
}

.sidebar-content {
  padding: 20px;
  padding-top: 10px;

  .title {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(26, 26, 26, 0.9);
    margin-bottom: 10px;
    margin-top: 20px;

    &.no-tip {
      margin-top: 0;
    }
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .btn-group {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .row-item {
      display: flex;
      align-items: center;

      .name {
        font-size: 12px;
        padding-right: 10px;
        display: inline-block;
        width: fit-content;
        min-width: 50px;
      }

      .block {
        display: inline-block;
        width: 30px;
        height: 30px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        cursor: pointer;

        &.disabled {
          background-color: #f5f7fa !important;
          border-color: #e4e7ed !important;
          color: #c0c4cc !important;
          cursor: not-allowed !important;
        }
      }
    }

    .style-btn {
      position: relative;
      width: 50px;
      height: 30px;
      background: #fff;
      border: 1px solid #eee;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      cursor: pointer;
      border-radius: 4px;

      &.active {
        background-color: #eee;
      }

      &.disabled {
        background-color: #f5f7fa !important;
        border-color: #e4e7ed !important;
        color: #c0c4cc !important;
        cursor: not-allowed !important;
      }

      &.i {
        font-style: italic;
      }

      .color-show {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
      }
    }
  }
}

.border-line {
  display: inline-block;
  width: 100%;
  background-color: #000;

  &.isDark {
    background-color: #fff;
  }
}
</style>
<style lang="less">
.el-select-dropdown__item.selected {
  .border-line {
    background-color: #409eff;
  }
}
</style>
