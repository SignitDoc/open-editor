<template>
  <div class="history-list-root">
    <div class="list-hint">
      <div class="title-container">
        <span @click="changeTab('operate-history')">历史</span>
        <span @click="changeTab('version-history')">版本</span>
        <div class="tab-line" :class="{ 'active-line': activeTab === 'version-history' }"></div>
      </div>
      <IconButton label="关闭历史记录" icon="ri-close-line" @click="changeCollapse(false)" />
    </div>
    <!-- 版本列表 -->
    <div v-if="activeTab === 'version-history'">
      <div v-if="version.length > 0" class="history-list">
        <div v-for="(item, index) in version" :key="item.time" class="history-item" @click="changeContent(item)">
          <div class="history-title">
            <span>{{ `版本${version.length - index}` }}</span>
            <el-button
              v-if="!documentStore.preview"
              link
              style="font-size: 13px"
              @click="e => backSpaceVersion(item)"
              :icon="h('i', { class: 'ri-arrow-go-back-fill' })"
            >
              回退
            </el-button>
          </div>
          <div class="history-time">{{ new Date(Number(item.time)).toLocaleString() }}</div>

          <div class="history-version">
            {{ item.changer }}<span>{{ index === version.length - 1 ? "创建了文档" : "生成了文档版本" }}</span>
          </div>
        </div>
      </div>
      <el-empty v-else />
    </div>
    <!-- 历史记录列表 -->
    <div v-else>
      <div v-if="history.length > 0" class="operate-history-list">
        <div v-for="item in history" :key="item.time" class="operate-history-item" @click="changeContent(item)">
          <div class="operate-time">{{ new Date(Number(item.time)).toLocaleString() }}</div>
          <div class="operate-record">
            {{ item.changer }}<span>{{ getHistoryHint(item.actionType) }}</span>
          </div>
        </div>
      </div>
      <el-empty v-else />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, h, watch } from "vue"
import { IconButton } from "@/components"
import { Editor } from "@tiptap/vue-3"
import { DocumentActionEnum } from "@/enum"
import { SystemPrompt } from "@/utils"
import useDocumentStore from "@/store/documentStore"

const props = defineProps<{
  editor: Editor | undefined
  isHistoryCollapse: boolean
  editorHeaderRef: Record<string, any> | undefined
  nowDoc: Record<string, any>
}>()

const documentStore = useDocumentStore()

const emits = defineEmits(["update:isHistoryCollapse"])

const history = ref<Array<Record<string, any>>>([])
const version = ref<Array<Record<string, any>>>([])

const activeTab = ref("operate-history")

watch(
  () => props.isHistoryCollapse,
  val => {
    if (val) {
      history.value = props.nowDoc.history
      version.value = props.nowDoc.versionList || []
      // 打开列表禁用编辑
      documentStore.editable = false
    } else {
      // 非预览模式关闭列表打开编辑
      if (!documentStore.preview) documentStore.$patch({ editable: true })
    }
  }
)

// 打开/关闭列表
function changeCollapse(value) {
  emits("update:isHistoryCollapse", value)
}

// 修改editor显示文本和标题
function changeContent(item) {
  if (props.editor) props.editor.commands.setContent(item.content)
  if (props.editorHeaderRef) props.editorHeaderRef.setTitle(item.title)
}

// 切换列表展示类型
function changeTab(value) {
  activeTab.value = value
}

// 获取历史记录提示文本
function getHistoryHint(actionType) {
  switch (actionType) {
    case DocumentActionEnum.Create:
      return "创建了文档"
    case DocumentActionEnum.Edit:
      return "编辑了文档"
    case DocumentActionEnum.Release:
      return "生成了文档版本"
    case DocumentActionEnum.Backspace:
      return "回退了文档"
    default:
      return "对文档进行了操作"
  }
}

// 回退
function backSpaceVersion(row) {
  SystemPrompt("确认要回退到当前版本吗？").then(() => {
    if (props.editorHeaderRef) props.editorHeaderRef.handleSave(DocumentActionEnum.Backspace, row.content, row.title)
  })
}
</script>

<style lang="less" scoped>
.history-list-root {
  width: 360px;
  height: 100%;
  border-left: 1px solid #eee;
  background: #fff;
  transition: 0.5s width;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .list-hint {
    color: #aaa;
    padding: 12px;
    border-bottom: 1px solid #cfcfcf;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
    padding-left: 16px;
    .title-container {
      position: relative;
      span {
        font-size: 14px;
        color: #333;
        padding-right: 20px;
        cursor: pointer;
      }
      .tab-line {
        position: absolute;
        width: 24px;
        height: 2px;
        background: #409eff;
        border-radius: 6px;
        left: 2px;
        top: 31px;
        transition: all 0.3s;
      }
      .active-line {
        margin-left: 47px;
      }
    }

    .ri-close-line {
      cursor: pointer;
    }
  }

  .history-list,
  .operate-history-list {
    flex: 1;
    min-height: 0px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    .history-item {
      padding: 10px;
      cursor: pointer;
      border-bottom: 1px solid #eee;

      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }

      .history-title {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .history-version {
        color: #7f7f7f;
        font-size: 14px;
        span {
          padding-left: 8px;
        }
      }
      .history-time {
        margin: 5px 0px;
        font-size: 14px;
        color: #aaa;
      }
    }
  }

  .operate-history-list {
    .operate-history-item {
      padding: 12px 15px;
      cursor: pointer;
      border-bottom: 1px solid #eee;

      .operate-record {
        font-size: 14px;
        margin-top: 6px;
        color: #7f7f7f;
        span {
          padding-left: 8px;
        }
      }
      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }
    }
  }

  .el-empty {
    height: 100%;
  }
}
</style>
