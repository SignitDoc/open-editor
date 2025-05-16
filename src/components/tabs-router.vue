<!-- 根据路由切换页面的标签页组件 -->
<template>
  <div class="tabs-router-root">
    <slot name="title">
      <div v-if="props.title" class="tabs-title">{{ props.title }}</div>
    </slot>
    <div
      class="custom-tabs-header"
      :style="{
        justifyContent:
          props.position === 'left' ? 'flex-start' : props.position === 'right' ? 'flex-end' : props.position,
        borderBottom: props.divider ? '1px solid rgba(0, 0, 0, 0.1)' : 'none'
      }"
    >
      <RouterLink v-for="item in props.tabsConfig" :key="item.path" :to="item.path">{{ item.label }}</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
type TabConfigItem = { label: string; path: string }
// type: card-独立盒子样式 page-普通样式
type PropsType = {
  tabsConfig: Array<TabConfigItem>
  title?: string
  type?: "card" | "page"
  position?: "center" | "left" | "right"
  divider?: boolean
}

const props = withDefaults(defineProps<PropsType>(), {
  title: "",
  type: "page",
  position: "center",
  divider: false
})
</script>

<style lang="less" scoped>
.tabs-router-root {
  padding: 0 20px;

  .tabs-title {
    padding-top: 20px;
    font-weight: bold;
  }

  .custom-tabs-header {
    font-size: 14px;
    display: flex;
    justify-content: center;

    a {
      padding: 12px 0;
      box-sizing: border-box;
      margin-right: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: fit-content;
      text-decoration: none;
      color: #81878e;

      &:hover {
        color: #0c7ffc;
      }

      &:last-child {
        margin-right: 0px;
      }
    }

    .router-link-active {
      position: relative;
      font-weight: bold;
      color: #333;
      cursor: default;

      &:hover {
        color: #333;
      }

      &::after {
        content: "";
        display: block;
        position: absolute;
        top: 96%;
        left: calc(50% - 18px);
        width: 36px;
        height: 3px;
        background: #0c7ffc;
        border-radius: 2px;
      }
    }
  }
}
</style>
