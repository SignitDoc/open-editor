<!-- 模板库 -->
<template>
  <DialogContainer v-model:visible="visible" title="模板库" :width="1060" :no-footer="true">
    <el-input
      v-model="searchName"
      placeholder="请输入需要搜索的模板名称"
      style="margin: 0px 10px 10px; width: calc(100% - 20px)"
      clearable
      :prefix-icon="Search"
      @change="search"
    />

    <el-tabs v-model="activeType">
      <!-- 全部模板 -->
      <el-tab-pane label="全部" name="all">
        <div v-if="searchData.length > 0" class="template-list">
          <div v-for="item in searchData" :key="item._id" class="template-item" @click="createTemplate(item)">
            <div class="content-scale-item">
              <div class="preview-content">
                <div
                  v-if="item.type === 'word'"
                  v-html="item.contentHTML"
                  :style="{ width: 100 * (793 / 314) + '%', transformOrigin: '0px -15px', scale: 314 / 793 }"
                ></div>
                <img v-else-if="item.baseImg" :src="item.baseImg" class="excel-preview" />
                <div
                  v-else-if="item.type === 'markdown'"
                  :id="`markdown-${item._id}-all`"
                  :style="{ width: 100 * (793 / 314) + '%', transformOrigin: '0px -15px', scale: 314 / 793 }"
                ></div>
                <div
                  v-if="item.svgHtml"
                  v-html="item.svgHtml"
                  :style="{
                    width: 100 * (793 / 314) + '%',
                    transformOrigin: '0px 0px',
                    scale: 314 / 793
                  }"
                ></div>
              </div>
            </div>

            <div class="template-title">{{ item.title }}</div>
          </div>
        </div>
        <EmptyContent class="empty-list" v-else />
      </el-tab-pane>
      <!-- 文档模板 -->
      <el-tab-pane label="文档" :name="DocumentTypeEnum.word">
        <div v-if="searchWordData.length > 0" class="template-list">
          <div v-for="item in searchWordData" :key="item._id" class="template-item" @click="createTemplate(item)">
            <div class="content-scale-item">
              <div class="preview-content">
                <div
                  v-html="item.contentHTML"
                  :style="{ width: 100 * (793 / 314) + '%', transformOrigin: '0px -15px', scale: 314 / 793 }"
                ></div>
              </div>
            </div>

            <div class="template-title">{{ item.title }}</div>
          </div>
        </div>
        <EmptyContent class="empty-list" v-else />
      </el-tab-pane>

      <!-- 表格模板 -->
      <el-tab-pane label="表格" :name="DocumentTypeEnum.excel">
        <div v-if="searchExcelData.length > 0" class="template-list">
          <div v-for="item in searchExcelData" :key="item._id" class="template-item" @click="createTemplate(item)">
            <div class="content-scale-item">
              <div class="preview-content">
                <img :src="item.baseImg" class="excel-preview" />
              </div>
            </div>

            <div class="template-title">{{ item.title }}</div>
          </div>
        </div>
        <EmptyContent class="empty-list" v-else />
      </el-tab-pane>

      <!-- 演示模板 -->
      <el-tab-pane label="演示" :name="DocumentTypeEnum.ppt">
        <div v-if="searchPPTData.length > 0" class="template-list">
          <div v-for="item in searchPPTData" :key="item._id" class="template-item" @click="createTemplate(item)">
            <div class="content-scale-item">
              <div class="preview-content">
                <img :src="item.baseImg" class="excel-preview" />
              </div>
            </div>

            <div class="template-title">{{ item.title }}</div>
          </div>
        </div>
        <EmptyContent class="empty-list" v-else />
      </el-tab-pane>

      <!-- markdown模板 -->
      <el-tab-pane label="Markdown" :name="DocumentTypeEnum.markdown">
        <div v-if="searchMarkdownData.length > 0" class="template-list">
          <div v-for="item in searchMarkdownData" :key="item._id" class="template-item" @click="createTemplate(item)">
            <div class="content-scale-item">
              <div class="preview-content">
                <div
                  :id="`markdown-${item._id}`"
                  :style="{ width: 100 * (793 / 314) + '%', transformOrigin: '0px -15px', scale: 314 / 793 }"
                ></div>
              </div>
            </div>

            <div class="template-title">{{ item.title }}</div>
          </div>
        </div>
        <EmptyContent class="empty-list" v-else />
      </el-tab-pane>

      <!-- 思维导图模板 -->
      <el-tab-pane label="思维导图" :name="DocumentTypeEnum.mindMap">
        <div v-if="searchMindMapData.length > 0" class="template-list">
          <div v-for="item in searchMindMapData" :key="item._id" class="template-item" @click="createTemplate(item)">
            <div class="content-scale-item">
              <div class="preview-content">
                <div
                  v-html="item.svgHtml"
                  :style="{ width: 100 * (793 / 314) + '%', transformOrigin: '0px 0px', scale: 314 / 793 }"
                ></div>
              </div>
            </div>

            <div class="template-title">{{ item.title }}</div>
          </div>
        </div>
        <EmptyContent class="empty-list" v-else />
      </el-tab-pane>

      <!-- 流程图模板 -->
      <el-tab-pane label="流程图" :name="DocumentTypeEnum.flowChart">
        <div v-if="searchFlowChartData.length > 0" class="template-list">
          <div v-for="item in searchFlowChartData" :key="item._id" class="template-item" @click="createTemplate(item)">
            <div class="content-scale-item">
              <div class="preview-content">
                <div
                  v-if="item.svgHtml"
                  v-html="item.svgHtml"
                  :style="{
                    width: 100 * (793 / 314) + '%',
                    transformOrigin: '0px 0px',
                    scale: 314 / 793
                  }"
                ></div>
              </div>
            </div>

            <div class="template-title">{{ item.title }}</div>
          </div>
        </div>
        <EmptyContent class="empty-list" v-else />
      </el-tab-pane>
    </el-tabs>
  </DialogContainer>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue"
