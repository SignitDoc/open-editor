<template>
  <div
    class="sidebar-container"
    @click.stop
    :class="{ show: show, isDark: isDark }"
    :style="{ zIndex: zIndex }"
  >
    <i class="close-button ri-close-line" @click="close"></i>
    <div class="sidebar-header" v-if="props.title">
      {{ props.title }}
    </div>
    <div class="sidebar-content" ref="sidebarContentRef">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref,watch } from 'vue'
import {useMindMapStore} from '../config'

const mindMapStore=useMindMapStore()
const props=defineProps<{
  title:string
}>()

const isDark=ref(false)
const show=ref(false)
const zIndex=ref(0)

const sidebarContentRef=ref<HTMLElement|null>(null)
watch(()=>show.value,(val,oldVal)=>{
  if(val&&!oldVal){
    zIndex.value=mindMapStore.sidebarZIndex++
  }
}) 

const close=()=>{
  show.value=false
  mindMapStore.setActiveSidebar('')
}

const getEl=()=>{
  return sidebarContentRef.value
}

const handleCloseSidebar=()=>{
  close()
}

defineExpose({
  show,
  close,
  getEl
})

</script>

<style lang="less" scoped>
.sidebar-container {
  position: fixed;
  right: -300px;
  top: 110px;
  bottom: 0;
  width: 300px;
  background-color: #fff;
  border-left: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;

  &.isDark {
    background-color: #262a2e;
    border-left-color: hsla(0, 0%, 100%, 0.1);

    .sidebar-header {
      border-bottom-color: hsla(0, 0%, 100%, 0.1);
      color: #fff;
    }

    .close-button {
      color: #fff;
    }
  }

  &.show {
    right: 0;
  }

  .close-button {
    position: absolute;
    right: 20px;
    top: 12px;
    font-size: 20px;
    cursor: pointer;
  }

  .sidebar-header {
    width: 100%;
    height: 44px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .sidebar-content {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
</style>
