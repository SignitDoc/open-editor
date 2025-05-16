<template>
  <div style="height: 100%">
    <div class="user-info">
      <img class="user-avatar" :src="defaultAvatar" />
      <span>易企签用户</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import defaultAvatar from "@/assets/default-avatar.png"
</script>

<style lang="less" scoped>
:deep(.el-popover) {
  padding: 0px;
  width: fit-content !important;
  min-width: 0px;
}
.user-info {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0px 10px;

  span {
    cursor: default;
    margin-left: 12px;
  }
  .user-avatar {
    width: 36px;
    height: 36px;
    object-fit: cover;
    border-radius: 50%;
    flex-shrink: 0;
  }
}
</style>