import { DialogContainer, EmptyContent } from "@/components"
import { useDocumentStore } from "@/store"
import { noop } from "lodash"
import { Search } from "@element-plus/icons-vue"
import { generateHTML } from "@tiptap/core"
import extensions from "@/tiptap-extensions"
import StarterKit from "@tiptap/starter-kit"
import { templateList } from "../template-list"
import { DocumentTypeEnum } from "@/enum"
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer"

const documentStore = useDocumentStore()

const props = defineProps({
  createDoc: { type: Function, default: noop, required: true }
})

const searchName = ref("")

const visible = ref(false)
const activeType = ref("all")
const data = ref<Array<any>>([])
const searchData = ref<Array<any>>([])
const searchWordData = ref<Array<any>>([])
const searchExcelData = ref<Array<any>>([])
const searchPPTData = ref<Array<any>>([])
const searchMarkdownData = ref<Array<any>>([])
const searchMindMapData = ref<Array<any>>([])
const searchFlowChartData = ref<Array<any>>([])

function createTemplate(file) {
  documentStore.setTransferDoc(file.content, file.type)
  documentStore.setTransferTitle(file.title)
  props.createDoc()
}
function search() {
  searchData.value = data.value.filter(item => item.title.includes(searchName.value))
  searchWordData.value = data.value.filter(
    item => item.title.includes(searchName.value) && item.type === DocumentTypeEnum.word
  )
  searchExcelData.value = data.value.filter(
    item => item.title.includes(searchName.value) && item.type === DocumentTypeEnum.excel
  )
  searchMarkdownData.value = data.value.filter(
    item => item.title.includes(searchName.value) && item.type === DocumentTypeEnum.markdown
  )
  searchMindMapData.value = data.value.filter(
    item => item.title.includes(searchName.value) && item.type === DocumentTypeEnum.mindMap
  )
  searchPPTData.value = data.value.filter(
    item => item.title.includes(searchName.value) && item.type === DocumentTypeEnum.ppt
  )
  searchFlowChartData.value = data.value.filter(
    item => item.title.includes(searchName.value) && item.type === DocumentTypeEnum.flowChart
  )
}

const openDialog = () => {
  visible.value = true
  data.value = templateList.map((item: any) => {
    if (item.type === DocumentTypeEnum.word)
      item.contentHTML = generateHTML(item.content, [
        ...extensions,
        StarterKit.configure({
          codeBlock: false,
          paragraph: false
        })
      ])
    else if (item.type === DocumentTypeEnum.markdown) {
      nextTick(() => {
        const domInAll = document.getElementById(`markdown-${item._id}-all`) as HTMLElement
        const dom = document.getElementById(`markdown-${item._id}`) as HTMLElement
        if (dom)
          new Viewer({
            el: dom,
            initialValue: item.content
          })
        if (domInAll)
          new Viewer({
            el: domInAll,
            initialValue: item.content
          })
      })
    }
    return item
  })
  search()
}

defineExpose({
  openDialog
})
</script>

<style lang="less" scoped>
.template-list {
  height: 680px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  .template-item {
    cursor: pointer;
    padding: 10px;
    box-sizing: border-box;
    .content-scale-item {
      position: relative;
      width: 314px;
      height: 440px;
      background-color: #fff;
      box-shadow: 0px 0px 3px 2px #ddd;
      box-sizing: border-box;
      padding: 10px;

      .preview-content {
        height: 420px;
        overflow: hidden;
        .excel-preview {
          width: 100%;

          object-fit: contain;
          object-position: top;
        }
      }
      .item-action-container {
        position: absolute;
        bottom: 0px;
        right: 0px;
        box-sizing: border-box;
        background: #f4f4f5;
        display: none;
        .item-action {
          padding: 5px;
          box-sizing: border-box;
          color: #999;

          &:hover {
            color: #409eff;
          }
        }
      }
    }
    .template-title {
      margin-top: 10px;
      text-align: center;
    }

    &:hover {
      background-color: #f4f4f5;
      .template-title {
        color: #409eff;
      }
      .item-action-container {
        display: block;
      }
    }
  }
}
.empty-list {
  height: 680px;
}
</style>
