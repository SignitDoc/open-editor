<template>
  <el-container class="none-root">
    <el-header class="none-header">
      <i class="ri-home-2-fill back-home" @click="$router.push('/home')"></i>
    </el-header>
    <el-main class="none-container">
      <el-result title="您当前访问的文档不存在" sub-title="当前访问的文件已被拥有者删除，无法访问！">
        <template #icon>
          <img :src="emptyImage" />
        </template>
      </el-result>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import emptyImage from "@/assets/page-status/404.png"
</script>

<style lang="less" scoped>
.none-root {
  width: 100%;
  height: 100%;

  .none-header {
    height: 50px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0px 10px;
      &:hover {
        background: rgba(0, 0, 0, 0.02);
      }

      span {
        margin-left: 5px;
        white-space: nowrap;
        max-width: 60px;
        overflow-x: hidden;
        text-overflow: ellipsis;
      }
      .user-avatar {
        width: 36px;
        height: 36px;
        object-fit: cover;
        border-radius: 50%;
        flex-shrink: 0;
      }
    }
    :deep(.el-popper) {
      padding: 0px !important;
      min-width: 0px;
      width: auto !important;
      .action-item {
        padding: 8px 16px;
        cursor: pointer;
        white-space: nowrap;
        &:hover {
          background: rgba(0, 0, 0, 0.02);
        }
      }
    }
  }
  .none-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-top: 1px solid #dcdcdc;
  }
}
</style>
