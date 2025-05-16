<template>
  <DialogContainer title="插入超链接" v-model:visible="dialogVisible" :width="510" :confirm-callback="insertHyperlink">
    <el-form label-width="48px">
      <el-form-item label="名称:">
        <el-input v-model="hyperlinkForm.name"></el-input>
      </el-form-item>
      <el-form-item label="URL:">
        <el-input v-model="hyperlinkForm.url"></el-input>
      </el-form-item>
    </el-form>
  </DialogContainer>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue"
import type { Editor } from "@tiptap/vue-3"
import { DialogContainer } from "../components"

const props = defineProps<{
  editor: Editor | undefined
  visible: boolean
}>()

const emits = defineEmits(["update:visible"])

const dialogVisible = computed({
  get: () => props.visible,
  set: val => emits("update:visible", val)
})

const hyperlinkForm = reactive({
  name: "",
  url: ""
})

// 插入超链接
function insertHyperlink() {
  props.editor?.commands.insertContent(`<a href="${hyperlinkForm.url}">${hyperlinkForm.name}</a> `)
  props.editor?.commands.blur()
  emits("update:visible", false)
  hyperlinkForm.name = ""
  hyperlinkForm.url = ""
}
</script>
