<template>
  <el-dialog
    class="node-tag-dialog"
    title="插入标签"
    v-model="visible"
    width="50%"
    top="15vh"
    append-to-body
  >
    <el-input
      v-model="tagState.tag"
      @keyup.enter="add"
      @keyup.stop
      @keydown.stop
      :disabled="tagState.tags.length >= tagState.maxTagsLength"
      placeholder="请按回车键添加"
    >
    </el-input>
    <div class="tag-list">
      <div
        class="tag-item"
        v-for="(item, index) in tagState.tags"
        :key="index"
        :style="{
          backgroundColor: generateColorByContent(item)
        }"
      >
        {{ typeof item === 'string' ? item : item.text }}
        <div class="delete-button" @click="del(index)">
          <i class="ri-close-line"></i>
        </div>
      </div>
    </div>
    
    <template #footer >
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">
       确定
   </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  generateColorByContent
} from 'simple-mind-map/src/utils/index'
import {ref,computed,reactive, watch} from 'vue'
import { useMindMapStore } from "../config"

const props = defineProps<{
  visible: boolean
}>()

const mindMapStore = useMindMapStore()

const activeNodes = computed(() => {
  return mindMapStore.activeNodes
})
const emits=defineEmits(['update:visible'])
const visible=computed({
  get:()=>props.visible,
  set:(val:boolean)=>emits('update:visible',val)
})

const tagState = reactive({
  tags: [], // 所有的标签
  tag: '', // 当前输入的标签
  maxTagsLength: 5, // 最多添加5个标签
})

const handleShowNodeTag = () => {
  console.log('val',mindMapStore.activeNodes, activeNodes.value[0]?.getData())

  tagState.tags = activeNodes.value[0]?.getData('tag') || []
}

const add = () => {
  tagState.tags.push(tagState.tag)
  tagState.tag = ''
}

const del = (index: number) => {
  tagState.tags.splice(index, 1)
}
const cancel = () => {
  visible.value = false
  tagState.tags = []
  tagState.tag = ''
}

const confirm = () => {
  activeNodes.value.forEach(node => {
    console.log('tagState.tags',node)
    node.setTag(tagState.tags)
  })
  cancel()
}

watch(()=>visible.value,(val)=>{
  if(val){
    handleShowNodeTag()
  }
 
}, {immediate:true})
</script>

<style lang="less" scoped>
.node-tag-dialog {
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 5px;

    .tag-item {
      position: relative;
      padding: 3px 5px;
      margin-right: 5px;
      margin-bottom: 5px;
      color: #fff;

      .delete-button {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        visibility: hidden;
      }

      &:hover {
        .delete-button {
          visibility: visible;
        }
      }
    }
  }
}
</style>
