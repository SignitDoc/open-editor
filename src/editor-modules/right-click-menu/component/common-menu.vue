<template>
  <div class="menu-container common-menu">
    <ContextMenuItem @click="copyData">
      <div>复制</div>
      <template #shortcut><div>Ctrl + C</div></template>
    </ContextMenuItem>

    <ContextMenuItem @click="cutData">
      <div>剪切</div>
      <template #shortcut><div>Ctrl + X</div></template>
    </ContextMenuItem>

    <ContextMenuItem @click="pastData">
      <div>粘贴</div>
      <template #shortcut><div>Ctrl + V</div></template>
    </ContextMenuItem>

    <ContextMenuItem :disabled="!props.editor?.can().addComment()" @click="openAnnotation">
      <div>批注</div>
    </ContextMenuItem>

    <ContextMenuItem @click="addContentLibrary">
      <div>添加内容库</div>
    </ContextMenuItem>

    <!-- 添加内容库弹窗 -->
    <DialogContainer
      v-model:visible="contentLibraryState.visible"
      title="添加内容库"
      :confirm-callback="confirmAddContent"
    >
      <el-form
        ref="contentLibraryFormRef"
        label-width="80px"
        :model="contentLibraryState.form"
        :rules="addContentRules"
      >
        <el-form-item label="内容名称" prop="name">
          <el-input v-model="contentLibraryState.form.name" placeholder="请输入该段内容的名称" />
        </el-form-item>
        <el-form-item label="文件夹" prop="folderId">
          <el-select v-model="contentLibraryState.form.folderId" placeholder="请选择该内容的文件夹">
            <el-option
              v-for="item in contentLibraryState.folderOptions"
              :key="item.id"
              :value="item.id"
              :label="item.folderName"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </DialogContainer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import { Editor } from "@tiptap/vue-3"
import { useClipboard } from "@vueuse/core"
import { ContextMenuItem, DialogContainer } from "@/components/index"
import { useGlobalStore } from "@/store"
import useDocumentStore from "@/store/documentStore"
import { ElMessage } from "element-plus"
import { ContentFolderItem } from "@/types"

const globalStore = useGlobalStore()
const documentStore = useDocumentStore()

const props = defineProps<{
  editor: Editor | undefined
}>()

let cursorTxt = ""

// 复制
function copyData() {
  const { copy } = useClipboard({})
  copy(cursorTxt)
}

// 粘贴
function pastData() {
  props.editor?.commands.insertContent(cursorTxt)
}

// 剪切
function cutData() {
  props.editor?.commands.deleteSelection()
}

onMounted(() => {
  setTimeout(() => {
    if (props.editor)
      props.editor.on("selectionUpdate", editor => {
        updateSelectedText(editor)
      })
  })
})

// 选中的文本
function updateSelectedText(editor) {
  const selection = window.getSelection()
  if (selection?.toString()) {
    cursorTxt = selection.toString()
  }
}

// 打开批注弹窗
function openAnnotation() {
  globalStore.$patch({ annotationVisible: true })
}

/*========================内容库=========================*/
const contentLibraryFormRef = ref()
const contentLibraryState = reactive({
  visible: false,
  folderOptions: [] as Array<ContentFolderItem>,
  form: {
    name: "",
    folderId: ""
  }
})

const addContentRules = {
  name: [{ required: true, message: "请输入内容名称", trigger: "blur" }],
  folderId: [{ required: true, message: "请选择需要存储的文件夹位置", trigger: "blur" }]
}

// 打开添加内容库弹窗
function addContentLibrary() {
  contentLibraryState.form.name = ""
  contentLibraryState.form.folderId = ""
  contentLibraryState.visible = true
  contentLibraryState.folderOptions = documentStore.contentLibrary
}

// 确认添加内容库
function confirmAddContent() {
  if (!contentLibraryFormRef.value) return
  contentLibraryFormRef.value.validate(valid => {
    if (!valid) return
    try {
      props.editor?.commands.addContentLibrary(contentLibraryState.form.folderId, contentLibraryState.form.name)
      ElMessage.success("添加成功")
      contentLibraryState.visible = false
    } catch (err) {
      ElMessage.error("添加失败")
    }
  })
}
</script>

<style lang="less" scoped>
.common-menu {
  display: flex;
  flex-direction: column;
}
</style>
