<template>
  <div class="img-upload-container">
    <div class="img-upload-panel">
      <div class="upload-content" v-if="!data">
        <label
          for="imgUploadInput"
          class="img-upload-input-area"
          @dragenter.stop.prevent
          @dragover.stop.prevent
          @drop.stop.prevent="onDrop"
          >点击此处选择图片、或拖动上传</label
        >
        <input
          type="file"
          accept="image/*"
          id="imgUploadInput"
          @change="onImgUploadInputChange"
        />
      </div>
      <div v-if="data" class="upload-info-box">
        <div
          class="preview-box"
          :style="{ backgroundImage: `url('${data}')` }"
        ></div>
        <i class="delete-button ri-close-line" @click="deleteImg"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import {ref,computed} from 'vue'
import {fileToBase64} from '../config'

interface Props{
  data: string
}

const props=defineProps<Props>()
const emits=defineEmits(['change','update:data'])

const data=computed({
  get:()=>props.data,
  set:(val:string)=>emits('update:data',val)
})
const fileInfo=ref(null)

const onImgUploadInputChange=(e:any)=>{
  let file=(e.target as HTMLInputElement).files?.[0]
  selectImg(file)
}

const onDrop=(e:DragEvent)=>{
  let dt=e.dataTransfer
  let file=dt?.files?.[0]
  selectImg(file)
}

const selectImg=async(file:File|any)=>{
  fileInfo.value=file
  let base64=await fileToBase64(file)
  data.value=base64 as string
}

const getSize=()=>{
  return new Promise(resolve=>{
    let img=new Image()
    img.src=data.value
    img.onload=()=>{
      resolve({
        width:img.width,
        height:img.height
      })
    }
    img.onerror=()=>{
      resolve({
        width:0,
        height:0
      })
    }
  })
}

const deleteImg=()=>{
  emits('change','')
  fileInfo.value=null
}

defineExpose({
  getSize
})

</script>

<style lang="less" scoped>
.img-upload-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 1000;

  .img-upload-panel {
    position: relative;
    width: 100%;
    font-size: 22px;
    white-space: nowrap;
    color: #909090;
    cursor: default;
    user-select: none;
.upload-content{
  width: 100%;
}
    .title {
      margin-bottom: 15px;
      font-size: 22px;
      font-weight: 700;
      color: hsla(218, 9%, 51%, 0.8);
    }

    .closeBtn {
      position: absolute;
      right: 25px;
      top: 32px;
      cursor: pointer;
    }

    .img-upload-input-area {
      display: block;
      width: 100%;
      height: 200px;
      font-size: 20px;
      color: rgba(51, 51, 51, 0.4);
      background-color: hsla(0, 0%, 87%, 0.6);
      border: none;
      outline: none;
      cursor: pointer;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      white-space: normal;
    }

    #imgUploadInput {
      display: none;
    }

    .upload-info-box {
      position: relative;
      width: 100%;
      height: 200px;
      background-color: hsla(0, 0%, 87%, 0.6);

      .preview-box {
        width: 100%;
        height: 100%;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      .delete-button {
        position: absolute;
        right: 0px;
        top: 0px;
        cursor: pointer;
      }
    }
  }
}

</style>
