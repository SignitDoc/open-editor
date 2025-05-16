<template>
  <div class="watermark-list-root">
    <div class="watermark-title">
      <div>文档水印</div>
      <IconButton label="关闭水印" icon="ri-close-line" @click="closeWatermarkList"></IconButton>
    </div>

    <!-- 水印设置 -->
    <div class="watermark-setup">
      <el-form ref="ruleFormRef" label-suffix=":" label-width="82px" :model="watermarkForm" :rules="rules">
        <el-form-item label="水印类型">
          <el-select v-model="watermarkForm.typeofWatermark">
            <el-option label="文本水印" value="word"></el-option>
            <el-option label="日期水印" value="date"></el-option>
            <el-option label="访客水印" value="visitor"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="watermarkForm.typeofWatermark === 'word'" label="文本内容" prop="text">
          <el-input
            v-model="watermarkForm.text"
            placeholder="请输入文本内容"
            :maxlength="10"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item v-if="watermarkForm.typeofWatermark === 'date'" label="选择日期" prop="date">
          <el-date-picker
            v-model="watermarkForm.date"
            placeholder="请选择日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="水印方向">
          <div class="direction-container">
            <div
              class="direction-item"
              :class="{ active: watermarkForm.direction === '45' }"
              @click="watermarkForm.direction = '45'"
            >
              <span class="direction-45">ABC</span>
            </div>
            <div
              class="direction-item"
              :class="{ active: watermarkForm.direction === '90' }"
              @click="watermarkForm.direction = '90'"
            >
              <span class="direction-90">ABC</span>
            </div>
            <div
              class="direction-item"
              :class="{ active: watermarkForm.direction === '0' }"
              @click="watermarkForm.direction = '0'"
            >
              <span class="direction-180">ABC</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="水印尺寸">
          <el-slider v-model="watermarkForm.size" :min="20" :max="48"></el-slider>
        </el-form-item>
        <el-form-item label="不透明度">
          <el-slider v-model="watermarkForm.transparency" :min="1" :max="10"></el-slider>
        </el-form-item>
        <el-form-item label="水印样式">
          <el-select v-model="watermarkForm.watermarkStyle">
            <el-option label="居中" value="middle"></el-option>
            <el-option label="铺满" value="full"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="watermarkForm.watermarkStyle === 'full'" label="水印间距">
          <el-slider v-model="watermarkForm.spacing" :min="40" :max="160"></el-slider>
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="watermarkForm.color"></el-color-picker>
        </el-form-item>
      </el-form>
    </div>

    <!-- 水印预览 -->
    <div class="canvas-contain">
      <div>效果预览:</div>
      <div ref="watermarkRef" class="watermark-preview"></div>
    </div>

    <!-- 按钮操作 -->
    <div class="button-container">
      <el-button @click="clearWatermark">清除水印</el-button>
      <el-button type="primary" @click="applyWatermark">应用</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, nextTick } from "vue"
import { IconButton } from "@/components"
import { Editor } from "@tiptap/vue-3"

const watermarkForm = reactive({
  // 文本内容
  text: "",
  // 水印方向
  direction: "45",
  // 水印尺寸
  size: 20,
  // 不透明度
  transparency: 10,
  color: "#000",
  spacing: 40,
  // 水印类型
  typeofWatermark: "word",
  date: "",
  visitorName: "访客",
  watermarkStyle: "middle"
})

const watermarkRef = ref()

const ruleFormRef = ref()

// 预览区域的画布
const canvasPreview = document.createElement("canvas")

// 编辑器区域的画布
const canvasEditor = document.createElement("canvas")

const props = defineProps<{
  isWatermarkCollapse: boolean
  editor: Editor | undefined
}>()

const emits = defineEmits(["update:isWatermarkCollapse"])

const rules = reactive({
  text: [{ required: true, message: "请输入文本内容", trigger: "blur" }],
  date: [{ required: true, message: "请选择日期", trigger: "change" }]
})

// 监听表单
watch(
  () => watermarkForm,
  val => {
    drawWatermark(val)
  },
  { deep: true }
)

// 关闭水印
function closeWatermarkList() {
  emits("update:isWatermarkCollapse", false)
}

