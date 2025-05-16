<!-- 右键菜单 -->
<template>
  <div class="right-click-menu" :style="{ left: menuLeftPos, top: menuTopPos, display: menuDisplay }">
    <!-- 表格菜单 -->
    <TableMenu v-if="menuType === 'table'" :editor="props.editor" />

    <!-- 基本菜单 -->
    <CommonMenu v-else class="common-menu" :editor="props.editor" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import { useGlobalStore } from "@/store/index"
import { Editor } from "@tiptap/vue-3"
import { useEventListener } from "@vueuse/core"
import CommonMenu from "./component/common-menu.vue"
import TableMenu from "./component/table-menu.vue"
const props = defineProps<{
  editor: Editor | undefined
}>()

const globalStore = useGlobalStore()
const menuType = ref("common")
const menuLeftPos = ref("0px")
const menuTopPos = ref("0px")
const menuDisplay = ref("none")

onMounted(() => {
  useEventListener(document, "contextmenu", e => {
    // 点击任何地方都关闭右键菜单
    const globalStore = useGlobalStore()
    globalStore.setMenuInfoColumn("display", "none")
  })
  // 点击任何地方都关闭右键菜单
  useEventListener(document, "click", e => {
    const globalStore = useGlobalStore()
    globalStore.setMenuInfoColumn("display", "none")
  })
})

watch(
  () => globalStore.menuInfo,
  (newVal, oldVal) => {
    menuType.value = newVal.type || "common"
    menuDisplay.value = newVal.display || "none"
    menuTopPos.value = newVal.y || "0px"
    menuLeftPos.value = newVal.x || "0px"
  },
  { deep: true }
)
</script>

<style lang="less">
.right-click-menu {
  position: fixed;
  background: #fff;
  border-radius: 3px;
  z-index: 999;
  border: 1px solid #ccc;
  box-shadow: 0px 0px 3px #ccc;
  .menu-container {
    min-width: 160px;
    padding: 10px 0px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
  }
}
</style>
