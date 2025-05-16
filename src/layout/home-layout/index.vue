<template>
  <el-container class="home-root">
    <el-header class="home-header">
      <div style="display: flex; align-items: center; height: 100%">
        <img src="@/assets/wesign-logo-new.svg" style="height: 32px; margin-left: 20px" />
        <el-divider direction="vertical" border-style="solid" style="height: 21px; border-color: #d3d5d9" />
        <div style="font-size: 21px; color: #646464; cursor: default; line-height: 1">
          智能文档
        </div>
      </div>

      <div style="display: flex; align-items: center; height: 100%">
        <UserCard />
      </div>
    </el-header>

    <el-main class="home-main">
      <RouterView />
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { UserCard } from "@/page-components"

</script>

<style lang="less" scoped>
.home-root {
  width: 100%;
  height: 100%;
  .home-header {
    position: relative;
    z-index: 2001;
    height: 60px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.05);
    padding: 0px 24px;

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
  .home-main {
    padding: 0px;
    display: flex;
    flex-direction: column;
    background: #fff;
    .tabs-container {
      border-bottom: 1px solid #c8c8c833;
      :deep(.custom-tabs-header) {
        a {
          padding: 14px;
        }
      }
    }
  }
  .home-container {
    display: flex;
    justify-content: center;
    flex: 1;
    min-height: 0px;
    width: 100%;
    .home-left-container {
      width: 300px;
      height: 100%;
      background: #fff;
      border-right: 1px solid #dcdcdc;
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .folder-tree {
        flex: 1;
        min-height: 0px;
        overflow: auto;
        --el-tree-node-content-height: 32px;
        .folder-item {
          display: flex;
          align-items: center;
        }
      }
    }

    .home-center-container {
      flex: 1;
      min-width: 0px;
      background: #fff;
      display: flex;
      flex-direction: column;
      min-height: 500px;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      border-radius: 4px;
    }

    .home-right-container {
      width: 300px;
      height: 100%;
      background: #fff;
      border-left: 1px solid #dcdcdc;
    }
  }
}
</style>
