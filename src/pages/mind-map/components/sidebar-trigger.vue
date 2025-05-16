<template>
  <div
    class="sidebar-trigger-container"
    @click.stop
    :class="{ hasActive: show && mindMapStore.activeSidebar, show: show, isDark: isDark }"
  >
    <div class="toggle-show-button" :class="{hide: !show}" @click="show = !show">
      <i class="ri-arrow-right-s-line"></i>
    </div>
    <div class="trigger-list">
      <div
        class="trigger-item"
        v-for="item in sidebarTriggerList"
        :key="item.value"
        :class="{ active: mindMapStore.activeSidebar === item.value }"
        @click="handleTrigger(item)"
      >
        <div class="trigger-icon " >
          <i :class="item.icon"></i>
        </div>

        <div class="trigger-name">{{ item.name }}</div>
      </div>
    </div>
  </div>

</template>

<script setup lang='ts'>
import { sidebarTriggerList,useMindMapStore } from '../config'
import {ref} from 'vue'

const mindMapStore = useMindMapStore()
const isDark = ref(false)

const show = ref(true)

const handleTrigger=(item)=>{
  mindMapStore.setActiveSidebar(item.value)
}
</script>

<style lang="less" scoped>
.sidebar-trigger-container {
  position: fixed;
  right: -60px;
  margin-top: 110px;
  transition: all 0.3s;
  top: 50%;
  transform: translateY(-50%);

  &.isDark {
    .trigger-list {
      background-color: #262a2e;

      .trigger-item {
        color: hsla(0,0%,100%,.6);

        &:hover {
          background-color: hsla(0,0%,100%,.05);
        }
      }
    }
  }

  &.show {
    right: 0;
  }

  &.hasActive {
    right: 305px;
  }

  .toggle-show-button {
    position: absolute;
    left: -6px;
    width: 35px;
    height: 60px;
    background: #409eff;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    transition: left .1s linear;
    z-index: 0;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    display: flex;
    align-items: center;
    padding-left: 4px;

    &.hide {
      left: -8px;

      span {
        transform: rotateZ(180deg);
      }
    }

    &:hover {
      left: -18px;
    }

    i {
      color: #fff;
      transition: all 0.1s;
    }
  }

  .trigger-list {
    position: relative;
    width: 60px;
    border-color: #eee;
    background-color: #fff;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
    border-radius: 6px;
    overflow: hidden;

    .trigger-item {
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      color: #464646;
      user-select: none;
      white-space: nowrap;

      &:hover {
        background-color: #ededed;
      }

      &.active {
        color: #409eff;
        font-weight: bold;
      }

      .trigger-icon {
        font-size: 18px;
        margin-bottom: 5px;
      }

      .trigger-name {
        font-size: 13px;
      }
    }
  }
}
</style>
