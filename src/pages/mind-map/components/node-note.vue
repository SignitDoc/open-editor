<template>
  <el-dialog
    class="node-note-dialog"
    title="插入备注"
    v-model="visible"
    width="50%"
    top="15vh"
    append-to-body
  >
    <el-input
      type="textarea"
      :autosize="{ minRows: 3, maxRows: 5 }"
      placeholder="请输入内容"
      v-model="noteState.note"
    >
    </el-input>
    <div class="node-editor" ref="nodeEditor" @keyup.stop @keydown.stop></div>
    
    <template #footer >
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">
       确定
   </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref,computed,reactive, watch,nextTick} from 'vue'
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
const noteState = reactive({
  note: '',
  editor: null
})

const handleShowNodeNote = () => {
  noteState.note = activeNodes.value[0].getData('note') || ''
}

const cancel = () => {
  visible.value = false
}

const confirm = () => {
  activeNodes.value.forEach(node => {
    node.setNote(noteState.note)
  })
  cancel()
}

watch(()=>visible.value,(val)=>{
  if(val){
    handleShowNodeNote()
  }
 
}, {immediate:true})

</script>

<style lang="less" scoped>
.node-note-dialog {
  .tip {
    margin-top: 5px;
    color: #dcdfe6;
  }
}
</style>
