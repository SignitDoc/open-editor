<template>
  <PageHeader
    v-model:doc="docState"
    show-more-actions
    :save="() => handleSave(DocumentActionEnum.Edit)"
    :edit="!documentStore.preview"
    :save-loading="actionType === DocumentActionEnum.Edit && saveLoading"
  >
    <template #headerAction>
      <el-button
        v-if="showGoEdit"
        type="primary"
        :icon="h('i', { class: 'ri-edit-2-line' })"
        @click="$router.push(`/${props.nowDoc.type}-edit?id=${$route.query.id}`)"
      >
        前往编辑
      </el-button>
    </template>

    <template #dropdown>
      <!-- <ContextMenuItem @click="console.log(editor?.getJSON())">输出JSON</ContextMenuItem> -->

      <!-- <ContextMenuItem @click="console.log(editor?.getHTML())">输出HTML</ContextMenuItem> -->

      <ContextMenuItem @click="convertDocx">导出DOCX</ContextMenuItem>

      <ContextMenuItem
        v-if="!documentStore.preview"
        @click="handleSave(DocumentActionEnum.Release)"
        :loading="actionType === DocumentActionEnum.Release && saveLoading"
      >
        <span>生成版本</span>
      </ContextMenuItem>

      <HtmlToPdf :now-doc="$props.nowDoc" />

      <ContextMenuItem @click="openHistoryList">
        <span>历史记录</span>
      </ContextMenuItem>
    </template>
  </PageHeader>
</template>

<script setup lang="ts">
import { ref, h, computed } from "vue"
import { asBlob } from "html-docx-js-typescript"
import { useRouter } from "vue-router"

import PageHeader from "./index.vue"

import { ContextMenuItem } from "@/components"
import { HtmlToPdf } from "@/editor-functions"
import { DocumentActionEnum } from "@/enum"
import { useSaveWord } from "@/hooks"
import { useDocumentStore } from "@/store"
import { DocumentActionType, DocxDocumentItem } from "@/types"
import { downloadFile, Message } from "@/utils"

import { Editor } from "@tiptap/vue-3"

const router = useRouter()

const documentStore = useDocumentStore()

interface PropsType {
  editor: Editor | undefined
  sideToolbarRef: Record<string, any> | undefined
  nowDoc: DocxDocumentItem
}

const props = withDefaults(defineProps<PropsType>(), {})

const emits = defineEmits(["update:nowDoc", "update:actionType"])

const showGoEdit = computed(() => {
  return router.currentRoute.value.path === "/word-view"
})

const docState = computed({
  get: () => props.nowDoc,
  set: val => emits("update:nowDoc", val)
})

function setTitle(title) {
  docState.value.title = title
  emits("update:nowDoc", docState.value)
}

/* =========================== 保存 ===========================*/
// 暂存
const saveLoading = ref(false)
const actionType = ref<DocumentActionType>(DocumentActionEnum.Edit)
function handleSave(type: DocumentActionType, content = "" as "" | Array<Record<string, any>>, title = "") {
  // 存储文本

  if (!content) content = (props.editor?.getJSON() as Array<Record<string, any>>) || ""
  if (!title) title = props.nowDoc.title

  actionType.value = type

  useSaveWord(type, title, content, saveLoading, props.nowDoc, props.nowDoc.type, document => {
    Message.success("保存成功")
    emits("update:nowDoc", { ...document })
  })
}

/* =========================== 其他操作 ===========================*/
// 测试按钮
function handleTest() {
  props.editor?.commands?.insertContent("123")
}

function openHistoryList() {
  props.sideToolbarRef?.openHistoryList()
}

// html转docx
async function convertDocx() {
  if (!props.editor) return
  const file = await asBlob(props.editor.getHTML())
  downloadFile({ fileData: file, fileName: `${docState.value.title}.docx`, fileType: "docx" })
}

defineExpose({ setTitle, handleSave })
</script>

<style lang="less" scoped>
.editable-switch {
  margin-right: 12px;
}
</style>
