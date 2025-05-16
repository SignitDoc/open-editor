<template>
  <el-button plain text :loading="$props.loading" :disabled="$props.disabled">
    <div class="context-menu-item-icon">
      <slot name="icon"></slot>
    </div>
    <div class="context-menu-item-name">
      <slot></slot>
    </div>
    <div class="context-menu-item-shortcut">
      <slot name="shortcut"></slot>
    </div>
  </el-button>
</template>

<script setup lang="ts">
defineProps({
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})
</script>

<style lang="less" scoped>
.el-button {
  margin-left: 0px;
  padding: 10px 16px;
  line-height: 1;
  height: fit-content;
  :deep(span) {
    display: flex;
    width: 100%;
    .context-menu-item-icon {
      i {
        margin-right: 5px;
      }
    }
    .context-menu-item-name {
      flex: 1;
      text-align: left;
    }
  }
  &:not(.is-disabled) {
    :deep(span) {
      .context-menu-item-icon {
        width: fit-content;
        font-size: 14px;
        line-height: 1;
        color: #333;
      }
      .context-menu-item-name {
        color: #333;
      }
      .context-menu-item-shortcut {
        color: #aaa;
        margin-left: 10px;
      }
    }
  }
}
</style>
