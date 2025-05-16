<template>
  <div
    class="contextmenuContainer listBox"
    v-if="contentMenu.isShow"
    ref="contextmenuRef"
    :style="{ left: contentMenu.left + 'px', top: contentMenu.top + 'px' }"
    :class="{ isDark: isDark }"
  >
    <template v-if="contentMenu.type === 'node'">
      <div
        class="item"
        @click="execCommand('INSERT_NODE', insertNodeBtnDisabled)"
        :class="{ disabled: insertNodeBtnDisabled }"
      >
        <span class="name">插入同级节点</span>
        <span class="desc">Enter</span>
      </div>
      <div class="item" @click="execCommand('INSERT_CHILD_NODE')" :class="{ disabled: isGeneralization }">
        <span class="name">插入子级节点</span>
        <span class="desc">Tab</span>
      </div>
      <div class="item" @click="execCommand('INSERT_PARENT_NODE')" :class="{ disabled: insertNodeBtnDisabled }">
        <span class="name">插入父节点</span>
        <span class="desc">Shift + Tab</span>
      </div>
      <div class="item" @click="execCommand('ADD_GENERALIZATION')" :class="{ disabled: insertNodeBtnDisabled }">
        <span class="name">插入概要</span>
        <span class="desc">Ctrl + G</span>
      </div>
      <div class="item" @click="execCommand('UP_NODE')" :class="{ disabled: upNodeBtnDisabled }">
        <span class="name">上移节点</span>
        <span class="desc">Ctrl + ↑</span>
      </div>
      <div class="item" @click="execCommand('DOWN_NODE')" :class="{ disabled: downNodeBtnDisabled }">
        <span class="name">下移节点</span>
        <span class="desc">Ctrl + ↓</span>
      </div>
      <div class="item danger" @click="execCommand('REMOVE_NODE')">
        <span class="name">删除节点</span>
        <span class="desc">Delete</span>
      </div>
      <div class="item danger" @click="execCommand('REMOVE_CURRENT_NODE')">
        <span class="name">仅删除当前节点</span>
        <span class="desc">Shift + Backspace</span>
      </div>
      <div class="item" @click="execCommand('COPY_NODE')" :class="{ disabled: isGeneralization }">
        <span class="name">复制节点</span>
        <span class="desc">Ctrl + C</span>
      </div>
      <div class="item" @click="execCommand('CUT_NODE')" :class="{ disabled: isGeneralization }">
        <span class="name">剪切节点</span>
        <span class="desc">Ctrl + X</span>
      </div>
      <div class="item" @click="execCommand('PASTE_NODE')">
        <span class="name">粘贴节点</span>
        <span class="desc">Ctrl + V</span>
      </div>
      <div class="item" @click="execCommand('REMOVE_CUSTOM_STYLES')">
        <span class="name">一键去除自定义样式</span>
      </div>
      <div class="item" @click="execCommand('EXPORT_CUR_NODE_TO_PNG')">
        <span class="name">导出该节点为图片</span>
      </div>
    </template>
    <template v-if="contentMenu.type === 'svg'">
      <div class="item" @click="execCommand('RETURN_CENTER')">
        <span class="name">回到根节点</span>
        <span class="desc">Ctrl + Enter</span>
      </div>
      <div class="item" @click="execCommand('EXPAND_ALL')">
        <span class="name">展开所有</span>
      </div>
      <div class="item" @click="execCommand('UNEXPAND_ALL')">
        <span class="name">收起所有</span>
      </div>
      <div class="item">
        <span class="name">展开到</span>
        <span class="el-icon-arrow-right"></span>
        <div class="subItems listBox" :class="{ isDark: isDark }">
          <div
            class="item"
            v-for="(item, index) in expandOptions"
            :key="item"
            @click="execCommand('UNEXPAND_TO_LEVEL', false, index + 1)"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <div class="item" @click="execCommand('RESET_LAYOUT')">
        <span class="name">一键整理布局</span>
        <span class="desc">Ctrl + L</span>
      </div>
      <div class="item" @click="execCommand('FIT_CANVAS')">
        <span class="name">适应画布</span>
        <span class="desc">Ctrl + i</span>
      </div>
      <div class="item" @click="execCommand('TOGGLE_ZEN_MODE')">
        <span class="name">禅模式</span>
        <!-- {{ isZenMode ? "√" : "" }} -->
      </div>
      <div class="item" @click="execCommand('REMOVE_ALL_NODE_CUSTOM_STYLES')">
        <span class="name">一键去除所有节点自定义样式</span>
      </div>
      <div class="item">
        <span class="name">复制到剪贴板</span>
        <span class="el-icon-arrow-right"></span>
        <div class="subItems listBox" :class="{ isDark: isDark }">
          <div class="item" v-for="item in renderCopyList" :key="item.value" @click="copyToClipboard(item.value)">
            {{ item.name }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getTextFromHtml } from "simple-mind-map/src/utils"
