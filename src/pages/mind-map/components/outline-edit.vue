<template>
  <div class="outline-edit-container" :class="{ isDark: isDark }" ref="outlineEditContainer">
    <div class="close-button" @click="onClose">
      <span class="icon ri-close-line"></span>
    </div>
    <div class="outline-edit-box" ref="outlineEditBox">
      <div class="outline-edit">
        <el-tree
          ref="treeRef"
          class="outline-tree"
          node-key="uid"
          draggable
          default-expand-all
          :class="{ isDark: isDark }"
          :data="treeData"
          :props="defaultProps"
          :highlight-current="true"
          :expand-on-click-node="false"
          :allow-drag="checkAllowDrag"
          @node-drop="onNodeDrop"
          @current-change="onCurrentChange"
        >
          <template #default="{ node, data }">
            <span class="custom-node" :data-id="data.uid">
              <span
                class="node-edit"
                @blur="onBlur($event, node)"
                @keydown.stop="onNodeInputKeydown($event, node)"
                @keyup.stop
                :contenteditable="!mindMapStore.isReadonly"
                :key="getRandomId()"
                >{{ node.label }}</span
              >
            </span>
          </template>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue"
import { cloneDeep } from "lodash"
import {
  useMindMapStore,
  htmlEscape,
  getTextFromHtml,
  nodeRichTextToTextWithWrap,
  textToNodeRichTextWithWrap
} from "../config"
import { v4 as uuid } from "uuid"

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(["update:visible"])

const getRandomId = () => uuid()
const mindMapStore = useMindMapStore()
const isDark = ref(false)

const mindMap = computed(() => mindMapStore.mindMap)

const currentData = ref(null)

/*====================================大纲树====================================*/
const treeRef = ref(null)

const treeData = ref()

const outlineEditContainer = ref(null)

const outlineEditBox = ref(null)

onMounted(() => {
  window.addEventListener("keydown", onKeyDown)
  getTreeData()
  console.log("asdf", treeData.value)
})

const getTreeData = () => {
  let initialData = mindMapStore.mindMap.getData()
  initialData.root = true // 标记根节点
  let walk = root => {
    let text = root.data.richText ? nodeRichTextToTextWithWrap(root.data.text) : root.data.text
    text = htmlEscape(text)
    text = text.replaceAll(/\n/g, "<br>")
    root.textCache = text // 保存一份修改前的数据，用于对比是否修改了
    root.label = text
    root.uid = root.data.uid
    if (root.children && root.children.length > 0) {
      root.children.forEach(item => {
        walk(item)
      })
    }
  }
  walk(initialData)
  treeData.value = [initialData]
}

//卸载事件
onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown)
})

// 删除节点
const onKeyDown = e => {
  if ([46, 8].includes(e.keyCode) && currentData.value) {
    e.stopPropagation()
    treeRef.value.remove(currentData.value)
    currentData.value = null
    save()
  }
}

//拖动节点
const checkAllowDrag = node => {
  return !node.data.root
}

const onCurrentChange = data => {
  currentData.value = data
}

// 拖拽结束
const onNodeDrop = () => {
  save()
}

//失去焦点时，更新
const onBlur = (e, node) => {
  // 如果没有修改，不更新
  if (e.target.innerText === node.textCache) {
    return
  }
  let richText = node.data.data.richText
  const text = richText ? e.target.innerHTML : e.target.innerText
  node.data.data.text = richText ? textToNodeRichTextWithWrap(text) : text
  if (richText) node.data.data.resetRichText = true
  node.data.textCache = e.target.innerHTML
  save()
}

