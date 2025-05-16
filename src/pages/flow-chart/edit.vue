<template>
  <div class="flow-chart-root">
    <PageHeader v-model:doc="nowFlowChart" :edit="true" :show-save="false"> </PageHeader>

    <iframe ref="iframeRef" class="flow-chart-iframe"></iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import { FlowChartItem } from "@/types"
import { PageHeader } from "@/editor-modules"
import { useSaveCommon } from "@/hooks"
import { DocumentActionEnum } from "@/enum"
import { Message } from "@/utils"
import { useRouter } from "vue-router"
import { useDocumentListStore } from "@/store"
import { cloneDeep } from "lodash-es"

const documentListStore = useDocumentListStore()

const router = useRouter()

const iframeRef = ref()

const saveLoading = ref(false)

const docId = ref("")
const nowFlowChart = ref<FlowChartItem>({
  type: "flowChart",
  title: "未命名流程图",
  content: "",
  creator: "",
  updateTime: "",
  history: [],
  versionList: [],
  createdTime: "",
  commentList: []
})

onMounted(() => {
  docId.value = router.currentRoute.value.query.id as string
  nowFlowChart.value._id = docId.value

  let doc = documentListStore.getDetail(docId.value)
  if (!doc || doc.type !== "flowChart") return router.push(`/none`)

  doc = cloneDeep(doc)
  nowFlowChart.value = doc
  window.addEventListener("message", handleUseMessageEvent)
  iframeRef.value.src = `https://embed.diagrams.net?ui=atlas&proto=json&configure=1&libraries=1&noSaveBtn=0&lang=zh&&format=svg`
})

onUnmounted(() => {
  window.removeEventListener("message", handleUseMessageEvent)
})

// 处理获取到的消息
function handleUseMessageEvent(evt: MessageEvent) {
  if (iframeRef.value && evt.source === iframeRef.value.contentWindow && evt.data.length > 0) {
    try {
      const msg = JSON.parse(evt.data)
      if (msg) {
        handleUseMessage(msg)
      }
    } catch (e) {
      console.error(e)
    }
  }
}

function handleUseMessage(msg) {
  // 配置
  if (msg.event === "configure") {
    postMessage({
      action: "configure",
      config: {
        ui: "atlas",
        proto: "json",
        libraries: 1,
        configure: 1,
        noSaveBtn: 0
      }
    })
  }
  // 初始化
  else if (msg.event === "init") {
    postMessage({
      action: "load",
      autosave: 0,
      saveAndExit: "0", //不显示保存并退出按钮
      modified: "unsavedChanges",
      xml: nowFlowChart.value.content || ""
    })
  }
  // 保存并退出
  else if (msg.event === "save") {
    save(msg.xml)
    postMessage({
      action: "status",
      messageKey: "allChangesSaved",
      modified: false
    })
  }
  if (msg.event === "exit") {
    router.push("/home")
  }
}
// 保存
function save(data) {
  useSaveCommon(
    DocumentActionEnum.Edit,
    "flowChart",
    nowFlowChart.value.title,
    data,
    saveLoading,
    nowFlowChart.value,
    flowChart => {
      Message.success("编辑成功")
      nowFlowChart.value = flowChart as FlowChartItem
    }
  )
}

// diagrams页面和当前页面通信
function postMessage(msg: Record<string, any>) {
  iframeRef.value?.contentWindow?.postMessage(JSON.stringify(msg), "*")
}
</script>

<style lang="less" scoped>
.flow-chart-root {
  width: 100%;
  height: 100%;
  .flow-chart-iframe {
    width: 100%;
    height: calc(100% - 56px);
    border: none;
    display: block;
  }
}
</style>
