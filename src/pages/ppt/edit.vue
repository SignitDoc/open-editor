<!-- ppt编辑页面 -->
<template>
  <div class="ppt-root">
    <PageHeader
      class="page-header"
      v-model:doc="PPTState.nowPPT"
      show-more-actions
      :edit="true"
      :save="() => PPTIframeRef?.contentWindow.postMessage({ type: 'online-editor', action: 'handleSave' }, '*')"
    >
      <template #dropdown>
        <el-dropdown style="width: 100%">
          <ContextMenuItem style="width: 100%" @click="ExportPPT">演示</ContextMenuItem>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click.prevent="() => playPPT('firstPage')">从头播放</el-dropdown-item>
              <el-dropdown-item @click.prevent="() => playPPT('nowPage')">从当前页播放</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <ContextMenuItem @click="ExportPPT">导出</ContextMenuItem>
        <ContextMenuItem @click="showShortcut">快捷键</ContextMenuItem>
      </template>
    </PageHeader>
    <iframe
      ref="PPTIframeRef"
      class="ppt-container"
      src="/src/sub-apps/signit-ppt-editor/index.html"
      allowfullscreen="true"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      @load="loadPPT"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, onUnmounted } from "vue"
import { ContextMenuItem } from "@/components"
import { PageHeader } from "@/editor-modules"
import { HistoryItem, PPTDocumentItem, CommentItem } from "@/types"
import { defaultPPTData } from "@/config"
import { DocumentActionEnum } from "@/enum"
import { useRouter } from "vue-router"
import { useDocumentListStore, useDocumentStore } from "@/store"
import { useSaveCommon } from "@/hooks"
import { Message } from "@/utils"
import { cloneDeep } from "lodash"

const router = useRouter()
const documentStore = useDocumentStore()
const documentListStore = useDocumentListStore()

const id = router.currentRoute.value.query.id as string

const PPTState = reactive({
  loading: false,
  nowPPT: {
    _id: "",
    type: "ppt",
    title: "未命名演示",
    content: defaultPPTData,
    updateTime: "",
    history: [] as Array<HistoryItem>,
    createdTime: "",
    commentList: [] as Array<CommentItem>,
    creator: "",
    versionList: []
  } as PPTDocumentItem,
  initContent: defaultPPTData as Array<Record<string, any>>
})

const PPTIframeRef = ref()

onMounted(async () => {
  window.addEventListener("message", handleMessage, false)
  // 获取当前点击的文档
  PPTState.loading = true
  let document = documentListStore.getDetail(id)
  if (!document || document.type !== "ppt") return router.push(`/none`)
  document = cloneDeep(document)

  // 设置编辑器的编辑状态和用户权限
  documentStore.$patch({
    editable: true,
    preview: false
  })

  PPTState.nowPPT = document
  PPTState.initContent = document.content
})

onUnmounted(() => {
  window.removeEventListener("message", handleMessage)
  PPTIframeRef.value?.removeEventListener("fullscreenchange", changeFullScreen)
})

// 初始化iframe
const isLoad = ref(false)
function loadPPT() {
  PPTIframeRef.value?.addEventListener("fullscreenchange", changeFullScreen)
  isLoad.value = true
}

watch(
  [() => isLoad.value, () => PPTState.initContent],
  () => {
    if (isLoad.value) {
      PPTIframeRef.value?.contentWindow.postMessage(
        { type: "online-editor", action: "init", data: cloneDeep(PPTState.nowPPT.content) },
        "*"
      )
      PPTState.loading = false
    }
  },
  { deep: true }
)

function handleMessage(e) {
  const { type, action, data } = e.data
  if (type === "ppt") {
    if (action === "openFullScreen") openFullScreen()
    else if (action === "closeFullScreen") closeFullScreen()
    else if (action === "handleSave") handleSave(data)
  }
}

const saveLoading = ref(false)
function handleSave(content) {
  if (!content || content.length === 0) content = defaultPPTData
  useSaveCommon(DocumentActionEnum.Edit, "ppt", PPTState.nowPPT.title, content, saveLoading, PPTState.nowPPT, ppt => {
    PPTState.nowPPT = ppt as PPTDocumentItem
    Message.success("保存成功")
  })
}

// 导出PPT
function ExportPPT() {
  PPTIframeRef.value?.contentWindow.postMessage({ type: "online-editor", action: "export" }, "*")
}

// 演示
function playPPT(playType) {
  PPTIframeRef.value?.contentWindow.postMessage({ type: "online-editor", action: "play", data: playType }, "*")
}

// 打开全屏
function openFullScreen() {
  if (PPTIframeRef.value?.requestFullscreen) PPTIframeRef.value?.requestFullscreen()
  else if (PPTIframeRef.value?.mozRequestFullScreen) PPTIframeRef.value?.mozRequestFullScreen()
  else if (PPTIframeRef.value?.webkitRequestFullScreen) PPTIframeRef.value?.webkitRequestFullScreen()
  else if (PPTIframeRef.value?.msRequestFullscreen) PPTIframeRef.value?.msRequestFullscreen()
}

// 关闭全屏
function closeFullScreen() {
  // 如果已经退出了全屏，则无需再调用全屏api
  if (!document.fullscreenElement) return

  if (PPTIframeRef.value?.exitFullscreen) PPTIframeRef.value?.exitFullscreen()
  else if (PPTIframeRef.value?.mozCancelFullScreen) PPTIframeRef.value?.mozCancelFullScreen()
  else if (PPTIframeRef.value?.webkitExitFullscreen) PPTIframeRef.value?.webkitExitFullscreen()
  else if (PPTIframeRef.value?.msExitFullscreen) PPTIframeRef.value?.msExitFullscreen()
}

function changeFullScreen() {
  if (!document.fullscreenElement) {
    PPTIframeRef.value.contentWindow.postMessage({ type: "online-editor", action: "closeFullScreen" }, "*")
  }
}

// 快捷键
function showShortcut() {
  PPTIframeRef.value?.contentWindow.postMessage({ type: "online-editor", action: "shortcut" }, "*")
}
</script>

<style lang="less" scoped>
.ppt-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  .ppt-container {
    flex: 1;
    min-height: 0px;
    border: none;
  }
}
</style>
