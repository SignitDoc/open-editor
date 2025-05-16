<template>
  <div class="color-container" :class="{ isDark: isDark }">
    <div class="color-list">
      <span
        class="color-item"
        v-for="item in colorsCard"
        :style="{ backgroundColor: item }"
        :class="{ 'ri-mist-line': item === 'transparent' }"
        :key="item"
        @click="clickColorItem(item)"
      ></span>
    </div>
    <div class="more-color">
      <span>更多颜色</span>
      <el-color-picker
        show-alpha
        v-model="selectColor"
        @change="changeColor"
      ></el-color-picker>
    </div>
  </div>
</template>

<script setup lang="ts">
import { colorsCard } from '../constant'

import { ref,onMounted,watch } from 'vue'
const props=defineProps<{
  color:string
}>()

const selectColor=ref('')

onMounted(()=>{
  selectColor.value=props.color
})
watch(()=>props.color,(val)=>{
  selectColor.value=val
},{
  immediate:true
})

const isDark=ref(false)

const emits=defineEmits(['changeColor'])

//点击颜色切换
const clickColorItem=(color:string)=>{
  selectColor.value=color
  emits('changeColor',color)
}

//点击色卡切换
const changeColor=()=>{
  emits('changeColor',selectColor.value)
}
</script>

<style lang="less" scoped>
.color-container {
  &.isDark {
    .more-color {
      color: hsla(0, 0%, 100%, 0.6);
    }
  }
}

.color-list {
  display: flex;
  flex-wrap: wrap;

  .color-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 15px;
    height: 15px;
    margin-right: 5px;
    margin-bottom: 5px;
    cursor: pointer;
  }
}

.more-color {
  display: flex;
  align-items: center;

  span {
    margin-right: 5px;
  }
}
</style>
