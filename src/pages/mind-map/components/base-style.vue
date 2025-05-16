<template>
  <div class="sidebar-content" :class="{ isDark: isDark }">
    <!-- 背景 -->
    <div class="title no-tip">背景</div>
    <div class="row">
      <el-tabs class="tab" v-model="activeBgTab">
        <el-tab-pane label="颜色" name="color">
          <Color
            :color="style.backgroundColor"
            @changeColor="
              color => {
                update('backgroundColor', color)
              }
            "
          />
        </el-tab-pane>
        <!-- 图片 -->
        <el-tab-pane label="图片" name="image">
          <ImgUpload
            class="imgUpload"
            v-model:data="style.backgroundImage"
            @change="
              img => {
                update('backgroundImage', img)
              }
            "
          ></ImgUpload>
          <!-- 图片重复方式 -->
          <div class="rowItem">
            <span class="name">图片重复</span>
            <el-select
              style="width: 120px"
              v-model="style.backgroundRepeat"
              placeholder=""
              @change="
                value => {
                  update('backgroundRepeat', value)
                }
              "
            >
              <el-option v-for="item in backgroundRepeatOptions" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <!-- 图片位置 -->
          <div class="rowItem">
            <span class="name">图片位置</span>
            <el-select
              style="width: 120px"
              v-model="style.backgroundPosition"
              placeholder=""
              @change="
                value => {
                  update('backgroundPosition', value)
                }
              "
            >
              <el-option
                v-for="item in backgroundPositionOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <!-- 图片大小 -->
          <div class="rowItem">
            <span class="name">图片大小</span>
            <el-select
              style="width: 120px"
              v-model="style.backgroundSize"
              placeholder=""
              @change="
                value => {
                  update('backgroundSize', value)
                }
              "
            >
              <el-option v-for="item in backgroundSizeOptions" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 连线 -->
    <div class="title no-tip">连线</div>
    <div class="row">
      <div class="rowItem">
        <span class="name">颜色</span>
        <el-color-picker
          show-alpha
          v-model="style.lineColor"
          @change="
            color => {
              update('lineColor', color)
            }
          "
        ></el-color-picker>
      </div>
      <div class="rowItem">
        <span class="name">粗细</span>
        <el-select
          style="width: 80px"
          v-model="style.lineWidth"
          placeholder=""
          @change="
            value => {
              update('lineWidth', value)
            }
          "
        >
          <el-option v-for="item in lineWidthOptions" :key="item" :label="item" :value="item">
            <span
              v-if="item > 0"
              class="borderLine"
              :class="{ isDark: isDark }"
              :style="{ height: item + 'px' }"
            ></span>
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- 线宽 -->
    <div class="row">
      <div class="rowItem" v-if="lineStyleListShow.length > 1">
        <span class="name">风格</span>
        <el-select
          style="width: 80px"
          v-model="style.lineStyle"
          placeholder=""
          @change="
            value => {
              update('lineStyle', value)
            }
          "
        >
          <el-option
            v-for="item in lineStyleListShow"
            :key="item.value"
            :label="item.name"
            :value="item.value"
            class="lineStyleOption"
            :class="{
              isDark: isDark,
              isSelected: style.lineStyle === item.value
            }"
          >
          </el-option>
        </el-select>
      </div>

      <!-- 根节点连线样式 -->
      <div class="rowItem" v-if="style.lineStyle === 'curve' && showRootLineKeepSameInCurveLayouts">
        <span class="name">根节点</span>
        <el-select
          style="width: 60px"
          v-model="style.rootLineKeepSameInCurve"
          placeholder=""
          @change="
            value => {
              update('rootLineKeepSameInCurve', value)
            }
          "
        >
          <el-option
            v-for="item in rootLineKeepSameInCurveOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <!-- 连线圆角大小 -->
      <div class="rowItem" v-if="showLineRadius">
        <span class="name">圆角大小</span>
        <el-select
          style="width: 80px"
          v-model="style.lineRadius"
          placeholder=""
          @change="
            value => {
              update('lineRadius', value)
            }
          "
        >
          <el-option v-for="item in [0, 2, 5, 7, 10, 12, 15]" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </div>
    </div>

    <div class="row">
      <!-- 根节点连线起始位置 -->
      <div class="rowItem" v-if="style.lineStyle === 'curve' && showRootLineKeepSameInCurveLayouts">
        <span class="name">根节点连线起始位置</span>
        <el-select
          style="width: 80px"
          v-model="style.rootLineStartPositionKeepSameInCurve"
          placeholder=""
          @change="
            value => {
              update('rootLineStartPositionKeepSameInCurve', value)
            }
          "
        >
          <el-option key="center" label="中心" :value="false"> </el-option>
          <el-option key="right" label="根节点连线起始位置" :value="true"> </el-option>
        </el-select>
      </div>
    </div>

    <div class="row">
      <div class="rowItem">
        <el-checkbox
          v-model="style.showLineMarker"
          @change="
            value => {
              update('showLineMarker', value)
            }
          "
          >是否显示箭头</el-checkbox
        >
      </div>
    </div>

    <!-- 概要连线 -->
    <div class="title no-tip">概要的连线</div>
    <div class="row">
      <div class="rowItem">
        <span class="name">颜色</span>

        <el-color-picker
          show-alpha
          v-model="style.generalizationLineColor"
          @change="
            color => {
              update('generalizationLineColor', color)
            }
          "
        ></el-color-picker>
      </div>

      <div class="rowItem">
        <span class="name">粗细</span>
        <el-select
          style="width: 60px"
          v-model="style.generalizationLineWidth"
          placeholder=""
          @change="
            value => {
              update('generalizationLineWidth', value)
            }
          "
        >
          <el-option v-for="item in lineWidthOptions" :key="item" :label="item" :value="item">
            <span
              v-if="item > 0"
              class="borderLine"
              :class="{ isDark: isDark }"
              :style="{ height: item + 'px' }"
            ></span>
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- 关联线 -->
    <div class="title no-tip">关联线</div>
    <div class="row">
      <div class="rowItem">
        <span class="name">颜色</span>

        <el-color-picker
          show-alpha
          v-model="style.associativeLineColor"
          @change="
            color => {
              update('associativeLineColor', color)
            }
          "
        ></el-color-picker>
      </div>
      <div class="rowItem">
        <span class="name">粗细</span>
        <el-select
          style="width: 80px"
          v-model="style.associativeLineWidth"
          placeholder=""
          @change="
            value => {
              update('associativeLineWidth', value)
            }
          "
        >
          <el-option v-for="item in lineWidthOptions" :key="item" :label="item" :value="item">
            <span
              v-if="item > 0"
              class="borderLine"
              :class="{ isDark: isDark }"
              :style="{ height: item + 'px' }"
            ></span>
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="row">
      <div class="rowItem">
        <span class="name">激活颜色</span>
        <el-color-picker
          show-alpha
          v-model="style.associativeLineActiveColor"
          @change="
            color => {
              update('associativeLineActiveColor', color)
            }
          "
        ></el-color-picker>
      </div>
      <div class="rowItem">
        <span class="name">激活粗细</span>
        <el-select
          style="width: 80px"
          v-model="style.associativeLineActiveWidth"
          placeholder=""
          @change="
            value => {
              update('associativeLineActiveWidth', value)
            }
          "
        >
          <el-option v-for="item in lineWidthOptions" :key="item" :label="item" :value="item">
            <span
              v-if="item > 0"
              class="borderLine"
              :class="{ isDark: isDark }"
              :style="{ height: item + 'px' }"
            ></span>
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- 关联线文字 -->
    <div class="title no-tip">关联线文字</div>
    <div class="row">
      <div class="rowItem">
        <span class="name">字体</span>
        <el-select
          style="width: 150px"
          v-model="style.associativeLineTextFontFamily"
          placeholder=""
          @change="update('associativeLineTextFontFamily', $event)"
        >
          <el-option
            v-for="item in fontFamilyOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
            :style="{ fontFamily: item.value }"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="row">
      <div class="rowItem">
        <span class="name">颜色</span>

        <el-color-picker
          show-alpha
          v-model="style.associativeLineTextColor"
          @change="
            color => {
              update('associativeLineTextColor', color)
            }
          "
        ></el-color-picker>
      </div>

      <div class="rowItem">
        <span class="name">字号</span>
        <el-select
          style="width: 80px"
          v-model="style.associativeLineTextFontSize"
          placeholder=""
          @change="update('associativeLineTextFontSize', $event)"
        >
          <el-option v-for="item in fontSizes" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </div>
    </div>

    <!-- 节点边框风格 -->
    <template v-if="showNodeUseLineStyle">
      <div class="title no-tip">节点边框风格</div>
      <div class="row">
        <div class="rowItem">
          <el-checkbox
            v-model="style.nodeUseLineStyle"
            @change="
              value => {
                update('nodeUseLineStyle', value)
              }
            "
            >是否使用只有底边框的风格</el-checkbox
          >
        </div>
      </div>
    </template>

    <!-- 内边距 -->
    <div class="title no-tip">节点内边距</div>
    <div class="row">
      <div class="rowItem">
        <span class="name">水平</span>
        <el-slider
          style="width: 200px"
          v-model="style.paddingX"
          @change="
            value => {
              update('paddingX', value)
            }
          "
        ></el-slider>
      </div>
    </div>
    <div class="row">
      <div class="rowItem">
        <span class="name">垂直</span>
        <el-slider
          style="width: 200px"
          v-model="style.paddingY"
          @change="
            value => {
              update('paddingY', value)
            }
          "
        ></el-slider>
      </div>
    </div>

    <!-- 图片 -->
    <div class="title no-tip">图片</div>
    <div class="row">
      <div class="rowItem">
        <span class="name">显示的最大宽度</span>
        <el-slider
          style="width: 140px"
          v-model="style.imgMaxWidth"
          :min="10"
          :max="300"
          @change="
            value => {
              update('imgMaxWidth', value)
            }
          "
        ></el-slider>
      </div>
    </div>
    <div class="row">
      <div class="rowItem">
        <span class="name">显示的最大高度</span>
        <el-slider
          style="width: 140px"
          v-model="style.imgMaxHeight"
          :min="10"
          :max="300"
          @change="
            value => {
              update('imgMaxHeight', value)
            }
          "
        ></el-slider>
      </div>
    </div>

    <!-- 图标 -->
    <div class="title no-tip">图标</div>
    <div class="row">
      <div class="rowItem">
        <span class="name">大小</span>
        <el-slider
          style="width: 200px"
          v-model="style.iconSize"
          :min="12"
          :max="50"
          @change="
            value => {
              update('iconSize', value)
            }
          "
        ></el-slider>
      </div>
    </div>

    <!-- 二级节点外边距 -->
    <div class="title no-tip">节点外边距</div>
    <div class="row column">
      <el-tabs class="tab" v-model="marginActiveTab">
        <el-tab-pane label="二级节点" name="second">
          <div class="rowItem">
            <span class="name">水平</span>
            <el-slider
              :max="200"
              style="width: 200px"
              v-model="style.second.marginX"
              @change="
                value => {
                  update('second.marginX', value)
                }
              "
            ></el-slider>
          </div>
          <div class="rowItem">
            <span class="name">垂直</span>
            <el-slider
              :max="200"
              style="width: 200px"
              v-model="style.second.marginY"
              @change="
                value => {
                  update('second.marginY', value)
                }
              "
            ></el-slider>
          </div>
        </el-tab-pane>
        <el-tab-pane label="三级及以下节点" name="node">
          <div class="rowItem">
            <span class="name">水平</span>
            <el-slider
              :max="200"
              style="width: 200px"
              v-model="style.node.marginX"
              @change="
                value => {
                  update('node.marginX', value)
                }
              "
            ></el-slider>
          </div>
          <div class="rowItem">
            <span class="name">垂直</span>
            <el-slider
              :max="200"
              style="width: 200px"
              v-model="style.node.marginY"
              @change="
                value => {
                  update('node.marginY', value)
                }
              "
            ></el-slider>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 外框内边距 -->
    <!-- <div class="title no-tip">外框内边距</div>
      <div class="row">
        <div class="rowItem">
          <span class="name">水平</span>
          <el-slider
            style="width: 200px"
            v-model="outerFramePadding.outerFramePaddingX"
            @change="
              value => {
                updateOuterFramePadding('outerFramePaddingX', value)
              }
            "
          ></el-slider>
        </div>
      </div>
      <div class="row">
        <div class="rowItem">
          <span class="name">垂直</span>
          <el-slider
            style="width: 200px"
            v-model="outerFramePadding.outerFramePaddingY"
            @change="
              value => {
                updateOuterFramePadding('outerFramePaddingY', value)
              }
            "
          ></el-slider>
        </div>
      </div> -->
  </div>