import { transformToMarkdown } from "simple-mind-map/src/parse/toMarkdown"
import { transformToTxt } from "simple-mind-map/src/parse/toTxt"
import { useMindMapStore, copyToClipboardFn } from "../config"
import { ref, computed } from "vue"
import {concat} from 'lodash'
import {copyOptions,expandOptions} from '../constant'

const isDark = ref(false)
const mindMapStore = useMindMapStore()
const mindMap = computed(() => {
  return mindMapStore.mindMap as any
})

const contentMenu = computed(() => mindMapStore.contentMenu)

const currentNode = computed(() => mindMapStore.contentMenu.currentNode||{})
//隐藏右键菜单
const hide = () => {
  mindMapStore.resetContentMenu()
}

const isGeneralization = computed(() => currentNode.value?.isGeneralization)

const insertNodeBtnDisabled = computed(
  () => !currentNode.value || currentNode.value?.isGeneralization || currentNode.value?.isRoot
)

//上移
const upNodeBtnDisabled = computed(() => {
  if (insertNodeBtnDisabled.value) return true
  let isFirst =
    currentNode.value?.parent?.children.findIndex(item => {
      return item === contentMenu.value.currentNode
    }) === 0
  return isFirst
})

//下移
const downNodeBtnDisabled=computed(()=>{
  if (insertNodeBtnDisabled.value) return true
  let children =  currentNode.value.parent.children
      let isLast =
        children.findIndex(item => {
          return item ===  currentNode.value
        }) ===
        children.length - 1
      return isLast

})

// 执行命令
const execCommand = (key:string, disabled?:boolean,...arg) => {
  if (disabled) {
    return
  }
  switch (key) {
    case "COPY_NODE":
      mindMap.value.renderer.copy()
      break
    case "CUT_NODE":
      mindMap.value.renderer.cut()
      break
    case "PASTE_NODE":
      mindMap.value.renderer.paste()
      break
    case "RETURN_CENTER":
      mindMap.value.renderer.setRootNodeCenter()
      break
    case "FIT_CANVAS":
      mindMap.value.view.fit()
      break
    case "REMOVE_HYPERLINK":
      currentNode.value.setHyperlink("", "")
      break
    case "REMOVE_NOTE":
      currentNode.value.setNote("")
      break
    case "EXPORT_CUR_NODE_TO_PNG":
      mindMap.value.export("png", true, getTextFromHtml(currentNode.value.getData("text")), false, currentNode.value)
      break
    default:
      mindMap.value.execCommand(key)
      break
  }
  hide()
}

/*========================================粘贴节点========================================*/
const enableCopyToClipboardApi = ref(navigator.clipboard)

const renderCopyList = computed(() => {
  if (!enableCopyToClipboardApi.value) {
    return concat([{
      name: "图片",
      value: "png"
    }])(copyOptions)
  }
  return copyOptions 
})
const copyToClipboard = (type: string) => {
  try {
    hide()
    let data = null
    let dataString = ""
    switch (type) {
      case "smm":
      case "json":
        data = mindMap.value.getData(true)
        dataString = JSON.stringify(data)
        break
      case "md":
        data = mindMap.value.getData()
        dataString = transformToMarkdown(data)
        break
      case "txt":
        data = mindMap.value.getData()
        dataString = transformToTxt(data)
        break
      case "png":
        break
      default:
        break
    }
    if (dataString) {
      copyToClipboardFn(dataString)
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="less" scoped>
.listBox {
  width: 250px;
  background: #fff;
  box-shadow: 0 4px 12px 0 hsla(0, 0%, 69%, 0.5);
  border-radius: 4px;
  padding-top: 16px;
  padding-bottom: 16px;

  &.isDark {
    background: #363b3f;
  }
}
.contextmenuContainer {
  position: fixed;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #1a1a1a;

  &.isDark {
    color: #fff;

    .item {
      &:hover {
        background: hsla(0, 0%, 100%, 0.05);
      }
    }
  }

  .item {
    position: relative;
    height: 28px;
    padding: 0 16px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.danger {
      color: #f56c6c;
    }

    &:hover {
      background: #f5f5f5;

      .subItems {
        visibility: visible;
      }
    }

    &.disabled {
      color: grey;
      cursor: not-allowed;
      pointer-events: none;

      &:hover {
        background: #fff;
      }
    }

    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .desc {
      color: #999;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .subItems {
      position: absolute;
      left: 100%;
      top: 0;
      visibility: hidden;
      width: 150px;
    }
  }
}
</style>
