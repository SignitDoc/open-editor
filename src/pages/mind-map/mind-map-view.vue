<template>
  <div class="mind-map-wrapper">
    <!-- 头部 -->
    <PageHeader v-model:doc="mindMapState" :edit="false" />

    <div v-loading="fullLoading" class="edit-mind-map-wrapper">
      <div class="mind-map-container" ref="mindMapContainer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MindMap from "simple-mind-map"
import { ref, onMounted } from "vue"
import { useMindMapStore } from "./config"
import { useRouter } from "vue-router"
import { useDocumentListStore } from "@/store"
import { PageHeader } from "@/editor-modules"
import { defaultMindMapData } from "./constant"
import { MindMapDocumentItem } from "@/types.js"
import { cloneDeep } from "lodash"

const router = useRouter()

const mindMapStore = useMindMapStore()
const documentListStore = useDocumentListStore()
const mindMapContainer = ref(null)
const mindMap = ref<any>(null)

const fullLoading = ref(false)

// 思维导图数据
const mindMapState = ref<MindMapDocumentItem>({
  _id: "",
  type: "mindMap",
  title: "未命名标题",
  content: [],
  creator: "",
  updateTime: "",
  history: [],
  versionList: [],
  createdTime: "",
  commentList: []
})

const initMindMapFn = (data?: Record<string, any>) => {
  if (data) {
    if (data?.root) {
      mindMap.value.setFullData(data)
    } else {
      mindMap.value.setData(data)
    }
  }
  mindMap.value.view.reset()
}

onMounted(async () => {
  if (!mindMapContainer.value) {
    return
  }
  fullLoading.value = true
  mindMap.value = new MindMap({
    el: mindMapContainer.value as any,
    data: defaultMindMapData as any
  } as any)
  mindMapStore.setMindMap(mindMap.value)
  const mindMapId = router.currentRoute.value.query.id as string
  if (mindMapId) {
    mindMapState.value._id = mindMapId

    let document = documentListStore.getDetail(mindMapId)
    if (!document || document.type !== "mindMap") return router.push(`/none`)

    document = cloneDeep(document)
    mindMapState.value = document
    mindMapState.value.title = document?.title || "未命名思维导图"
    if (document.content) initMindMapFn(document.content)
    else initMindMapFn()
  }
  fullLoading.value = false
})
</script>

<style scoped lang="less">
.mind-map-wrapper {
  .edit-mind-map-wrapper {
    position: fixed;
    top: 51px;
    left: 0;
    right: 0;
    bottom: 0;
    .mind-map-container {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
