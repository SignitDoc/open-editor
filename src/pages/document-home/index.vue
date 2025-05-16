<template>
  <!-- 在线文档区域 -->
  <div class="home-container">
    <div class="home-center-container">
      <!-- 顶部操作栏 -->
      <div class="header-container">
        <!-- 搜索栏 -->
        <div class="search-container">
          <el-select
            v-model="searchForm.type"
            class="search-doc-type"
            placeholder="请选择文档类型"
            :teleported="false"
            @change="filesTableRef?.refreshTable()"
          >
            <template #label>
              <div class="type-item">
                <img :src="activeType?.icon" />
                <span>{{ activeType?.label }}</span>
              </div>
            </template>
            <el-option v-for="item in allTypeOptions" :key="item.value" :value="item.value">
              <div class="type-item">
                <img :src="item.icon" />
                <span>{{ item.label }}</span>
              </div>
            </el-option>
          </el-select>
          <el-input
            v-model="searchForm.title"
            style="width: 260px; margin-left: 12px"
            :prefix-icon="Search"
            placeholder="请输入文档名称"
            clearable
            @change="filesTableRef?.refreshTable()"
          />
        </div>

        <!-- 批量操作栏 -->
        <div class="actions-container">
          <el-popover trigger="click" :teleported="false" popper-class="add-popover" :width="320">
            <template #reference>
              <el-button type="primary">
                <template #icon><i class="ri-add-line"></i></template>
                新建
              </el-button>
            </template>
            <div class="add-title">新建</div>
            <div class="add-group">
              <div class="add-item" @click="() => addDocument('normal')">
                <img class="add-item-icon" :src="wordIcon" />
                <div class="add-item-type">文档</div>
              </div>
              <div class="add-item" @click="() => addExcel('normal')">
                <img class="add-item-icon" :src="excelIcon" />
                <div class="add-item-type">表格</div>
              </div>
              <div class="add-item" @click="e => addPPT('normal')">
                <img class="add-item-icon" :src="PPTIcon" />
                <div class="add-item-type">演示</div>
              </div>
              <div class="add-item" @click="() => addMarkdown('normal')">
                <img class="add-item-icon" :src="MarkDownIcon" />
                <div class="add-item-type">MarkDown</div>
              </div>
              <div class="add-item" @click="() => addMindMap('normal')">
                <img class="add-item-icon" :src="MindMapIcon" />
                <div class="add-item-type">思维导图</div>
              </div>

              <div class="add-item" @click="() => addFlowChart('normal')">
                <img class="add-item-icon" :src="flowIcon" />
                <div class="add-item-type">流程图</div>
              </div>
            </div>
          </el-popover>
          <el-popover trigger="click" :teleported="false">
            <template #reference>
              <el-button style="margin: 0px 12px" type="primary" plain>
                <template #icon><i class="ri-file-transfer-fill"></i></template>导入
              </el-button>
            </template>
            <DocxToHtml :create-doc="() => addDocument('transform')" />
            <ExcelToHtml :create-excel="() => addExcel('transform')" />
            <MindMapToHtml :createMindMap="data => addMindMap('transform', data)" />
          </el-popover>
          <el-button :icon="Menu" @click="templateLibraryDialogRef?.openDialog()">模板库</el-button>
          <el-button
            type="danger"
            plain
            :icon="Delete"
            :disabled="tableState.selectedRows.length === 0"
            @click="deleteDocument(tableState.selectedRows)"
          >
            删除
          </el-button>
        </div>
      </div>

      <!-- 文档列表 -->
      <div class="table-container">
        <!-- 表单 -->
        <el-table
          class-name="documents-table"
          size="large"
          :data="documentList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="title" label="文档标题" :min-width="300">
            <template #default="{ row }">
              <el-space>
                <img class="table-type-icon" :src="getDocumentTypeShowIcon(row.type)" />
                {{ row.title }}
              </el-space>
            </template>
          </el-table-column>
          <el-table-column prop="creator" label="所有者" :min-width="160">
            <template #default="{ row }">
              <div style="display: flex; align-items: center">
                {{ row.creator }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="最近更新时间" :min-width="200">
            <template #default="{ row }">{{ new Date(Number(row.updateTime)).toLocaleString() }}</template>
          </el-table-column>
          <el-table-column prop="createdTime" label="创建时间" :min-width="200">
            <template #default="{ row }">{{ new Date(Number(row.createdTime)).toLocaleString() }}</template>
          </el-table-column>
          <el-table-column prop="action" label="操作" :min-width="220" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="rowClick(row, 'view')">预览</el-button>
              <el-button type="primary" link @click="rowClick(row, 'edit')"> 编辑 </el-button>
              <el-button type="danger" link @click="deleteDocument([row])"> 删除 </el-button>
            </template>
          </el-table-column>
          <template #empty>
            <EmptyContent />
          </template>
        </el-table>
        <!-- 总数 -->
        <div v-if="documentList.length > 0" class="sum">
          {{ `共 ${documentList.length} 条数据` }}
        </div>
      </div>
    </div>

    <!-- 模板库弹窗 -->
    <TemplateLibraryDialog ref="templateLibraryDialogRef" :create-doc="transformDoc" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from "vue"
import { useRouter } from "vue-router"

import { Delete, Menu, Search } from "@element-plus/icons-vue"
import TemplateLibraryDialog from "./component/template-library-dialog.vue"
import { EmptyContent } from "@/components"

import { allTypeOptions } from "./config"
import { defaultPPTData } from "@/config"
import { useDocumentListStore, useDocumentStore } from "@/store"
import { getDocumentTypeShowIcon, Message } from "@/utils"
import { useSaveWord, useSaveMindMap, useSaveCommon } from "@/hooks"
import { DocumentActionEnum } from "@/enum"

import { DocxToHtml, ExcelToHtml, MindMapToHtml } from "@/editor-functions"

import MarkDownIcon from "@/assets/document-icon/markdown-icon.jpeg"
import MindMapIcon from "@/assets/document-icon/mind-map-icon.jpeg"
import flowIcon from "@/assets/document-icon/flow-chart-icon.jpeg"
import excelIcon from "@/assets/document-icon/excel-icon.png"
import wordIcon from "@/assets/document-icon/word-icon.png"
import PPTIcon from "@/assets/document-icon/ppt-icon.png"

const router = useRouter()
const documentStore = useDocumentStore()
const documentListStore = useDocumentListStore()

const filesTableRef = ref()
const templateLibraryDialogRef = ref()
/* ====================================== 文件搜索 ======================================*/
const searchForm = reactive({
  type: "all",
  title: ""
})

// 当前类型配置
const activeType = computed(() => {
  return allTypeOptions.find(item => item.value === searchForm.type)
})

/* ================================ 创建文档 ================================ */
const createLoading = ref(false)

function transformDoc() {
  if (documentStore.transferType === "word") return addDocument("transform")
  else if (documentStore.transferType === "excel") return addExcel("transform")
  else if (documentStore.transferType === "markdown") return addMarkdown("transform")
  else if (documentStore.transferType === "mindMap") return addMindMap("transform", documentStore.transferDoc)
  else if (documentStore.transferType === "flowChart") return addFlowChart("transform")
  else if (documentStore.transferType === "ppt") return addPPT("transform")
  else Message.warning("文档类型错误")
}
// 新建文档
function addDocument(type) {
  const title = type === "transform" ? documentStore.transferTitle : "未命名文档"
  const content = type === "transform" ? documentStore.transferDoc : ""
  useSaveWord(DocumentActionEnum.Create, title, content, createLoading, null, "word", document => {
    Message.success("创建成功")
    documentStore.$patch({ editable: true })
    router.push(`/word-edit?id=${document._id}`)
  })
}

// 添加excel
function addExcel(type) {
  let title = "未命名表格"
  let sheets = []
  if (type === "transform") {
    const transferDoc = documentStore.transferDoc
    sheets = transferDoc
    title = documentStore.transferTitle
  }
  useSaveCommon(DocumentActionEnum.Create, "excel", title, sheets, createLoading, null, excel => {
    Message.success("创建成功")
    router.push(`/excel-edit?id=${excel._id}`)
  })
}

// 添加思维导图
function addMindMap(type: "normal" | "transform", data?: Record<string, any>) {
  let title = "未命名思维导图"
  let dataToEnd = {
    title: "未命名思维导图"
  } as Record<string, any>
  if (type === "transform" && data) {
    dataToEnd = data
    title = data.title
  }
  useSaveMindMap(DocumentActionEnum.Create, title, dataToEnd, createLoading, null, mindMap => {
    Message.success("创建成功")
    router.push(`/mindMap-edit?id=${mindMap._id}`)
  })
}

// 添加演示
function addPPT(type) {
  let title = "未命名演示"
  let content = defaultPPTData
  if (type === "transform") {
    title = documentStore.transferTitle
    content = documentStore.transferDoc
  }
  useSaveCommon(DocumentActionEnum.Create, "ppt", title, content, createLoading, null, ppt => {
    Message.success("创建成功")
    router.push(`/ppt-edit?id=${ppt._id}`)
  })
}

// 添加md
function addMarkdown(type) {
  let content = ""
  let title = "未命名笔记"
  if (type === "transform") {
    content = documentStore.transferDoc || ""
    title = documentStore.transferTitle || "未命名笔记"
  }

  useSaveCommon(DocumentActionEnum.Create, "markdown", title, content, createLoading, null, newMarkdown => {
    Message.success("创建成功")
    router.push(`/markdown-edit?id=${newMarkdown._id}`)
  })
}

// 添加流程图
function addFlowChart(type) {
  let title = "未命名流程图"
  let content = ""
  if (type === "transform") {
    title = documentStore.transferTitle
    content = documentStore.transferDoc
  }
  useSaveCommon(DocumentActionEnum.Create, "flowChart", title, content, createLoading, null, flowChart => {
    Message.success("创建成功")
    router.push(`/flowChart-edit?id=${flowChart._id}`)
  })
}

/* ====================================== 文件列表 ======================================*/
const tableState = reactive({
  selectedRows: [] as Array<any>
})

// 文档筛选
const documentList = computed(() => {
  return documentListStore.listData.filter(item => {
    return (searchForm.type === "all" || searchForm.type === item.type) && item.title.includes(searchForm.title)
  })
})
/* ====================================== 文档操作 ======================================*/
// 点击文档
function rowClick(row, type) {
  // 流程图暂无预览功能，都进编辑页面
  if (row.type === "flowChart") type = "edit"
  // 检查预览权限
  if (row.type) router.push(`/${row.type}-${type}?id=${row._id}`)
  else router.push("/none")
}

// 删除文档
function deleteDocument(documents) {
  const documentsID = documents.map(item => item._id)
  documentListStore.delete(documentsID)
}

// 表单选择
function handleSelectionChange(rows: Array<any>) {
  tableState.selectedRows = rows
}
</script>

<style lang="less" scoped>
.home-root {
  width: 100%;
  height: 100%;
  .home-header {
    height: 50px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      &:hover {
        background: rgba(0, 0, 0, 0.02);
      }

      span {
        margin-left: 5px;
      }
      .user-avatar {
        width: 36px;
        height: 36px;
        object-fit: cover;
        border-radius: 50%;
        flex-shrink: 0;
      }
    }

    .login-hint {
      cursor: pointer;
      line-height: 50px;
      padding: 0px 20px;
      &:hover {
        background: rgba(0, 0, 0, 0.02);
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
  .home-main {
    padding: 0px;
    border-top: 1px solid #c8c8c833;
    display: flex;
    flex-direction: column;
  }
  .home-container {
    display: flex;
    justify-content: center;
    flex: 1;
    min-height: 0px;
    width: 100%;

    .home-center-container {
      flex: 1;
      min-width: 0px;
      background: #f9fafb;
      display: flex;
      flex-direction: column;
      min-height: 500px;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      border-radius: 4px;
      .header-container {
        display: flex;
        justify-content: space-between;

        .search-container {
          display: flex;
          .search-doc-type {
            width: 160px;
            :deep(.el-select-dropdown__item) {
              padding: 0px 12px;
            }
            .type-item {
              display: flex;
              align-items: center;
              cursor: pointer;
              img {
                width: 20px;
                height: 20px;
                object-fit: contain;
                margin-right: 5px;
                border-radius: 2px;
              }
            }
          }
        }

        .actions-container {
          display: flex;
          margin-left: 12px;
        }
        :deep(.add-popover) {
          padding-bottom: 24px;
          .add-title {
            font-size: 16px;
            font-weight: 600;
            margin: 12px 12px 16px;
          }

          .group-header {
            margin: 8px 12px;
            font-size: 12px;
            color: #888;
          }
          .add-group {
            display: flex;
            flex-wrap: wrap;
            align-items: center;

            .add-item {
              text-align: center;
              cursor: pointer;
              width: 73px;
              height: 73px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;

              &:hover {
                background: rgba(0, 0, 0, 0.04);
              }
              .add-item-icon {
                width: 36px;
                height: 36px;
                border-radius: 4px;
              }

              .add-item-type {
                margin-top: 8px;
                font-size: 12px;
                color: #333;
                line-height: 1;
              }
            }
          }
        }
      }
      .table-container {
        flex: 1;
        min-height: 0px;
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        border-radius: 12px;
        background: #ffffff;
        box-shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        .documents-table {
          .table-type-icon {
            width: 24px;
            height: 24px;
            object-fit: contain;
            border-radius: 4px;
          }
          .filter-column-container {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .filter-action-container {
              display: flex;

              :deep(.el-button) {
                flex: 1;
                min-width: 0px;
              }
            }
          }
        }
        :deep(.el-table) {
          flex: 1;
          min-height: 0px;
          .el-table__body-wrapper {
            height: calc(100% - 60px);
            overflow-y: auto;
            overflow-x: auto;
            scrollbar-width: 10px !important;
            .el-scrollbar__view {
              height: 100%;
            }
          }
        }

        .sum {
          padding: 16px 24px;
          font-size: 14px;
          line-height: 20px;
          letter-spacing: normal;
          color: #4b5563;
        }
      }
    }
  }
}
</style>
