<template>
<div>
  <div class="toolbarNodeBtnList" :class="[{ isDark: isDark }]">
    <template v-for="(item, index) in list" :key="index">
      <div
        v-if="item === 'back'"
        class="toolbar-button"
        :class="{
          disabled: readonly || mindMapStore.backEnd
        }"
        @click="execCommand('BACK')"
      >
        <i class="ri-arrow-go-back-line icon"></i>
        <span class="text">回退</span>
      </div>
      <div
        v-if="item === 'forward'"
        class="toolbar-button"
        :class="{
          disabled: readonly || mindMapStore.forwardEnd
        }"
        @click="execCommand('FORWARD')"
      >
        <i class="ri-arrow-go-forward-line icon"></i>
        <span class="text">前进</span>
      </div>
      <div
        v-if="item === 'siblingNode'"
        class="toolbar-button"
        :class="{
          disabled: activeNodes.length <= 0 || hasRoot || hasGeneralization
        }"
        @click="execCommand('INSERT_NODE')"
      >
        <i class="ri-git-commit-fill icon"></i> <span class="text">同级节点</span>
      </div>
      <div
        v-if="item === 'childNode'"
        class="toolbar-button"
        :class="{
          disabled: activeNodes.length <= 0 || hasGeneralization
        }"
        @click="execCommand('INSERT_CHILD_NODE')"
      >
        <i class="ri-organization-chart icon"></i> <span class="text">子节点</span>
      </div>
      <div
        v-if="item === 'deleteNode'"
        class="toolbar-button"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="execCommand('REMOVE_NODE')"
      >
        <i class="ri-delete-bin-6-line icon"></i> <span class="text">删除节点</span>
      </div>
      <div
        v-if="item === 'image'"
        class="toolbar-button"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="addImage"
      >
        <i class="ri-file-image-line icon"></i> <span class="text">图片</span>
      </div>
      <div
        v-if="item === 'icon'"
        class="toolbar-button"
        :class="{
          disabled: activeNodes.length <= 0
        }"
      >
        <i class="ri-remixicon-line icon"></i> <span class="text">图标</span>
      </div>
      <div
        v-if="item === 'link'"
        class="toolbar-button"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="addLink"
      >
        <i class="ri-links-line icon"></i> <span class="text">超链接</span>
      </div>
      <div
        v-if="item === 'tag'"
        class="toolbar-button"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="addTag"
      >
        <i class="ri-price-tag-2-line icon"></i> <span class="text">标签</span>
      </div>
      <div
        v-if="item === 'note'"
        class="toolbar-button"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="addNote"
      >
        <i class="ri-file-text-line icon"></i> <span class="text">备注</span>
      </div>
      <div
        v-if="item === 'summary'"
        class="toolbar-button"
        :class="{
          disabled: activeNodes.length <= 0 || hasRoot || hasGeneralization
        }"
        @click="execCommand('ADD_GENERALIZATION')"
      >
        <i class="ri-function-fill icon"></i> <span class="text">概要</span>
      </div>
      <div
        v-if="item === 'associativeLine'"
        class="toolbar-button"
        :class="{
          disabled: activeNodes.length <= 0 || hasGeneralization
        }"
        @click="addAssociativeLine"
      >
        <i class="ri-link-unlink-m icon"></i> <span class="text">关联线</span>
      </div>
    </template>
  </div>
  <!--  图片 -->
  <NodeImage v-model:visible="uploadImgVisible"/>
  <!-- 标签 -->
  <NodeTag v-model:visible="uploadTagVisible"/>
  <!-- 备注 -->
  <NodeNote v-model:visible="uploadNoteVisible"/>
  <!-- 超链接 -->
  <NodeLink v-model:visible="uploadLinkVisible"/>
  <!-- 图标 -->
   
</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useMindMapStore } from "../config"
import NodeImage from "./node-image.vue"
import NodeTag from "./node-tag.vue"
import NodeNote from "./node-note.vue"
import NodeLink from "./node-link.vue"

interface ToolbarNodeButtonListProps {
  list: string[]
}

const props = defineProps<ToolbarNodeButtonListProps>()
const mindMapStore = useMindMapStore()

const activeNodes = computed(() => {
  return mindMapStore.activeNodes
})

const mindMap = computed(() => {
  return mindMapStore.mindMap as any
})

const emits=defineEmits(['addAssociativeLine'])
const readonly = ref(false)
const isDark = ref(false)

// 是否是根节点---根节点不能添加兄弟节点
const hasRoot = computed(() => {
  return (
    activeNodes.value.findIndex((node: Record<string, any>) => {
      return node?.isRoot
    }) !== -1
  )
})

// 是否是概要节点---概要节点则子节点、兄弟节点、概要节点、关联线都不能添加
const hasGeneralization = computed(() => {
  return (
    activeNodes.value.findIndex((node: Record<string, any>) => {
      return node?.isGeneralization
    }) !== -1
  )
})

/*============================================节点操作============================================*/

// 执行命令
const execCommand = (key: string) => {
  if (!mindMap.value) return
  mindMap.value.execCommand(key)
}

/*============================================图片操作============================================*/
const uploadImgVisible = ref(false)
//添加图片
const addImage=()=>{
  uploadImgVisible.value=true
}

/*============================================标签操作============================================*/
const uploadTagVisible = ref(false)
//添加标签
const addTag=()=>{
  uploadTagVisible.value=true
}

/*============================================备注操作============================================*/
const uploadNoteVisible = ref(false)
//添加备注
const addNote=()=>{
  uploadNoteVisible.value=true
}

/*============================================超链接操作============================================*/
const uploadLinkVisible = ref(false)
//添加超链接
const addLink=()=>{
  uploadLinkVisible.value=true
}

/*============================================关联线操作============================================*/
const addAssociativeLine = () => {
  emits('addAssociativeLine')
}
</script>

<style lang="less">
.toolbarNodeBtnList {
  display: flex;

  &.isDark {
    .toolbar-button {
      color: hsla(0, 0%, 100%, 0.9);

      .icon {
        background: transparent;
        border-color: transparent;
      }

      &:hover {
        &:not(.disabled) {
          .icon {
            background: hsla(0, 0%, 100%, 0.05);
          }
        }
      }

      &.disabled {
        color: #54595f;
      }
    }
  }

  .toolbar-button {
    display: flex;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    margin-right: 20px;

    &:last-of-type {
      margin-right: 0;
    }

    &:hover {
      &:not(.disabled) {
        .icon {
          background: #f5f5f5;
        }
      }
    }

    &.active {
      .icon {
        background: #f5f5f5;
      }
    }

    &.disabled {
      color: #bcbcbc;
      cursor: not-allowed;
      pointer-events: none;
    }

    .icon {
      text-align: center;
    }

    .text {
    }
  }

  &.v {
    display: block;
    width: 120px;
    flex-wrap: wrap;

    .toolbar-button {
      flex-direction: row;
      justify-content: flex-start;
      margin-bottom: 10px;
      width: 100%;
      margin-right: 0;

      &:last-of-type {
        margin-bottom: 0;
      }

      .icon {
        margin-right: 10px;
      }

      .text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