</template>

<script setup lang="ts">
import Color from "./color.vue"
import { useMindMapStore, initBaseStyleConfig, initOtherConfigData } from "../config"
import ImgUpload from "./img-upload.vue"
import {
  supportLineStyleLayoutsMap,
  fontSizes,
  lineWidthOptions,
  lineStyleOptions,
  supportLineRadiusLayouts,
  supportNodeUseLineStyleLayouts,
  supportRootLineKeepSameInCurveLayouts,
  rainbowLinesOptions,
  backgroundRepeatOptions,
  backgroundPositionOptions,
  backgroundSizeOptions,
  fontFamilyOptions,
  rootLineKeepSameInCurveOptions
} from "../constant"
import { ref, watch, reactive, computed, onMounted } from "vue"

const mindMapStore = useMindMapStore()

const mindMap = computed(() => mindMapStore.mindMap as any)

// 思维导图数据
const mindMapData = ref()

watch(
  () => mindMap.value,
  () => {
    mindMapData.value = mindMap.value?.getData(true)
    console.log("初始化", mindMapData.value)
  },
  {
    deep: true,
    immediate: true
  }
)

//激活的背景tab
const activeBgTab = ref("color")

// 节点外边距激活的tab
const marginActiveTab = ref("second")

const style = reactive({
  second: {
    marginX: 0,
    marginY: 0
  },
  node: {
    marginX: 0,
    marginY: 0
  }
} as any)

