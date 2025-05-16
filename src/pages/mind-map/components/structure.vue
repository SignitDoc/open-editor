<template>
  <Sidebar ref="sidebarRef" title="结构">
    <div class="layout-list" :class="{ isDark: isDark }">
      <div
        class="layout-item"
        v-for="item in layoutOptions"
        :key="item.value"
        @click="useLayout(item)"
        :class="{ active: item.value === layout }"
      >
        <div class="img-content">
          <img :src="layoutImgMap[item.value]" alt="" />
        </div>
        <div class="name">{{ item.name }}</div>
      </div>
    </div>
  </Sidebar>
</template>

<script setup lang="ts">
import Sidebar from "./sidebar.vue"
import { useMindMapStore } from "../config"
import { ref, computed, watch } from "vue"
import {layoutOptions,layoutImgMap} from '../constant'

const sidebarRef = ref<InstanceType<typeof Sidebar> | null>(null)

const layout = ref("")

const isDark = ref(false)

const mindMapStore = useMindMapStore()

const activeSidebar = computed(() => mindMapStore.activeSidebar)

watch(
  () => activeSidebar.value,
  val => {
    if(!sidebarRef.value){
      return
    }
    if (val === "structure") {
      layout.value = mindMapStore.mindMap?.getLayout()
      sidebarRef.value.show = true
    } else {
      sidebarRef.value.show = false
    }
  },{
    immediate: true
  }
)

const useLayout = (layoutValue:Record<string,any>) => {
  layout.value = layoutValue.value
  mindMapStore.mindMap.setLayout(layout.value)
}
</script>

<style lang="less" scoped>
.layout-list {
  padding: 20px;

  &.isDark {
    .name {
      color: #fff;
    }
  }

  .layout-item {
    width: 100%;
    cursor: pointer;
    border-bottom: 1px solid #e9e9e9;
    margin-bottom: 20px;
    padding-bottom: 20px;
    transition: all 0.2s;
    border: 1px solid transparent;

    &:last-of-type {
      border: none;
    }

    &:hover {
      box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12),
        0 5px 12px 4px rgba(0, 0, 0, 0.09);
    }

    &.active {
      border: 1px solid #67c23a;
    }

    .img-content {
      width: 100%;

      img {
        width: 100%;
      }
    }
    .name {
      text-align: center;
      font-size: 14px;
    }
  }
}
</style>
