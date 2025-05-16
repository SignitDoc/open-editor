<template>
  <DialogContainer
    title="电子签名"
    v-model:visible="globalStore.electronicSignatureVisible"
    :width="800"
    :no-footer="true"
  >
    <div class="box-container">
      <div class="operation-container">
        <div class="brush-item">
          <div>画笔粗细</div>
          <el-select v-model="lineWidth" size="small">
            <el-option :label="item" :value="item" :key="index" v-for="(item, index) in 10"></el-option>
          </el-select>
        </div>
        <div class="brush-item">
          <div>画笔颜色</div>
          <el-color-picker v-model="lineColor"></el-color-picker>
        </div>
      </div>
      <Vue3Esign
        ref="electronicSignatureRef"
        :width="800"
        :height="400"
        :isCrop="false"
        :lineWidth="lineWidth"
        :lineColor="lineColor"
        :isClearBgColor="false"
        v-model:bgColor="bgColor"
      />
      <div class="button-container">
        <el-button @click="handleReset">清空画板</el-button>
        <el-button type="primary" @click="handleGenerate">生成签名</el-button>
        <el-button @click="globalStore.$patch({ electronicSignatureVisible: false })">取消</el-button>
      </div>
    </div>
  </DialogContainer>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Vue3Esign } from "vue3-esign"
import { DialogContainer } from "@/components"
import { useGlobalStore } from "@/store"
import { ElMessage } from "element-plus"

const globalStore = useGlobalStore()

const electronicSignatureRef = ref()
// 画笔粗细
const lineWidth = ref(4)
// 画笔颜色
const lineColor = ref("#000000")
// 画板背景色
const bgColor = ref("#6464641A")
// 生成的签名图
const resultImg = ref("")

// 清空画板
function handleReset() {
  electronicSignatureRef.value.reset()
}

// 生成图片
function handleGenerate() {
  electronicSignatureRef.value
    .generate()
    .then(res => {
      resultImg.value = res
      globalStore.$patch({ electronicSignatureVisible: false })
      globalStore.$patch({ electronicSignatureImage: resultImg.value })
    })
    .catch(() => {
      ElMessage.error("生成签名失败")
    })
}
</script>

<style lang="less" scoped>
.box-container {
  border-radius: 3px;
  .operation-container {
    display: flex;
    .brush-item {
      margin: -20px 15px 20px 0;
      display: flex;
      align-items: center;
      div {
        width: 60px;
        padding-right: 8px;
      }
    }
  }
  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}
</style>
