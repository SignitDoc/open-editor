<template>
  <div class="main-header">
    <section class="main-header-group">
      <i class="ri-home-2-fill back-home" @click="$router.push('/home')"></i>
      <div v-if="docState?.updateTime" class="update-time">
        {{ `最近更新：${new Date(Number(docState?.updateTime)).toLocaleString()}` }}
      </div>
    </section>

    <!-- 标题 -->
    <div class="title-wrapper">
      <span class="cal-title" id="cal-title" :style="{ opacity: props.edit ? 0 : 1 }">{{ docState.title }}</span>
      <input
        v-if="$props.edit"
        type="text"
        class="title"
        :value="docState.title"
        :style="{ width: `${titleWidth}px` }"
        @input="titleInput"
        @change="
          () => {
            emits('update:doc', docState)
          }
        "
      />
    </div>

    <section class="main-header-group" style="justify-content: flex-end">
      <!-- 头部操作列表 -->
      <div class="header-action">
        <slot name="headerAction"></slot>
        <el-button
          v-if="$props.edit && props.showSave"
          :loading="saveLoading"
          type="primary"
          plain
          :icon="h('i', { class: 'ri-save-3-line' })"
          @click="save"
        >
          暂存
        </el-button>
      </div>

      <el-popover
        v-if="props.showMoreActions"
        popper-class="header-popover-menu"
        trigger="hover"
        placement="bottom-start"
        :teleported="false"
      >
        <template #reference>
          <i class="ri-menu-line container-menu"></i>
        </template>
        <div class="popover-button-group">
          <slot name="dropdown"></slot>
        </div>
      </el-popover>

      <UserCard />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref, nextTick, h } from "vue"

import { UserCard } from "@/page-components"
import { DocumentItem } from "@/types"

interface PropsType {
  doc: DocumentItem
  save?: () => any
  saveLoading?: boolean
  edit?: boolean
  showSave?: boolean
  showMoreActions?: boolean
}

const props = withDefaults(defineProps<PropsType>(), {
  saveLoading: false,
  edit: false,
  showMoreActions: false,
  showSave: true
})

const docState = computed({
  get: () => props.doc,
  set: val => emits("update:doc", val)
})
const emits = defineEmits(["update:doc"])

/* =========================文档标题========================*/
const titleWidth = ref(0)

watch(
  () => docState.value.title,
  () => {
    nextTick(() => {
      if (docState.value.title) calWidth()
    })
  },
  { immediate: true }
)

// 标题输入时改变长度
function titleInput(e: Event) {
  const target = e.target as HTMLInputElement
  const value = target.value
  docState.value.title = value
}

// 用隐藏的dom来获取当前input的长度
// 注意先调用该函数同步了titleState的width值以后再同步titleState里的title值，否则width获取的是上一次的值
function calWidth() {
  const dom = document.getElementById("cal-title") as HTMLElement
  dom.innerText = docState.value.title
  titleWidth.value = dom.clientWidth
}
</script>

<style lang="less" scoped>
.main-header {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #ddd;

  .main-header-group {
    height: 100%;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    width: 305px;
  }

  .back-home {
    margin: 0px 10px 1px 20px;
    cursor: pointer;
  }

  .update-time {
    white-space: nowrap;
    font-size: 12px;
    flex-shrink: 0;
    color: #888;
  }
  .container-menu {
    cursor: pointer;
    font-size: 18px;
    margin-right: 10px;
  }

  .title-wrapper {
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    .cal-title {
      position: absolute;
      z-index: 1;
      font-size: 20px;
      width: fit-content;
      line-height: 1;
      padding: 5px;
      max-width: calc(100% - 10px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .title,
    .title-preview {
      position: absolute;
      z-index: 2;
      line-height: 1;
      padding: 5px;
      border: none;
      background: none;
      outline: none;
      border-radius: 4px;
      font-size: 20px;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .title:hover,
    .title:focus,
    .title:active,
    .title:focus-visible {
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
  }

  .header-action {
    display: flex;
    margin-right: 20px;
    align-items: center;
    .editable-switch {
      margin-right: 12px;
    }
  }
  :deep(.el-popper) {
    padding: 0px !important;
    min-width: 0px;
    width: auto !important;
    .action-item {
      padding: 8px 16px;
      cursor: pointer;
      white-space: nowrap;
      &:hover {
        background: rgba(0, 0, 0, 0.02);
      }
    }
  }
}

.share-container {
  .share-hint {
    text-align: center;
  }
  .share-url {
    text-align: center;
    margin-top: 10px;
    font-weight: 600;
  }
}

:deep(.header-popover-menu) {
  padding: 5px 0px !important;
  width: fit-content !important;
  min-width: 0px !important;
  .popover-button-group {
    width: 180px;
    display: flex;
    flex-direction: column;
    background-color: white;
  }
}
</style>
