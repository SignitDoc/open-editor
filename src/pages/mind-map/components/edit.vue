<template>
  <div class="edit-mind-map-wrapper">
    <div class="mind-map-container" ref="mindMapContainer"></div>
  </div>
  <ContextMenu v-if="mindMap"/>

</template>

<script setup lang="ts">
import MindMap from "simple-mind-map"
import Drag from "simple-mind-map/src/plugins/Drag.js"
import { ref, onMounted } from "vue"
import { cloneDeep } from "lodash"
import { useMindMapStore } from "../config"
import ContextMenu from "./context-menu.vue"

MindMap.usePlugin(Drag)
const mindMapStore = useMindMapStore()
const mindMapContainer = ref(null)
const mindMap = ref<any>(null)

onMounted(() => {
  if (!mindMapContainer.value) {
    return
  }
  mindMap.value = new MindMap({
    el: mindMapContainer.value as any,
    data: {
      data: {
        text: "根节点"
      },
      children: [
        {
          data: {
            text: "二级节点1",
            expand: true
          },
          children: [
            {
              data: {
                text: "分支主题"
              }
            }
          ]
        },
        {
          data: {
            text: "二级节点2",
            expand: true
          },
          children: [
            {
              data: {
                text: "分支主题"
              }
            },
            {
              data: {
                text: "分支主题"
              },
              children: [
                {
                  data: {
                    text: "分支主题"
                  }
                },
                {
                  data: {
                    text: "分支主题"
                  }
                },
                {
                  data: {
                    text: "分支主题"
                  }
                },
                {
                  data: {
                    text: "分支主题"
                  }
                }
              ]
            },
            {
              data: {
                text: "分支主题"
              }
            },
            {
              data: {
                text: "分支主题"
              }
            }
          ]
        }
      ]
    } as any
  } as any)
  mindMapStore.setMindMap(mindMap.value)
  // 监听节点激活事件
  mindMap.value.on("node_active", (node, activeNodeList) => {
    mindMapStore.setActiveNodes(activeNodeList)
  })

  // 监听前进和回退
  mindMap.value.on("back_forward", (index, len) => {
    mindMapStore.setBackEnd(index <= 0)
    mindMapStore.setForwardEnd( index >= len - 1)
  })

  //监听右键
    mindMap.value.on("node_contextmenu", (e,node) => {
        console.log(node)
        mindMapStore.setContentMenu({
            type:'node',
            left:e.clientX+10,
            top:e.clientY+10,
            isShow:true,
            currentNode:cloneDeep(node)
        })
    })
})
</script>

<style scoped lang="less">
.edit-mind-map-wrapper {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  .mind-map-container {
    width: 100%;
    height: 100%;
  }
}
</style>
