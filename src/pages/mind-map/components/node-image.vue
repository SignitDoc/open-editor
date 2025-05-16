<template>
  <el-dialog
    class="nodeimage-dialog"
    title="插入图片"
    v-model="visible"
    width="50%"
    top="15vh"
    append-to-body
  >
    <div class="title">方式一</div>
    <ImgUpload
      ref="ImgUploadRef"
      v-model:data="imgState.img"
      style="margin-bottom: 12px;"
  />
    <div class="title">方式二</div>
    <div class="input-content">
      <span class="label">请输入图片地址</span>
      <el-input
        v-model="imgState.imgUrl"
        placeholder="http://xxx.com/xx.jpg"
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
import ImgUpload from './img-upload.vue'
import { getImageSize } from 'simple-mind-map/src/utils/index'
import {ref,reactive,computed,watch} from 'vue'
import { useMindMapStore } from "../config"

const props = defineProps<{
  visible: boolean
}>()

const emits=defineEmits(['update:visible'])

const visible=computed({
  get:()=>props.visible,
  set:(val:boolean)=>emits('update:visible',val)
})
const mindMapStore = useMindMapStore()

const activeNodes = computed(() => {
  return mindMapStore.activeNodes
})

const imgState = reactive({
  img: '',
  imgUrl: '',
  imgTitle: '',
})


const ImgUploadRef=ref()

// 取消插入图片
const cancel = () => {
  visible.value = false
  imgState.img = ''
  imgState.imgTitle = ''
  imgState.imgUrl = ''
}

// 确认插入图片
const confirm=async()=>{
  try {
    // 删除图片
    if (!imgState.img && !imgState.imgUrl) {
      cancel()
      activeNodes.value.forEach(node => {
        node.setImage(null)
      })
      return
    }
    let res = null
    let img = ''
    if (imgState.img) {
      img = imgState.img
      res = await ImgUploadRef.value.getSize()
    } else if (imgState.imgUrl) {
      img = imgState.imgUrl
      res = await getImageSize(img)
    }
    activeNodes.value.forEach(node => {
      node.setImage({
        url: img || 'none',
        title: imgState.imgTitle,
        width: res.width,
        height: res.height
      })
    })
    cancel()
  } catch (error) {
    console.log(error)
  }
}

// 显示节点图片
const handleShowNodeImage=()=>{
  imgState.img = ''
  imgState.imgTitle = ''
  imgState.imgUrl = ''
  if (activeNodes.value.length > 0) {
    let firstNode = activeNodes.value[0]
    let img = firstNode.getData('image') || ''
    if (img) {
      if (/^https?:\/\//.test(img)) {
        imgState.imgUrl = img
      } else {
        imgState.img = img
      }
    }
    imgState.imgTitle = firstNode.getData('imageTitle') || ''
  }
}

watch(()=>visible.value,(val)=>{
  if(val){
    handleShowNodeImage()
  }
},{
  immediate:true
})

</script>

<style lang="less" scoped>
.nodeimage-dialog {
  .title {
    padding-bottom: 12px;
    font-weight: bold;
  }

  .input-content {
    display: flex;
    align-items: center;

    .label {
      font-size: 12px;
      width: 150px;
      display: inline-block;
    }
  }
}
</style>