const config = reactive({} as any)

/*========================================水印设置========================================*/
//水印配置
const watermarkConfig = reactive({
  show: false,
  onlyExport: false,
  text: "",
  lineSpacing: 100,
  textSpacing: 100,
  angle: 30,
  belowNode: false,
  textStyle: {
    color: "",
    opacity: 0,
    fontSize: 1
  }
})

const updateWatermarkTimer = ref(null)

const localConfigs = reactive({
  isShowScrollbar: false,
  isUseHandDrawnLikeStyle: false
})

const currentLayout = ref("") // 当前结构

// 外框内边距
const outerFramePadding = reactive({
  outerFramePaddingX: 0,
  outerFramePaddingY: 0
})

const isDark = ref(false)

// 是否支持手绘风格
const supportHandDrawnLikeStyle = computed(() => mindMapStore.supportHandDrawnLikeStyle)

// 本地配置
const localConfig = computed(() => mindMapStore.localConfig)

// 是否支持的连线风格
const showNodeUseLineStyle = computed(() => {
  return supportNodeUseLineStyleLayouts.includes(currentLayout.value)
})

// 是否支持的连线圆角
const showLineRadius = computed(() => {
  return style.lineStyle === "straight" && supportLineRadiusLayouts.includes(currentLayout.value)
})

