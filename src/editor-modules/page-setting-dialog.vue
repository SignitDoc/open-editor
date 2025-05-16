<!-- 页面配置弹窗 -->
<template>
  <DialogContainer
    v-model:visible="visible"
    title="页面配置"
    :width="660"
    :confirm-loading="confirmLoading"
    :confirm-callback="handleSave"
  >
    <div class="page-setting-container">
      <!-- 表单设置 -->
      <el-form class="page-setting-form" label-width="70px">
        <el-form-item label="页面大小">
          <el-select v-model="pageMode">
            <el-option label="A3" value="A3" />
            <el-option label="A4" value="A4" />
          </el-select>
        </el-form-item>
        <el-form-item label="页面尺寸">
          <el-row :gutter="18">
            <el-col :span="12">
              <el-input :model-value="pageConfig[pageMode].height" type="number" disabled step="0.01">
                <template #prefix>高</template>
                <template #suffix>cm</template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-input :model-value="pageConfig[pageMode].width" type="number" disabled step="0.01">
                <template #prefix>宽</template>
                <template #suffix>cm</template>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="页边距">
          <el-row :gutter="18">
            <el-col :span="12">
              <el-input :model-value="pageConfig[pageMode].paddingLeft" type="number" disabled step="0.01">
                <template #prefix>左</template>
                <template #suffix>cm</template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-input :model-value="pageConfig[pageMode].paddingRight" type="number" disabled step="0.01">
                <template #prefix>右</template>
                <template #suffix>cm</template>
              </el-input>
            </el-col>
          </el-row>
          <el-row :gutter="18" style="margin-top: 18px">
            <el-col :span="12">
              <el-input :model-value="pageConfig[pageMode].paddingTop" type="number" disabled step="0.01">
                <template #prefix>上</template>
                <template #suffix>cm</template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-input :model-value="pageConfig[pageMode].paddingBottom" type="number" disabled step="0.01">
                <template #prefix>下</template>
                <template #suffix>cm</template>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <!-- 页面配置预览 -->
      <div class="page-preview-container">
        <canvas
          ref="canvasRef"
          :width="cmPreview * pageConfig[pageMode].width"
          :height="cmPreview * pageConfig[pageMode].height"
        ></canvas>
      </div>
    </div>
  </DialogContainer>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue"
import { DialogContainer } from "@/components"
import { pageConfig } from "@/configs/document-config"
import { useDocumentListStore, useDocumentStore } from "@/store"
import { PageModeType } from "@/types"

const documentStore = useDocumentStore()
const documentListStore = useDocumentListStore()

const props = defineProps({
  documentId: { type: String, required: true }
})

const pageMode = ref<PageModeType>("A4")
// 1cm在preview上所占的像素
const cmPreview = ref(0)
const canvasRef = ref()

watch(
  () => pageMode.value,
  val => {
    refreshCmPreview()
  }
)

// 刷新页面配置预览
function refreshCmPreview() {
  if (pageConfig[pageMode.value].width / pageConfig[pageMode.value].height >= 1) {
    cmPreview.value = 148 / pageConfig[pageMode.value].width
  } else cmPreview.value = 148 / pageConfig[pageMode.value].height

  nextTick(() => {
    refreshPreview()
  })
}

// 绘制预览页面
function refreshPreview() {
  const gl = canvasRef.value?.getContext("2d")
  const width = cmPreview.value * pageConfig[pageMode.value].width
  const height = cmPreview.value * pageConfig[pageMode.value].height
  const top = cmPreview.value * pageConfig[pageMode.value].paddingTop
  const bottom = cmPreview.value * pageConfig[pageMode.value].paddingBottom
  const left = cmPreview.value * pageConfig[pageMode.value].paddingLeft
  const right = cmPreview.value * pageConfig[pageMode.value].paddingRight

  gl.fillStyle = "#ffffff"
  gl.fillRect(0, 0, width, height)

  // 边距阴影矩形
  gl.fillStyle = "#f4f4f5"
  // 上边距
  gl.fillRect(0, 0, width, top)
  // 下边距
  gl.fillRect(0, height - bottom, width, height)
  // 左边距
  gl.fillRect(0, 0, left, height)
  // 右边距
  gl.fillRect(width - right, 0, width, height)

  gl.strokeStyle = "#fab6b6"
  // 上边距
  gl.beginPath()
  gl.moveTo(0, top)
  gl.lineTo(width, top)
  gl.stroke()

  // 下边距
  gl.beginPath()
  gl.moveTo(0, height - bottom)
  gl.lineTo(width, height - bottom)
  gl.stroke()

  // 左边距
  gl.beginPath()
  gl.moveTo(left, 0)
  gl.lineTo(left, height)
  gl.stroke()

  // 右边距
  gl.beginPath()
  gl.moveTo(width - right, 0)
  gl.lineTo(width - right, height)
  gl.stroke()
}

const visible = ref(false)
const confirmLoading = ref(false)

// 打开弹窗
function openDialog() {
  visible.value = true
  pageMode.value = documentStore.pageMode
  refreshCmPreview()
}

// 保存页面配置
function handleSave() {
  documentStore.$patch({ pageMode: pageMode.value })
  documentListStore.editAttrs(props.documentId, { pageMode: pageMode.value })
  visible.value = false
}

defineExpose({ openDialog })
</script>

<style lang="less" scoped>
.page-setting-container {
  display: flex;
  .page-setting-form {
    width: 400px;
    :deep(.el-input) {
      &.is-disabled {
        .el-input__prefix-inner,
        .el-input__inner,
        .el-input__suffix {
          cursor: default;
        }
      }
      .el-input__inner[type="number"] {
        text-align: right;
      }
    }
  }

  .page-preview-container {
    margin-left: 20px;
    width: 188px;
    height: 188px;
    background: #dedfe0;
    display: flex;
    align-items: center;
    justify-content: center;

    .page-review {
      position: relative;
      background: #fff;
    }
  }
}
</style>
