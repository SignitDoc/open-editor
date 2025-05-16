<template>
  <el-dialog
    class="node-hyperlink-dialog"
    title="插入超链接"
    v-model="visible"
    width="50%"
    top="15vh"
    append-to-body
  >
    <div class="item">
      <span class="name">链接地址</span>
      <el-input
        v-model="linkState.link"

        placeholder="请输入链接地址"
        @keyup.stop
        @keydown.stop
    />
    </div>
    <div class="item">
      <span class="name">名称</span>
      <el-input
        v-model="linkState.linkTitle"
       
        @keyup.stop
        @keydown.stop
      ></el-input>
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

const linkState = reactive({
  link: '',
  linkTitle: '',
})
const removeProtocol = (url: string) => {
  return url.replace(/^https?:\/\//, '')
}

const handleShowNodeLink = () => {
  linkState.link = activeNodes.value[0].getData('hyperlink') || ''
  linkState.linkTitle = activeNodes.value[0].getData('hyperlinkTitle') || ''
}

const cancel = () => {
  visible.value = false
}

const confirm = () => {
  activeNodes.value.forEach(node => {
    node.setHyperlink( linkState.link,
      linkState.linkTitle
    )
  })
  cancel()
}

watch(()=>visible.value,(val)=>{
  if(val){
    handleShowNodeLink()
  }
 
}, {immediate:true})

</script>

<style lang="less" scoped>
.node-hyperlink-dialog {
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .name {
      display: block;
      width: 70px;
    }
  }
}
</style>