// 节点输入区域按键事件
const onNodeInputKeydown = (e, node) => {
  const richText = !!node.data.data.richText
  const uid = uuid()
  const text = "分支节点"
  const data = {
    textCache: text,
    uid,
    label: text,
    data: {
      text: richText ? textToNodeRichTextWithWrap(text) : text,
      uid,
      richText
    },
    children: []
  }
  if (richText) {
    data.data.resetRichText = true
  }
  if (e.keyCode === 13 && !e.shiftKey) {
    e.preventDefault()
    if (node.data.root) {
      return
    }
    treeRef.value.insertAfter(data, node)
  }
  if (e.keyCode === 9) {
    e.preventDefault()
    if (e.shiftKey) {
      // 上移一个层级
      treeRef.value.insertAfter(node.data, node.parent)
      treeRef.value.remove(node)
    } else {
      treeRef.value.append(data, node)
    }
  }
  save()
  nextTick(() => {
    treeRef.value.setCurrentKey(uid)
    const el = document.querySelector(`.custom-Node[data-id="${uid}"] .node-dit`)
    if (el) {
      let selection = window.getSelection()
      let range = document.createRange()
      range.selectNodeContents(el)
      selection.removeAllRanges()
      selection.addRange(range)
      let offsetTop = el.offsetTop
      scrollTo(offsetTop)
    }
  })
}

// 滚动到指定位置
const scrollTo = offsetTop => {
  const container = outlineEditBox.value
  let containerHeight = container.offsetHeight
  let top = container.scrollTop
  offsetTop += 50
  if (offsetTop > top + containerHeight) {
    container.scrollTo(0, offsetTop - containerHeight / 2)
  }
}

//拦截粘贴
const onPaste = e => {
  e.preventDefault()
  const selection = window.getSelection()
  if (!selection.rangeCount) {
    return
  }
  selection.deleteFromDocument()
  const text = e.clipboardData.getData("text")
  //去除格式
  const textWithoutFormat = getTextFromHtml(text)
  //去除换行
  const textWithoutLineBreak = textWithoutFormat.replaceAll(/\n/g, "")
  const node = document.createTextNode(textWithoutLineBreak)
  selection.getRangeAt(0).insertNode(node)
  selection.collapseToEnd()
}

// 关闭
const onClose = () => {
  emit("update:visible", false)
}
const getData = () => {
  let newNode = {}
  let node = treeData.value?.[0]
  let walk = (root, newRoot) => {
    newRoot.data = root.data
    newRoot.children = []
    root.children?.forEach(child => {
      const newChild = {}
      newRoot.children.push(newChild)
      walk(child, newChild)
    })
  }
  walk(node, newNode)
  return cloneDeep(newNode)
}

// 保存
const save = () => {
  const data = getData()
  mindMapStore.saveMindMapData(data)
}
</script>

<style lang="less" scoped>
.outline-edit-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: #fff;
  overflow: hidden;

  &.isDark {
    background-color: #262a2e;

    .close-button {
      .icon {
        color: #fff;
      }
    }
  }

  .close-button {
    position: absolute;
    right: 40px;
    top: 20px;
    cursor: pointer;

    .icon {
      font-size: 28px;
    }
  }

  .outline-edit-box {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 50px 0;

    .outline-edit {
      width: 1000px;
      height: 100%;
      height: max-content;
      margin: 0 auto;

      :deep(.custom-node) {
        .node-edit {
          max-width: 800px;
        }
      }
      .outline-tree {
        &.isDark {
          background-color: #262a2e;

          .custom-node {
            color: #fff;
          }
        }

        :deep(.el-tree-node) {
          .el-tree-node__children {
            overflow: inherit;
          }
        }
        :deep(.el-tree-node__content) {
          height: auto;
          margin: 5px 0;
        }
        :deep(.el-tree-node__expand-icon) {
          color: #262a2e;

          &.is-leaf {
            color: transparent;
            position: relative;

            &::after {
              background-color: #262a2e;
              position: absolute;
              content: "";
              width: 5px;
              height: 5px;
              border-radius: 50%;
              left: 10px;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }
      }
    }
  }
}

.custom-node {
  width: 100%;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;

  .node-edit {
    outline: none;
    white-space: normal;
    padding-right: 20px;
  }
}
</style>
