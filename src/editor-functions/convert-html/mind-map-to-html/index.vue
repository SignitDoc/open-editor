<template>
  <el-upload
    class="popover-button-item"
    :auto-upload="false"
    :show-file-list="false"
    :on-change="handleConvert"
    accept=".xmind,.smm,.json,.md"
  >
    <div type="primary">思维导图</div>
  </el-upload>
</template>

<script setup lang="ts">
import type { UploadFile } from "element-plus"
import { parseXmindFile } from "@/utils"
import markdown from "simple-mind-map/src/parse/markdown.js"

const props = defineProps<{
  createMindMap: (data) => void
}>()
function handleConvert(file: UploadFile) {
  let reg = /\.(smm|xmind|json|xlsx|md)$/
  if (!reg.test(file.name)) {
    alert("请选择.smm、.json、.xmind、.xlsx、.md文件")
    return
  }
  if (/\.(smm|json)$/.test(file.name)) {
    handleJSON(file)
  } else if (/\.xmind$/.test(file.name)) {
    handleXmind(file.raw)
  } else if (/\.md$/.test(file.name)) {
    handleMd(file)
  }
}

// 处理.xmind文件
const handleXmind = async file => {
  try {
    let data = await parseXmindFile(file)
    console.log("解析xmind", data)
    if (typeof data !== "object") {
        throw new Error("文件内容有误")
      }
    props.createMindMap({
      title: data?.title,
      root: data?.content
    })
  } catch (error) {
    console.log(error)
  }
}

// 处理.smm、.json文件
const handleJSON = file => {
  let fileReader = new FileReader()
  fileReader.readAsText(file.raw)
  fileReader.onload = evt => {
    try {
      let data = JSON.parse(evt.target.result)
      if (typeof data !== "object") {
        throw new Error("文件内容有误")
      }
      console.log("解析json", data)

      props.createMindMap({
        ...data,
        title:data?.root?.data?.text
      })
    } catch (error) {
      console.log(error)
    }
  }
}

// 处理markdown文件
const handleMd = async file => {
  //读取file文件
  let fileReader = new FileReader()
  fileReader.readAsText(file.raw)
  fileReader.onload = evt => {
    try {
      let data = markdown.transformMarkdownTo(evt.target.result)
      console.log("解析Md", data)
      props.createMindMap({
        root: data,
        title: data.data.text
      })
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style lang="less" scoped>
:deep(.el-upload) {
  width: 100%;
  justify-content: flex-start;
  padding: 5px;
  box-sizing: border-box;
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}
:deep(.div) {
  width: 100%;
}
</style>
