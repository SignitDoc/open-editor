<template>
  <div class="mind-map-wrapper">
    <!-- 头部 -->

    <PageHeader v-model:doc="mindMapState" :save-loading="saveLoading" :save="save" :edit="true">
      <!-- <template #headerAction>
        <el-button @click="getSvgData">获取svg</el-button>
      </template> -->
    </PageHeader>

    <Toolbar
      @exportMindMap="handleExport"
      @addAssociativeLine="handleAddAssociativeLine"
      :mindMapTitle="mindMapState.title"
    />
    <!-- <Edit/> -->
    <div class="edit-mind-map-wrapper" v-loading="fullLoading">
      <div class="mind-map-container" ref="mindMapContainer"></div>
    </div>
    <!-- 右键菜单 -->
    <ContextMenu v-if="mindMap" />
  </div>
</template>

<script setup lang="ts">
import Toolbar from "./components/toolbar.vue"
import MindMap from "simple-mind-map"
import Drag from "simple-mind-map/src/plugins/Drag.js"
import { ref, onMounted, computed, watch, onUnmounted } from "vue"
import { cloneDeep } from "lodash"
import { useMindMapStore } from "./config"
import ContextMenu from "./components/context-menu.vue"
import Export from "simple-mind-map/src/plugins/Export.js"
import ExportXMind from "./export-xmind.js"
import ExportPDF from "simple-mind-map/src/plugins/ExportPDF.js"
import AssociativeLine from "simple-mind-map/src/plugins/AssociativeLine.js"
import { useSaveMindMap } from "@/hooks"
import { DocumentActionEnum } from "@/enum"
import { useRouter } from "vue-router"
import { transformToXmind, downloadFile, Message } from "@/utils"
import { PageHeader } from "@/editor-modules"
import { defaultMindMapData } from "./constant"
import { useDocumentListStore, useDocumentStore } from "@/store"
import { MindMapDocumentItem } from "@/types.js"

const router = useRouter()

const documentStore = useDocumentStore()
const documentListStore = useDocumentListStore()

MindMap.usePlugin(Drag) // 拖拽
MindMap.usePlugin(Export) // 导出
MindMap.usePlugin(ExportPDF) // 导出
MindMap.usePlugin(ExportXMind) // 导出 xminds
MindMap.usePlugin(AssociativeLine) // 关联线

const mindMapStore = useMindMapStore()
const mindMapContainer = ref(null)
const mindMap = ref<any>(null)

const fullLoading = ref(false)

// 思维导图id
const mindMapId = computed(() => {
  return router.currentRoute.value.query.id as string
})

// 思维导图数据
const mindMapState = ref<MindMapDocumentItem>({
  _id: "",
  type: "mindMap",
  title: "未命名思维导图",
  content: [],
  creator: "",
  updateTime: "",
  history: [],
  versionList: [],
  createdTime: "",
  commentList: []
})

let firstInit = true
const initMindMapFn = (data?: Record<string, any>) => {
  if (data) {
    if (data?.root) {
      mindMap.value.setFullData(data)
    } else {
      mindMap.value.setData(data)
    }
  }
  mindMap.value.view.reset()
  fullLoading.value = false
  mindMap.value.on("data_change", e => {
    if (firstInit) return (firstInit = false)
    else documentStore.$patch({ isSave: false })
  })
}

// 初始化数据
watch(
  () => mindMapId.value,
  () => {
    setTimeout(() => {
      if (mindMapId.value) {
        mindMapState.value._id = mindMapId.value

        let document = documentListStore.getDetail(mindMapId.value)
        if (!document || document.type !== "mindMap") return router.push(`/none`)

        document = cloneDeep(document)
        mindMapState.value = document
        mindMapState.value.title = document?.title || "未命名思维导图"
        if (document.content?.root) {
          initMindMapFn(document.content)
        } else {
          initMindMapFn()
        }
      }
    }, 500)
  },
  { immediate: true }
)

onMounted(() => {
  if (!mindMapContainer.value) {
    return
  }
  fullLoading.value = true
  mindMap.value = new MindMap({
    el: mindMapContainer.value as any,
    data: defaultMindMapData as any
  } as any)
  mindMapStore.setMindMap(mindMap.value)
  // 监听节点激活事件
  mindMap.value.on("node_active", (node, activeNodeList) => {
    mindMapStore.setActiveNodes(activeNodeList)
  })

  // 监听前进和回退
  mindMap.value.on("back_forward", (index, len) => {
    mindMapStore.setBackEnd(index <= 0)
    mindMapStore.setForwardEnd(index >= len - 1)
  })

  //监听右键
  mindMap.value.on("node_contextmenu", (e, node) => {
    mindMapStore.setContentMenu({
      type: "node",
      left: e.clientX + 10,
      top: e.clientY + 10,
      isShow: true,
      currentNode: cloneDeep(node)
    })
  })
  window.addEventListener("beforeunload", saveHint)
})

onUnmounted(() => {
  window.removeEventListener("beforeunload", saveHint)
})

// 获取svg数据
function getSvgData() {
  const svgData = mindMap.value?.getSvgData()
  console.log(svgData)
}

function saveHint(e) {
  if (!documentStore.isSave) {
    e.preventDefault()
    e.returnValue = "数据暂未保存，是否要离开改页面"
    return "数据暂未保存，是否要离开改页面"
  }
}

// 导出
const handleExport = async ({ fileType, title }) => {
  if (fileType === "svg") {
    mindMap.value.export(fileType, true, title, false)
  } else if (fileType === "xmind") {
    // mindMap.value.export(fileType, title)
    const data = mindMap.value.getData()
    const blob = await transformToXmind(data, title)
    downloadFile({ fileData: blob, fileName: `${title}.${fileType}`, fileType: fileType })
  } else if (fileType === "txt") {
    mindMap.value.export(fileType, true, title)
  } else {
    // png,pdf,json,md
    mindMap.value.export(fileType, true, title, true)
  }
  Message.success("导出成功")
}

// 添加关联线
const handleAddAssociativeLine = () => {
  mindMap.value.associativeLine.createLineFromActiveNode()
}

// 暂存
const saveLoading = ref(false)
// 暂存
const save = () => {
  const content = mindMap.value.getData(true)
  useSaveMindMap(
    DocumentActionEnum.Edit,
    mindMapState.value.title,
    content,
    saveLoading,
    mindMapState.value,
    mindMap => {
      mindMapState.value = mindMap
      Message.success("更新成功")
    }
  )
}
</script>

<style scoped lang="less">
.mind-map-wrapper {
  .edit-mind-map-wrapper {
    position: fixed;
    top: 101px;
    left: 0;
    right: 0;
    bottom: 0;
    .mind-map-container {
      width: 100%;
      height: 100%;
    }
    .mind-map-container * {
      margin: 0;
      padding: 0;
    }
  }
}
</style>