// 设置canvas的基础配置
function setCanvasOption(canvas: HTMLCanvasElement, type: "preview" | "set", watermarkForm) {
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
  let drawString = ""
  if (watermarkForm.typeofWatermark === "date") {
    drawString = watermarkForm.date
  } else if (watermarkForm.typeofWatermark === "visitor") {
    drawString = watermarkForm.visitorName
  } else {
    drawString = watermarkForm.text
  }
  // 获取绘制文本的尺寸
  const textSize = getTextActualSize(drawString)
  // 设置画布的大小
  let spacing = 0
  if (watermarkForm.watermarkStyle === "middle") {
    // 居中显示
    spacing = 0
  } else {
    // 铺满
    spacing = watermarkForm.spacing
  }
  if (type === "preview") {
    canvas.width = (textSize.width * 4 + 20 + spacing) / 2
    canvas.height = (textSize.width * 4 + 20 + spacing) / 2
    // 设置画笔属性
    ctx.font = `${watermarkForm.size / 2}px serif`
  } else {
    canvas.width = textSize.width * 4 + 20 + spacing
    canvas.height = textSize.width * 4 + 20 + spacing
    // 设置画笔属性
    ctx.font = `${watermarkForm.size}px serif`
  }
  ctx.fillStyle = watermarkForm.color
  // 透明度
  ctx.globalAlpha = watermarkForm.transparency / 10
  // 平移画布后，左上角不再是0，0, 而是（-canvas.width / 2， -canvas.height / 2）
  ctx.translate(canvas.width / 2, canvas.height / 2)
  // 旋转水印方向
  ctx.rotate((-watermarkForm.direction / 180) * Math.PI)
  // 文字宽度
  const stringWidth = ctx.measureText(drawString).width
  // 绘制之前清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  return { ctx, stringWidth, drawString }
}

// 绘制预览区域的水印
function drawWatermark(watermarkForm) {
  const { ctx, stringWidth, drawString } = setCanvasOption(canvasPreview, "preview", watermarkForm)
  if (watermarkForm.watermarkStyle === "middle") {
    ctx.fillText(drawString, -stringWidth / 2, watermarkForm.size / 4)
    setbackgroundImage(canvasPreview, watermarkRef.value, "no-repeat", "center")
  } else {
    ctx.fillText(drawString, -stringWidth / 2, watermarkForm.size / 4)
    setbackgroundImage(canvasPreview, watermarkRef.value, "repeat", "top left")
  }
}

// 给元素设置背景图
function setbackgroundImage(
  canvas: HTMLCanvasElement,
  element: HTMLElement,
  isRepeat: "repeat" | "no-repeat",
  position: "center" | "top left"
) {
  const dataURL = canvas.toDataURL()
  nextTick(() => {
    element.style.backgroundImage = `url(${dataURL})`
    element.style.backgroundRepeat = isRepeat
    element.style.backgroundPosition = `${position}`
  })
}

// 获取文本的实际宽高
function getTextActualSize(text) {
  const canvas = document.createElement("canvas")
  canvas.width = 400
  canvas.height = 400
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
  const { actualBoundingBoxAscent, actualBoundingBoxDescent, actualBoundingBoxLeft, actualBoundingBoxRight } =
    ctx.measureText(text)
  return {
    width: actualBoundingBoxLeft + actualBoundingBoxRight,
    height: actualBoundingBoxAscent + actualBoundingBoxDescent
  }
}

// 保存水印时，编辑器区域渲染的画布
function applyWatermark() {
  if (!ruleFormRef.value) return
  ruleFormRef.value.validate(valid => {
    if (valid) {
      const editorDom = props.editor?.view.dom as HTMLDivElement
      const { ctx, stringWidth, drawString } = setCanvasOption(canvasEditor, "set", watermarkForm)
      if (watermarkForm.watermarkStyle === "middle") {
        ctx.fillText(drawString, -stringWidth / 2, watermarkForm.size / 4)
        setbackgroundImage(canvasEditor, editorDom, "no-repeat", "center")
      } else {
        ctx.fillText(drawString, -stringWidth / 2, watermarkForm.size / 4)
        setbackgroundImage(canvasEditor, editorDom, "repeat", "top left")
      }
    } else {
      return false
    }
  })
}

// 清除水印
function clearWatermark() {
  watermarkForm.text = ""
  watermarkForm.date = ""
  const editorDom = props.editor?.view.dom as HTMLDivElement
  editorDom.style.background = "" // 清空编辑器元素的背景
}
</script>

<style lang="less" scoped>
.watermark-list-root {
  width: 360px;
  height: 100%;
  background: #fff;
  font-size: 14px;
  overflow-y: auto;
  .watermark-title {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    margin-left: 10px;
    font-size: 16px;
  }
  .watermark-setup {
    padding: 12px;
    :deep(.el-form) {
      .el-form-item {
        align-items: center;
        .el-input {
          width: 220px;
        }
        .el-slider {
          width: 210px;
          margin-left: 12px;
        }
        .el-color-picker {
          .el-color-picker__trigger {
            padding: 0;
            .el-color-picker__icon {
              visibility: hidden;
            }
          }
        }
      }
    }
    .direction-container {
      width: 220px;
      display: flex;
      justify-content: space-between;
      .direction-item {
        width: 45px;
        height: 45px;
        border-radius: 4px;
        border: 1px solid #ebedf0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .direction-45 {
          transform: rotate(-45deg);
        }
        .direction-90 {
          transform: rotate(-90deg);
        }
      }
      .active {
        border: 1px solid #2c68ff;
      }
    }
  }
  .canvas-contain {
    margin-top: 20px;
    margin-left: 22px;
    font-size: 16px;
    display: flex;
    .watermark-preview {
      width: 150px;
      height: 200px;
      border: 1px solid #eee;
      margin-left: 30px;
    }
  }
  .button-container {
    margin: 50px 20px 10px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