const lineStyleListShow = computed(() => {
  const res = [] as Array<{ value: string; name: string }>
  lineStyleOptions.forEach(item => {
    const list = supportLineStyleLayoutsMap[item.value]
    if (list) {
      if (list.includes(currentLayout.value)) {
        res.push(item)
      }
    } else {
      res.push(item)
    }
  })
  return res
})

// 是否支持根节点连线保持一致
const showRootLineKeepSameInCurveLayouts = computed(() => {
  return supportRootLineKeepSameInCurveLayouts.includes(currentLayout.value)
})

watch(lineStyleListShow, () => {
  const has = lineStyleListShow.value.find(item => {
    return item.value === style.lineStyle
  })
  if (!has) {
    style.lineStyle = lineStyleListShow.value[0].value
  }
})

// 初始化样式
function initStyle() {
  const data = mindMap.value
  if (data) {
    Object.keys(initBaseStyleConfig).forEach(key => {
      if (key === "node" || key === "second") {
        const obj = initBaseStyleConfig[key]
        Object.keys(obj).forEach(k => {
          if (data.getThemeConfig()) {
            style[key] = {
              ...style[key],
              ...data.getThemeConfig(key)
            }
          }
        })
      } else if (data.getThemeConfig(key)) {
        if (key === "backgroundImage" && data[key] === "none") {
          style[key] = ""
        } else {
          style[key] = data.getThemeConfig(key)
        }
      }
    })
  }
}

// 初始化本地配置
function initLocalConfig() {}

