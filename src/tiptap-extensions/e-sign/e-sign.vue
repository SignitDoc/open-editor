<template>
  <node-view-wrapper>
    <div class="content" data-drag-handle>
      <span v-if="!globalStore.electronicSignatureImage" @click="globalStore.$patch({ electronicSignatureVisible: true })">点击签名</span>
      <div v-else class="image-container">
        <img :src="globalStore.electronicSignatureImage" />
        <div @click="globalStore.$patch({ electronicSignatureImage: '' })" class="clear-sign">清除签名</div>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script lang="ts" setup>
import { NodeViewWrapper } from "@tiptap/vue-3"
import { useGlobalStore } from "@/store"

const globalStore = useGlobalStore()

defineProps(["updateAttributes", "node"])
</script>

<style lang="less">
.content {
  height: 200px;
  background: #6464641A;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #409eff;
  margin: 12px 0;
  span {
    cursor: pointer;
  }
  .image-container {
    img {
      background: white;
      width: 200px;
      height: 100px;
    }
    .clear-sign {
      cursor: pointer;
      text-align: center;
      margin-top: 10px;
    }
  }
}
</style>
