<template>
  <PageHeader v-model:doc="nowExcel" show-more-actions :save-loading="saveLoading" :save="save" :edit="true">
    <template #dropdown>
      <!-- <ContextMenuItem @click="getCanvasImage">获取canvas图像</ContextMenuItem> -->
      <ContextMenuItem @click="downloadExcel">下载</ContextMenuItem>
    </template>
  </PageHeader>
  <div id="luckysheet">
    <div class="loading-container">渲染中···</div>
  </div>
  <div v-show="isMaskShow" id="tip">Downloading</div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, computed, onMounted } from "vue"
import { useRouter } from "vue-router"

import { ContextMenuItem } from "@/components"
import { PageHeader } from "@/editor-modules"
import { DocumentActionEnum } from "@/enum"
import { useSaveCommon } from "@/hooks"
import { useDocumentStore, useDocumentListStore } from "@/store"
import { ExcelDocumentItem } from "@/types"
import { blobToBase64, exportExcel, Message } from "@/utils"
import { cloneDeep } from "lodash"

const documentStore = useDocumentStore()
const documentListStore = useDocumentListStore()
const router = useRouter()

const isMaskShow = ref(false)

onMounted(() => {
  window.addEventListener("beforeunload", saveHint)
})

// 获取canvas图像
function getCanvasImage() {
  const canvasDom = document.getElementById("luckysheetTableContent") as HTMLCanvasElement
  canvasDom.toBlob(async blob => {
    if (blob) {
      const base64 = await blobToBase64(blob)
      console.log(base64)
    }
  })
}

function saveHint(e) {
  if (!documentStore.isSave) {
    e.preventDefault()
    e.returnValue = "数据暂未保存，是否要离开改页面"
    return "数据暂未保存，是否要离开改页面"
  }
}

onUnmounted(() => {
  window.removeEventListener("beforeunload", saveHint)
})

const downloadExcel = () => {
  exportExcel(window.luckysheet.getAllSheets(), nowExcel.value.title)
}

const excelId = computed(() => {
  return router.currentRoute.value.query.id as string
})

const defaultTitle = "未命名表格"
const nowExcel = ref<ExcelDocumentItem>({
  type: "excel",
  title: "未命名表格",
  content: [],
  creator: "",
  updateTime: "",
  history: [],
  versionList: [],
  createdTime: "",
  commentList: []
})

// 初始化数据
watch(
  () => excelId.value,
  () => {
    if (excelId.value) {
      nowExcel.value._id = excelId.value

      setTimeout(() => {
        let excel = documentListStore.getDetail(excelId.value)
        if (!excel || excel.type !== "excel") return router.push(`/none`)

        excel = cloneDeep(excel)
        nowExcel.value = excel
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
      })
    }
  },
  { immediate: true }
)

// 初始化表格
function initSheets(config) {
  if (config.data) {
    window.luckysheet.create({
      container: "luckysheet",
      showinfobar: false,
      data: config.data,
      title: config.title,
      userInfo: "易企签用户",
      lang: "zh",
      plugins: [
        {
          name: "exportXlsx",
          config: {
            url: "/luckyToXlsx"
          }
        }
      ],
      hook: {
        cellUpdated: function (r, c, oldValue, newValue, isRefresh) {
          documentStore.$patch({ isSave: false })
        }
      }
    })
  } else
    window.luckysheet.create({
      container: "luckysheet",
      showinfobar: false,
      lang: "zh",
      title: config.title,
      userInfo: "易企签用户",
      plugins: [
        {
          name: "exportXlsx",
          config: {
            url: "/luckyToXlsx"
          }
        }
      ],
      hook: {
        cellUpdated: function (r, c, oldValue, newValue, isRefresh) {
          documentStore.$patch({ isSave: false })
        }
      }
    })

  window.luckysheet.cellUpdated = e => {}
}
/* =========================头部操作========================*/
// 暂存
const saveLoading = ref(false)
function save() {
  // 已在列表里，则更新列表

  const content = window.luckysheet.getAllSheets()
  useSaveCommon(DocumentActionEnum.Edit, "excel", nowExcel.value.title, content, saveLoading, nowExcel.value, excel => {
    nowExcel.value = excel as ExcelDocumentItem
    Message.success("编辑成功")
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
    top: 75px;
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
