<template>
  <div class="side-toolbar-root">
    <div v-if="documentStore.editable" class="side-tool-bar-item" @click="openAnnotationList">
      <i class="ri-chat-2-line"></i>
      批注
    </div>

    <div v-if="documentStore.editable" class="side-tool-bar-item" @click="openContentLibrary">
      <i class="ri-book-2-line"></i>
      内容库
    </div>

    <div v-if="documentStore.editable" class="side-tool-bar-item" @click="openWatermarkList">
      <i class="ri-t-box-line"></i>
      水印
    </div>

    <div v-if="documentStore.editable" class="side-tool-bar-item" @click="openHistoryList">
      <i class="ri-history-line"></i>
      版本
    </div>

    <div v-if="!documentStore.editable" class="side-tool-bar-item">
      <SearchPopover :editor="editor" style="margin-left: 400px" :just-icon="false" />
    </div>
  </div>

  <!-- 历史记录 -->
  <div class="side-drawer-container" :style="{ width: isHistoryCollapse ? '360px' : '0px' }">
    <HistoryList
      ref="historyListRef"
      v-model:isHistoryCollapse="isHistoryCollapse"
      :editor="props.editor"
      :editorHeaderRef="editorHeaderRef"
      :now-doc="props.nowDoc"
    />
  </div>

  <!-- 内容库 -->
  <div class="side-drawer-container" :style="{ width: isContentLibrary ? '360px' : '0px' }">
    <ContentLibrary v-model:isContentLibrary="isContentLibrary" :editor="props.editor" />
  </div>

  <!-- 水印 -->
  <div class="side-drawer-container" :style="{ width: isWatermarkCollapse ? '360px' : '0px' }">
    <WatermarkList v-model:isWatermarkCollapse="isWatermarkCollapse" :editor="props.editor" />
  </div>

  <!-- 批注列表 -->
  <div class="side-drawer-container" :style="{ width: isAnnotationListCollapse ? '360px' : '0px' }">
    <AnnotationList
      v-model:isAnnotationListCollapse="isAnnotationListCollapse"
      ref="annotationListRef"
      :editor="props.editor"
      :now-doc="props.nowDoc"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"
import { Editor } from "@tiptap/vue-3"
import { DocumentItem } from "@/types"
import { HistoryList, ContentLibrary, WatermarkList, AnnotationList } from "@/editor-modules"
import useDocumentStore from "@/store/documentStore"
import { SearchPopover } from "@/editor-functions"

interface PropsType {
  editor: Editor | undefined
  nowDoc: DocumentItem
  editorHeaderRef: Record<string, any> | undefined
}

const props = withDefaults(defineProps<PropsType>(), {})

const documentStore = useDocumentStore()

// 历史记录展开状态
const isHistoryCollapse = ref(false)
// 内容库展开状态
const isContentLibrary = ref(false)
// 水印展开状态
const isWatermarkCollapse = ref(false)
// 批注列表展开状态
const isAnnotationListCollapse = ref(false)

// 批注滑动
const annotationListRef = ref()
function commentListener() {
  const commentsCollection = document.getElementsByClassName("comment-item")
  const comments = [...commentsCollection] as Array<HTMLElement>
  comments.forEach(comment => {
    comment.onclick = e => {
      const from = comment.getAttribute("from")
      const to = comment.getAttribute("to")

      if (from && to) {
        if (!isAnnotationListCollapse.value) isAnnotationListCollapse.value = true
        nextTick(() => {
          annotationListRef.value?.scrollGroup({ from: from, to: to })
        })
      }
    }
  })
}

// 新增批注滑动
function addCommentListener(id) {
  const comment = document.getElementById(id)
  if (comment)
    comment.onclick = e => {
      const from = comment.getAttribute("from")
      const to = comment.getAttribute("to")

      if (from && to) {
        if (!isAnnotationListCollapse.value) isAnnotationListCollapse.value = true
        nextTick(() => {
          annotationListRef.value?.scrollGroup({ from: from, to: to })
        })
      }
    }
}

const emits = defineEmits(["update:isHistoryCollapse", "update:isContentLibrary", "update:isWatermarkCollapse"])

defineExpose({ openHistoryList, openContentLibrary, openWatermarkList, commentListener, addCommentListener })

// 打开历史记录
function openHistoryList() {
  isHistoryCollapse.value = true
}

// 打开内容库
function openContentLibrary() {
  isContentLibrary.value = true
}

// 打开水印
function openWatermarkList() {
  isWatermarkCollapse.value = true
}

// 打开批注列表
function openAnnotationList() {
  isAnnotationListCollapse.value = true
}
</script>

<style lang="less" scoped>
.side-toolbar-root {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  padding-top: 10px;
  box-sizing: border-box;
  border: 1px solid #eee;
  box-shadow: -5px 0 10px -5px #ddd;

  .side-tool-bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    font-size: 12px;
    i {
      font-size: 24px;
      padding: 5px;
      color: gray;
    }
    &:hover {
      i {
        background: rgba(0, 0, 0, 0.04);
      }
    }
  }
}
.side-drawer-container {
  position: absolute;
  right: 1px;
  top: 0px;
  bottom: 0px;
  margin: auto;
  border: none;
  z-index: 2;
  box-shadow: -5px 0 10px -5px #ddd;
  transition: width 0.5s;
  overflow: hidden;
}
</style>
