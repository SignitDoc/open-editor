<template>
  <el-dropdown-item>
    <el-button text class="dropdown-btn" @click="$emit('click')" :disabled="disabled">
      <i :class="icon"></i>
      <slot></slot>
    </el-button>
  </el-dropdown-item>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ disabled: boolean; icon: string }>(), {
  disabled: false
})

defineEmits(["click"])
</script>

<style lang="less">
.dropdown-btn:hover {
  background-color: inherit !important;
}
.dropdown-btn:active {
  background-color: inherit !important;
}
</style>
