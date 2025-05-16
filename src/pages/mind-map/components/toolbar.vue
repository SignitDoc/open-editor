<template>
  <div class="toolbar-container" :class="{ isDark: isDark }">
    <div class="toolbar" ref="toolbarRef">
      <!-- 节点操作 -->
      <div class="toolbar-block">
        <ToolbarNodeBtnList
          :list="horizontalList"
          @addAssociativeLine="emits('addAssociativeLine')"
        ></ToolbarNodeBtnList>
        <!-- 更多 -->
        <el-popover
          v-model="popoverShow"
          placement="bottom-end"
          width="120"
          trigger="hover"
          v-if="showMoreBtn"
          :style="{ marginLeft: horizontalList.length > 0 ? '20px' : 0 }"
        >
          <ToolbarNodeBtnList :list="verticalList" @click="popoverShow = false"></ToolbarNodeBtnList>
          <template #reference>
            <i class="ri-folder-2-line icon"></i>
            <span class="text">更多</span>
          </template>
        </el-popover>
      </div>

      <div class="toolbar-block">
        <el-dropdown trigger="click">
          <div class="toolbar-button"><i class="ri-mind-map icon"></i><span class="text">结构</span></div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in layoutOptions" :key="item.value" @click="useLayout(item)">
                <img :src="layoutImgMap[item.value]" alt="" />
                <div :style="{ fontSize: '14px', paddingLeft: '4px' }">
                  {{ item.name }}
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <div class="toolbar-button" @click="dialogVisible = true">
          <i class="ri-dashboard-line icon"></i><span class="text">大纲</span>
        </div>
        <div class="toolbar-button" @click="drawerVisible = true">
          <i class="ri-sparkling-line icon"></i><span class="text">样式</span>
        </div>

        <!-- <div class="toolbar-button"><i class="ri-save-line icon"></i> <span class="text">另存为</span></div> -->

        <div @click="exportDialogVisible = true" class="toolbar-button">
          <i class="ri-folder-download-line icon"></i><span class="text">导出</span>
        </div>
      </div>
    </div>

    <!-- 大纲 -->
    <el-dialog v-model="dialogVisible" title="大纲" fullscreen>
      <OutlineEdit v-model:visible="dialogVisible" />
    </el-dialog>

    <!-- 样式 -->
    <el-drawer modal-class="custom-drawer-class" :modal="true" v-model="drawerVisible" title="样式">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础样式" name="baseStyle">
          <BaseStyle />
        </el-tab-pane>
        <el-tab-pane label="节点样式" name="nodeStyle"><NodeStyle /></el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>

  <el-dialog width="600px" modal-class="export-dialog" title="导出" v-model="exportDialogVisible">
    <div>
      <p>导出文件名称:</p>
      <el-input v-model="mindMapTile" placeholder="请输入文件名称" />
    </div>
    <div class="export-list">
      <div
        @click="clickExport(item.value)"
        :class="{
          active: exportType === item.value
        }"
        v-for="item in exportTypeList"
        :key="item.value"
        class="export-item"
      >
        <img :src="item.img" alt="" />
        <span> {{ item.name }}</span>
      </div>
    </div>

    <template #footer>
      <div>
        <el-button @click="exportDialogVisible = false">取消</el-button>
        <el-button @click="handleExport" type="primary">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted, nextTick } from "vue"
import ToolbarNodeBtnList from "./toolbar-node-button-list.vue"
import { cloneDeep, throttle } from "lodash"
import OutlineEdit from "./outline-edit.vue"
import { useMindMapStore } from "../config"
import BaseStyle from "./base-style.vue"
import NodeStyle from "./node-style.vue"
import { layoutOptions, layoutImgMap } from "../constant"
import { Message } from "@/utils"

const mindMapStore = useMindMapStore()

const props = defineProps({
  mindMapTitle: String
})

const mindMapTile = ref(props.mindMapTitle)

watch(
  () => props.mindMapTitle,
  val => {
    mindMapTile.value = val
  }
)
/*=====================================样式=====================================*/

const drawerVisible = ref(false)
const activeName = ref("baseStyle")

/*===============================结构===============================*/

const useLayout = (layoutValue: Record<string, any>) => {
  // layout.value = layoutValue.value
  mindMapStore.mindMap?.setLayout(layoutValue.value)
  //将当前思维导图存起来
}

/*===================================大纲===================================*/
const dialogVisible = ref(false)

const list = [
  "back",
  "forward",
  "painter",
  "siblingNode",
  "childNode",
  "deleteNode",
  "image",
  // "icon",
  "link",
  "note",
  "tag",
  "summary",
  "associativeLine",
  "formula",
  // 'attachment',
  "outerFrame",
  "annotation"
]
const horizontalList = ref<any>([])

const verticalList = ref<any>([])

const showMoreBtn = ref(false) // 是否显示更多按钮

const popoverShow = ref(false)
const toolbarRef = ref<any>(null)
// 计算工具按钮的显示
const computeToolbarShow = () => {
  const all = cloneDeep(list)
  horizontalList.value = all
}

onMounted(() => {
  computeToolbarShow()
  window.addEventListener("resize", throttle(computeToolbarShow, 200))
})

const isDark = ref(false)

const emits = defineEmits(["exportMindMap", "addAssociativeLine"])

/*===================================导出===================================*/