// 初始化其他配置
function initOtherConfig() {
  Object.keys(initOtherConfigData).forEach(key => {
    if (mindMap.value.getConfig(key)) {
      config[key] = mindMap.value.getConfig(key)
    }
  })
}

// 更新样式
function update(key: string, value: any) {
  if (key === "backgroundImage" && value === "none") {
    style.backgroundImage = ""
  } else {
    //如果key中有.则需要拆分
    const keys = key.split(".")
    if (keys.length === 1) {
      style[key] = value
    }
  }
  const keys = key.split(".")
  if (keys.length === 1) {
    mindMapData.value.theme.config[key] = value
  } else {
    //先判断是否存在keys[0]，不存在则创建
    if (!mindMapData.value.theme.config[keys[0]]) {
      mindMapData.value.theme.config[keys[0]] = {}
    }
    mindMapData.value.theme.config[keys[0]][keys[1]] = value
  }
  mindMap.value.setThemeConfig(mindMapData.value.theme.config)
}

// 更新其他配置
function updateOtherConfig(key: string, value: any) {
  config[key] = value
  mindMapStore.updateBaseStyle(key, value)
}

// 更新本地配置
function updateLocalConfig(key: string, value: any) {
  localConfigs[key] = value
}

onMounted(() => {
  initLocalConfig()
  initStyle()
  initOtherConfig()
  initOuterFramePadding()
  currentLayout.value = mindMap.value.getLayout()
})

/*======================================外框 ==============================*/
// 初始化外框
function initOuterFramePadding() {
  outerFramePadding.outerFramePaddingX = mindMap.value.getConfig("outerFramePaddingX")
  outerFramePadding.outerFramePaddingY = mindMap.value.getConfig("outerFramePaddingY")
}

// 更新外框内边距
function updateMargin(key: string, value: any) {
  style[key] = value
  mindMapStore.updateBaseStyle("margin", {
    [marginActiveTab.value]: {
      [key]: value
    }
  })
}

// 更新外框内边距
function updateOuterFramePadding(key: string, value: any) {
  outerFramePadding[key] = value
  // mindMapStore.updateBaseStyle("outerFramePadding", outerFramePadding)
}
</script>

<style lang="less" scoped>
.sidebar-content {
  padding: 20px;
  padding-top: 10px;

  &.isDark {
    .title {
      color: #fff;
    }

    .row {
      .rowItem {
        .name,
        .curRainbowLine {
          color: hsla(0, 0%, 100%, 0.6);
        }
      }
    }
  }

  .title {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(26, 26, 26, 0.9);
    margin-bottom: 10px;
    margin-top: 20px;
    border-bottom: 1px solid #f0f0f0;

    &.no-tip {
      margin-top: 0;
    }
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    &.column {
      flex-direction: column;
    }

    .tab {
      width: 100%;
    }

    .imgUpload {
      margin-bottom: 5px;
    }

    .btnGroup {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .rowItem {
      display: flex;
      align-items: center;
      margin-bottom: 5px;

      .name {
        font-size: 12px;
        margin-right: 10px;
        white-space: nowrap;
      }

      .block {
        display: inline-block;
        width: 30px;
        height: 30px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        cursor: pointer;
      }

      .curRainbowLine {
        height: 24px;
        border: 1px solid #dcdfe6;
        font-size: 12px;
        width: 240px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }

    .styleBtn {
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

      &.actived {
        background-color: #eee;
      }

      .colorShow {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
      }
    }
  }
}

.borderLine {
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
  .borderLine {
    background-color: #409eff;
  }
}

.lineStyleOption {
  &.isDark {
    svg {
      path {
        stroke: #fff;
      }
    }
  }

  &.isSelected {
    svg {
      path {
        stroke: #409eff;
      }
    }
  }

  svg {
    margin-top: 4px;

    path {
      stroke: #000;
    }
  }
}

.rainbowLinesOptionsBox {
  width: 200px;

  &.isDark {
    .optionItem {
      color: hsla(0, 0%, 100%, 0.6);

      &:hover {
        background-color: hsla(0, 0%, 100%, 0.05);
      }
    }
  }

  .optionItem {
    width: 100%;
    height: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: #f5f7fa;
    }
  }
}

.colorsBar {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;

  .colorItem {
    flex: 1;
    height: 15px;
  }
}
</style>
