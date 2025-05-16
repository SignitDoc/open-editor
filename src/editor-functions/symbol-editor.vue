<template>
  <el-popover width="200px" placement="bottom-start" :visible="forceHide ? false : undefined">
    <div class="symbol-list">
      <div class="symbol-item" v-for="symbol in symbols" :key="symbol">
        <code @click="() => insertSymbol(symbol)">{{ symbol }}</code>
      </div>
    </div>
    <template v-slot:reference>
      <div @mouseover="forceHide = false"><i class="ri-omega"></i><span style="margin-left: 8px">特殊符号</span></div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { ref } from "vue"

const symbols = [
  "￥",
  "@",
  "#",
  "&",
  "*",
  "_",
  "$",
  "+",
  "-",
  "=",
  "|",
  ";",
  ":",
  '"',
  "'",
  "<",
  ">",
  "/",
  "?",
  "~",
  "`",
  "!",
  "%",
  "^"
]
const props = defineProps({
  insertContent: { type: Function, required: true }
})

// 是否强制隐藏符号选择面板
const forceHide = ref(true)

function insertSymbol(value: string) {
  props.insertContent(value)
  forceHide.value = true
}
</script>

<style lang="less" scoped>
.symbol-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  column-gap: 20px;
  .symbol-item {
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}
</style>
