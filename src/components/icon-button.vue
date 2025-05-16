<template>
  <el-tooltip :content="$props.label" :placement="$props.placement">
    <el-button
      :icon="h('i', { class: $props.icon, style: { 'font-size': $props.size } })"
      link
      :disabled="$props.disabled"
      @click="$emit('click')"
    />
  </el-tooltip>
</template>

<script setup lang="ts">
import { h } from "vue"
import type { Placement } from "element-plus"

withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    icon: string
    size?: string
    placement?: Placement
  }>(),
  {
    label: "",
    disabled: false,
    size: "14px",
    placement: "top"
  }
)

defineEmits(["click"])
</script>

<style lang="less" scoped>
.el-button {
  :deep(i) {
    width: fit-content;
    height: fit-content;
    line-height: 1;
  }
}
</style>
