<template>
  <PageHeader :doc="excelState.nowExcel" :edit="false" />
  <div id="luckysheet">
    <div class="loading-container">渲染中···</div>
  </div>
  <div v-show="isMaskShow" id="tip">Downloading</div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from "vue"
import { useRouter } from "vue-router"

import { PageHeader } from "@/editor-modules"
import { useDocumentListStore } from "@/store"
import { DocumentPermissionEnum } from "@/enum"
import { ExcelDocumentItem } from "@/types"
import { cloneDeep } from "lodash"

const router = useRouter()
const documentListStore = useDocumentListStore()

const isMaskShow = ref(false)

const excelId = computed(() => {
  return router.currentRoute.value.query.id as string
})

const defaultTitle = "未命名表格"
const excelState = reactive({
  nowExcel: {
    type: "excel",
    title: "未命名表格",
    content: [],
    creator: "",
    updateTime: "",
    history: [],
    versionList: [],
    share: true,
    ownerWsid: "",
    createdTime: "",
    permission: DocumentPermissionEnum.AllView
  } as ExcelDocumentItem
})

// 初始化数据
onMounted(() => {
  if (excelId.value) {
    let excel = documentListStore.getDetail(excelId.value)
    if (!excel || excel.type !== "excel") return router.push(`/none`)

    excel = cloneDeep(excel)
    excelState.nowExcel = excel
    if (excel.content && excel.content.length > 0)
      initSheets({
        data: excel.content,
        title: excel.title,
        userInfo: excel.creator
      })
    else
      initSheets({
        title: defaultTitle,
        userInfo: "易企签用户"
      })
  } else {
    router.push("/none")
  }
})

// 初始化表格
function initSheets(config) {
  if (config.data) {
    window.luckysheet.create({
      container: "luckysheet",
      showinfobar: false,
      data: config.data,
      title: config.title,
      userInfo: "易企签用户",
      allowEdit: false,
      lang: "zh",
      plugins: [
        {
          name: "exportXlsx",
          config: {
            url: "/luckyToXlsx"
          }
        }
      ]
    })
  } else
    window.luckysheet.create({
      container: "luckysheet",
      showinfobar: false,
      lang: "zh",
      title: config.title,
      allowEdit: false,
      userInfo: "易企签用户",
      plugins: [
        {
          name: "exportXlsx",
          config: {
            url: "/luckyToXlsx"
          }
        }
      ]
    })
}
</script>

<style scoped>
#luckysheet {
  margin: 0px;
  padding: 0px;
  position: absolute;
  width: 100%;
  left: 0px;
  top: 50px;
  bottom: 0px;
  background: #fff;
  height: calc(100% - 50px);
  .loading-container {
    position: absolute !important;
    z-index: 0;
    top: 125px;
    bottom: 0px;
    margin: auto;
    width: 100%;
    height: fit-content;
    font-size: 14px;
    color: #409eff;
    text-align: center;
  }
}

#tip {
  position: absolute;
  z-index: 1000000;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 40px;
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>
