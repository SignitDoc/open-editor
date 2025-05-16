<template>
  <el-tooltip :content="desc" placement="top-start" effect="dark" :show-after="300">
    <i
      @click="handleClick"
      :disabled="disabled"
      :class="{ [icon]: true, 'is-active': props.type === 'style' && isActive, 'is-disabled': disabled }"
    ></i>
  </el-tooltip>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    type: "style" | "action"
    desc: string
    disabled?: boolean
    icon: string
    active?: boolean | undefined
  }>(),
  {
    disabled: false,
    active: undefined
  }
)

const isActive = computed(() => {
  // type为action时可能存在active属性；参考pdf编辑的添加文字等操作
  if (props.type === "action") {
    return props.active === false ? false : true
  } else return props.active ? true : false
})

const emits = defineEmits(["click"])

function handleClick() {
  if (!props.disabled) emits("click")
}
</script>

<style lang="less" scoped>
i {
  color: #222;
  padding: 2px;
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}
.is-active {
  background: rgba(0, 0, 0, 0.1);
}

.is-disabled {
  cursor: not-allowed;
  color: #aaa;
}
</style>
