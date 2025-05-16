<template>
  <div class="catalogue-list-root">
    <div v-if="!isCollapse" class="catalogue-hint" @click="handleCollapse(true)">
      <IconButton label="展开目录" icon="ri-file-list-2-line" size="18px" />
    </div>

    <div class="catalogue-container" id="catalogue-container">
      <div class="list-hint">
        <div>目录</div>
        <IconButton @click="handleCollapse(false)" label="折叠目录" icon="ri-close-line" />
      </div>
      <el-tree
        :empty-text="`对文档内容应用标题样式\n即可生成“目录”`"
        default-expand-all
        :expand-on-click-node="false"
        :data="catalogueState.treeData"
        :props="catalogueProps"
        @node-click="chooseHeading"
      >
        <template #default="{ node }">
          <!-- 之后替换成vue3组件库的OverflowTooltip -->
          <div class="tree-label">{{ node.label }}</div>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref, watch } from "vue"
import { Editor } from "@tiptap/vue-3"
import { IconButton } from "@/components"
import { v4 as uuid } from "uuid"
import { cloneDeep, findLastIndex } from "lodash"

/*=====================获取标题列表========================*/
const props = defineProps({
  editor: { type: Editor },
  isHeadingChange: { type: Boolean },
  isCatalogCollapse: { type: Boolean }
})

const catalogueProps = {
  children: "children",
  label: "label"
}
const catalogueState = reactive({
  treeData: [] as Array<catalogueDataType>
})

watch(
  () => props.isHeadingChange,
  () => {
    nextTick(() => {
      getHeadingList()
    })
  }
)

type catalogueDataType = {
  index: number
  label: string | undefined
  children: Array<catalogueDataType>
  level: number
}

// 获取标题列表
function getHeadingList() {
  const editorJSON = props.editor?.getJSON()
  const contentArray = editorJSON?.content || []

  const headingArray: Array<any> = cloneDeep(contentArray.filter(item => item.type === "heading"))
  if (headingArray.length === 0) return (catalogueState.treeData = [])
  headingArray.forEach(item => (item.attrs.id = uuid()))
  const lineResult: Array<any> = [] //线性结果
  // 置入parentID并推入线形结果中
  headingArray.forEach((item, index) => {
    item.attrs.index = index
    if (lineResult.length > 0) {
      // parent：顺序排列中，lineResult的最后一个level小于当前标题level的
      const parentIndex = findLastIndex(lineResult, function (temp) {
        return temp.attrs.level < item.attrs.level
      })
      if (parentIndex !== -1) item.attrs.parentId = lineResult[parentIndex].attrs.id
    }
    lineResult.push(item)
  })

  // 线形结构转树形结构(倒序寻找当前节点的所有子节点)
  lineResult.reverse()
  const result: Array<catalogueDataType> = lineResult.reduce((data, current) => {
    // 寻找当前节点的子节点
    const children = lineResult
      .filter(item => item.attrs.parentId === current.attrs.id)
      .map((item, index) => {
        const labelString = item.content?.reduce((label, currentValue) => {
          label += currentValue.text
          return label
        }, "")
        return {
          label: labelString,
          level: item.attrs.level,
          index: item.attrs.index,
          children: item.children
        }
      })
      // filter寻找到的children是倒序的，需要再次reverse转换回正确顺序
      .reverse()
    // 需要同时记录到自身的children中，否则他的父节点存入当前节点时无法获取当前节点的子节点和孙子节点
    current.children = children

    // 如果当前节点没有parentId，则该节点为根节点，直接推入结果中
    if (!current.attrs.parentId) {
      const labelString = current.content?.reduce((label, currentValue) => {
        label += currentValue.text
        return label
      }, "")
      data.push({
        label: labelString,
        level: current.attrs.level,
        index: current.attrs.index,
        children: children
      })
    }
    return data
  }, [])

  // 倒序寻找出来的结果也是倒序的，需要再次reverse转换回正确顺序
  result.reverse()
  catalogueState.treeData = result
}

/*=====================展开和关闭========================*/
const isCollapse = ref(true)

function handleCollapse(collapse: boolean) {
  setTimeout(
    () => {
      isCollapse.value = collapse
      emits("update:isCatalogCollapse", collapse)
    },
    collapse ? 0 : 500
  )
  const dom = document.getElementById("catalogue-container") as HTMLElement
  dom.style.width = collapse ? "265px" : "0px"
}

/*=====================点击editor跳转heading========================*/
const emits = defineEmits(["locateHeading", "update:isCatalogCollapse"])
function chooseHeading(e: object) {
  emits("locateHeading", e)
}
</script>

<style scoped>
.catalogue-list-root {
  position: relative;
  width: 100%;
  height: 100%;

  .catalogue-hint {
    position: absolute;
    z-index: 1;
    height: fit-content;
    top: 0px;
    bottom: 0px;
    margin: auto;
    cursor: pointer;
    padding: 8px 4px;
    background-color: #fff;
    border-radius: 0px 4px 4px 0px;
    color: #aaa;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-tree {
    flex: 1;
    background: none;
    --el-tree-node-hover-bg-color: rgba(0, 0, 0, 0.02);
    margin: 6px 12px;
  }

  .catalogue-container {
    width: 256px;
    overflow: hidden;
    background: #fff;
    height: 100%;
    transition: 0.5s width;
    border-radius: 2px;
    display: flex;
    flex-direction: column;

    .list-hint {
      color: #aaa;
      padding: 12px;
      border-bottom: 1px solid #cfcfcf;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      white-space: nowrap;

      .ri-close-line {
        cursor: pointer;
      }
    }

    :deep(.el-tree__empty-text) {
      white-space: pre;
    }

    .tree-label {
      width: 100%;
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .catalogue-item {
      color: #aaa;
      margin: 6px 12px;
    }
  }
}
</style>
