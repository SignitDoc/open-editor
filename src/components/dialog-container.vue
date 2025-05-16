<template>
  <el-dialog
    v-model="dialogContainerVisible"
    class="dialog-container"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="props.destroyOnClose"
    :show-close="props.showClose"
    :style="{ width: props.width + 'px' }"
    align-center
    :append-to-body="true"
    @close="handleClose()"
  >
    <template #header>
      <span class="dialog-header">{{ props.title }}</span>
    </template>
    <slot></slot>
    <template #footer v-if="!props.noFooter">
      <slot name="footer">
        <span class="dialog-footer">
          <el-button @click="handleCancel()">取消</el-button>
          <el-button
            type="primary"
            style="margin-left: 16px"
            :loading="props.confirmLoading"
            @click="props.confirmCallback()"
          >
            确定
          </el-button>
        </span>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { noop } from "lodash-es"

const props = defineProps({
  visible: { type: Boolean, required: true },
  title: { type: String, required: true },
  width: { type: Number, default: 400 },
  confirmCallback: { type: Function, default: noop },
  cancelCallback: { type: Function, default: noop },
  closeCallback: { type: Function, default: noop },
  showClose: { type: Boolean, default: true },
  destroyOnClose: { type: Boolean, default: true },
  noFooter: { type: Boolean, default: false },
  confirmLoading: { type: Boolean, default: false }
})

const emits = defineEmits(["update:visible"])

const dialogContainerVisible = computed({
  get: () => props.visible,
  set: val => emits("update:visible", val)
})

function handleCancel() {
  if (props.cancelCallback === noop) emits("update:visible", false)
  else props.cancelCallback()
}

function handleClose() {
  if (props.closeCallback === noop) emits("update:visible", false)
  else props.closeCallback()
}
</script>

<style lang="less">
.dialog-container {
  border-radius: 6px;
  --el-dialog-padding-primary: 24px;

  .el-dialog__header {
    margin-right: 0;
    font-size: 16px;
    text-align: left;
    font-weight: bold;
    .el-dialog__headerbtn {
      top: 10px;
      right: 8px;
    }
  }
  .el-dialog__body {
    .el-form-item:last-child {
      margin-bottom: 0;
    }
    .el-select {
      width: 100%;
    }
  }
  .el-dialog__footer {
  }
}
</style>