// 可选的导出格式
const exportTypeList = [
  {
    name: "JSON",
    value: "json",
    img: new URL("@/assets/mind-map/json-file.png", import.meta.url).href
  },
  {
    name: "XMind",
    value: "xmind",
    img: new URL("@/assets/mind-map/mind-map-icon.png", import.meta.url).href
  },
  {
    name: "PNG",
    value: "png",
    img: new URL("@/assets/mind-map/png-file.png", import.meta.url).href
  },
  {
    name: "SVG",
    value: "svg",
    img: new URL("@/assets/mind-map/svg-file.png", import.meta.url).href
  },
  {
    name: "PDF",
    value: "pdf",
    img: new URL("@/assets/mind-map/pdf-file.png", import.meta.url).href
  },
  {
    name: "Markdown",
    value: "md",
    img: new URL("@/assets/mind-map/markdown-icon.png", import.meta.url).href
  },
  {
    name: "TXT",
    value: "txt",
    img: new URL("@/assets/mind-map/txt-file.png", import.meta.url).href
  }
]

//导出弹窗
const exportDialogVisible = ref(false) // 是否显示导出弹窗
const exportType = ref("") // 选择导出的格式
// 选择导出的格式
const clickExport = item => {
  exportType.value = item
}

// 导出
const handleExport = () => {
  if (!exportType.value) {
    return Message.warning("请选择导出格式")
  }
  emits("exportMindMap", {
    fileType: exportType.value,
    title: mindMapTile.value
  })
}
</script>
<style lang="less" scoped>
.toolbar-container {
  &.isDark {
    .toolbar {
      color: hsla(0, 0%, 100%, 0.9);
      .toolbar-block {
        background-color: #262a2e;

        .fileTreeBox {
          background-color: #262a2e;

          /deep/ .el-tree {
            background-color: #262a2e;

            &.el-tree--highlight-current {
              .el-tree-node.is-current > .el-tree-node__content {
                background-color: hsla(0, 0%, 100%, 0.05) !important;
              }
            }

            .el-tree-node:focus > .el-tree-node__content {
              background-color: hsla(0, 0%, 100%, 0.05) !important;
            }

            .el-tree-node__content:hover,
            .el-upload-list__item:hover {
              background-color: hsla(0, 0%, 100%, 0.02) !important;
            }
          }

          .fileTreeWrap {
            .customTreeNode {
              .treeNodeInfo {
                color: #fff;
              }

              .treeNodeBtnList {
                .el-button {
                  padding: 7px 5px;
                }
              }
            }
          }
        }
      }

      .toolbar-button {
        .icon {
          background: transparent;
          border-color: transparent;
        }

        &:hover {
          &:not(.disabled) {
            .icon {
              background: hsla(0, 0%, 100%, 0.05);
            }
          }
        }

        &.disabled {
          color: #54595f;
        }
      }
    }
  }
  .toolbar {
    width: 100%;
    display: flex;
    font-size: 12px;
    font-weight: 400;
    color: rgba(26, 26, 26, 0.8);
    background-color: #fff;
    padding: 10px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    margin: auto;
    justify-content: center;
    .toolbar-block {
      display: flex;
      gap: 20px;
      padding: 0px 20px;
      flex-shrink: 0;
      position: relative;
      border-right: 1px solid #e9e9e9;
      &:last-child {
        border-right: none;
      }

      .fileTreeBox {
        position: absolute;
        left: 0;
        top: 68px;
        width: 100%;
        height: 30px;
        background-color: #fff;
        padding: 12px 5px;
        padding-top: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border-radius: 5px;
        min-width: 200px;
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);

        &.expand {
          height: 300px;

          .fileTreeWrap {
            visibility: visible;
          }
        }

        .fileTreeToolbar {
          width: 100%;
          height: 30px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e9e9e9;
          margin-bottom: 12px;
          padding-left: 12px;

          .fileTreeName {
          }

          .fileTreeActionList {
            .btn {
              font-size: 18px;
              margin-left: 12px;
              cursor: pointer;
            }
          }
        }

        .fileTreeWrap {
          width: 100%;
          height: 100%;
          overflow: auto;
          visibility: hidden;

          .customTreeNode {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13px;
            padding-right: 5px;

            .treeNodeInfo {
              display: flex;
              align-items: center;

              .treeNodeIcon {
                margin-right: 5px;
                opacity: 0.7;
              }

              .treeNodeName {
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }

            .treeNodeBtnList {
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }

    .toolbar-button {
      display: flex;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;

      &:hover {
        &:not(.disabled) {
          .icon {
            background: #f5f5f5;
          }
        }
      }

      &.active {
        .icon {
          background: #f5f5f5;
        }
      }

      &.disabled {
        color: #bcbcbc;
        cursor: not-allowed;
        pointer-events: none;
      }

      .icon {
        text-align: center;
      }
    }
  }
}
</style>

<style lang="less">
.custom-drawer-class {
  background-color: rgba(0, 0, 0, 0);
}
.export-dialog {
  .export-list {
    display: flex;
    margin-top: 20px;
    gap: 20px;
    flex-wrap: wrap;
    .export-item {
      border-radius: 4px;
      padding: 10px;
      border: 1px solid #e9e9e9;
      width: 105px;
      display: flex;
      gap: 4px;
      align-items: center;
      cursor: pointer;
      img {
        width: 40px;
        height: 40px;
      }
    }
    .active {
      border-color: #409eff;
      background-color: #f5f5f5;
    }
  }
}
</style>
