<template>
  <div>
    <div ref="text-bubble-menu" class="text-bubble-menu bubble-menu-cl">
      <FontFamilyEditor :editor="editor"></FontFamilyEditor>
      <el-divider direction="vertical" />
      <FontSizeEditor :editor="editor" />
      <el-divider direction="vertical" />
      <TextEditor :editor="editor" />
    </div>
    <div ref="image-bubble-menu" class="image-bubble-menu bubble-menu-cl">
      <HeaderItem type="action" desc="预览" icon="ri-eye-line" @click="showSelectImage" />
      <HeaderItem type="action" desc="下载" icon="ri-download-2-line" @click="downloadSelectImage" />
      <HeaderItem type="action" desc="删除" icon="ri-delete-bin-5-line" @click="deleteSelectImage" />
    </div>

    <!-- 预览大图 -->
    <el-image-viewer
      v-if="bigImageState.visible"
      :url-list="[bigImageState.url]"
      @close="bigImageState.visible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue"

import { Editor } from "@tiptap/vue-3"

import { HeaderItem } from "@/components"
import { DocxDocumentItem } from "@/types"
import { base64ToBlob, downloadFile } from "@/utils"

import FontFamilyEditor from "./font-family-editor.vue"
import FontSizeEditor from "./font-size-editor.vue"
import TextEditor from "./text-editor.vue"

const props = defineProps<{
  editor: Editor | undefined
  selection: Record<string, any> | undefined
  nowDoc: DocxDocumentItem
}>()

const bigImageState = reactive({
  visible: false,
  url: ""
})

// 检测当前选中对象是否时图片
const isImage = computed(() => {
  return props.editor?.isActive("image") ? true : false
})

// 预览大图
function showSelectImage() {
  bigImageState.url = props.selection?.node?.attrs?.src || ""
  bigImageState.visible = true
}

// 下载所选图片
function downloadSelectImage() {
  const blobData = base64ToBlob(props.selection?.node?.attrs?.src || "")
  downloadFile({ fileData: blobData, fileName: `${props.nowDoc.title}-图片.png`, fileType: "png" })
}

// 删除图片
function deleteSelectImage() {
  if (props.editor && isImage.value) {
    props.editor?.commands.deleteSelection()
  }
}
</script>

<style lang="less" scoped>
.bubble-menu-cl {
  padding: 5px 10px;
  background: white;
  border: 1px solid lightgray;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 5px;
  width: fit-content;
  :deep(.el-divider) {
    margin: 0px;
  }
}
</style>
