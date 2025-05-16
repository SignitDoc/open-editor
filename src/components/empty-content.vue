<template>
  <div class="empty-content">
    <img src="@/assets/page-status/empty.png" :style="{ width: $props.width + 'px' }" />
    <span class="empty-desc">{{ $props.desc }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  desc: { type: String, default: "暂无数据" },
  width: { type: Number, default: 150 }
})
</script>

<style lang="less" scoped>
.empty-content {
  display: flex;
  justify-content: center;
  height: 100%;
  margin: 0 auto;
  text-align: center;
  flex-direction: column;
  img {
    opacity: 0.7;
    margin: 0 auto;
  }
  .empty-desc {
    font-size: 14px;
    color: #aaa;
  }
}
</style>
