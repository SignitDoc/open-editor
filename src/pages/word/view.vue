<!-- 文档分享页面 -->
<template>
  <div v-loading="editorLoading" class="editor-page-container" ref="editorRef">
    <!-- 标题及头部菜单栏 -->
    <DocHeader
      ref="editorHeaderRef"
      :editor="editor"
      :sideToolbarRef="sideToolbarRef"
      v-model:now-doc="documentState.nowDoc"
    />

    <!-- 主体区域 -->
    <div class="editor-page-main">
      <div class="editor-body">
        <!-- 左侧目录 -->
        <div class="catalogue-list" :style="{ width: isCatalogCollapse ? '265px' : '0px' }">
          <CatalogueList
            :editor="editor"
            :isHeadingChange="isHeadingChange"
            v-model:isCatalogCollapse="isCatalogCollapse"
            @locate-heading="locateHeading"
          />
        </div>

        <!-- 编辑区域 -->
        <div class="editor-area" @contextmenu="openRightClickMenu">
          <div class="editor-area-container" id="editor">
            <editor-content
              id="editor-content"
              :style="{
                transform: `scale(${scaleRatio})`,
                'transform-origin': 'top left'
              }"
              :editor="editor"
            />
          </div>
        </div>

        <!-- 侧边工具栏 -->
        <div class="side-toolbar">
          <SideToolbar
            ref="sideToolbarRef"
            :editor="editor"
            :editorHeaderRef="editorHeaderRef"
            :now-doc="documentState.nowDoc"
          />
        </div>
      </div>
    </div>

    <!-- 底部统计栏 -->
    <FooterToolbar :editor="editor" :editor-ref="editorRef" v-model:scale-ratio="scaleRatio" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, onBeforeUnmount } from "vue"
import { cloneDeep, debounce } from "lodash"

import { setPageSetting } from "@/utils"
import { DocHeader, FooterToolbar, CatalogueList, SideToolbar } from "@/editor-modules"
import router from "@/router"
import { useDocumentListStore, useDocumentStore } from "@/store"
import extensions from "@/tiptap-extensions"
import StarterKit from "@tiptap/starter-kit"
import { DocxDocumentItem, HistoryItem } from "@/types"
import { useEditor, EditorContent } from "@tiptap/vue-3"

// ref
const editorHeaderRef = ref()
const editorRef = ref<HTMLElement | null>(null)
const sideToolbarRef = ref()

// store
const documentStore = useDocumentStore()
const documentListStore = useDocumentListStore()

// 目录展开状态
const isCatalogCollapse = ref(true)

const editor = useEditor({
  content: "",
  editable: false,
  onCreate: ({ editor }) => {
    // 初始化批注列表
    setPageSetting()
    setEditorMarginLeft()
  },
  onUpdate: () => {
    changeHeading()
  },
  onSelectionUpdate: options => {
    getSelectedAnnotations(options)
  },
  extensions: [
    StarterKit.configure({
      codeBlock: false,
      paragraph: false
    }),
    ...extensions
  ] as Array<any>
})

const editorLoading = ref(false)
const id = router.currentRoute.value.query.id as string

onMounted(async () => {
  // 获取当前dpi
  documentStore.setDPI()
  try {
    // 获取当前分享的文档
    if (id) {
      editorLoading.value = true
      let document = documentListStore.getDetail(id)
      if (!document || document.type !== "word") return router.push(`/none`)

      document = cloneDeep(document)
      if (!document.pageMode) document.pageMode = "A4"

      documentStore.$patch({ editable: false, preview: true, pageMode: document.pageMode })
      documentState.nowDoc = document
      if (documentState.nowDoc.content) editor.value?.commands?.insertContent(documentState.nowDoc.content)

      editorLoading.value = false
    } else router.push("/none")
  } catch (err: any) {
    if (err.response.status === 401) router.push(`/without-permission`)
    else if (err.response.status === 404) router.push(`/none`)
  }

  // 监听窗口
  window.addEventListener("resize", setEditorMarginLeft)
})

onBeforeUnmount(() => {
  // destroy会引起token warning，暂时无法解决，等官方看看是个什么事
  // 必须destroy，否则再次进来会有上次房间里的缓存
  editor.value?.destroy()
  editor.value = undefined

  window.removeEventListener("resize", setEditorMarginLeft)
})

const documentState = reactive({
  nowDoc: {
    //当前选中的文档
    content: "",
    title: "无标题文档",
    updateTime: 0,
    history: [] as Array<HistoryItem>,
    pageMode: "A4"
  } as DocxDocumentItem
})

// 编辑区域缩放比例
const scaleRatio = ref(1.0)

// 打开右键菜单
function openRightClickMenu(e) {
  // 拒绝浏览器时间
  e.preventDefault()
}

// 获取当前选中节点
const getSelectedAnnotations = debounce(options => {
  const selection = options.transaction.selection
  documentStore.$patch({ selection: selection })
}, 500)

// heading是否发生变化 true false只是改变标志，不是发生/未发生改变
const isHeadingChange = ref(false)
function changeHeading() {
  isHeadingChange.value = !isHeadingChange.value
}

// 点击菜单跳转heading
function locateHeading(clickHeading: Record<string, any>) {
  const editorContainerDom = document.getElementById("editor")
  const editorDom = editor.value?.options.element
  const proseMirrorDom = editorDom?.children[0]
  const children = proseMirrorDom?.childNodes ?? []
  const target = [...children].find((item, index) => clickHeading.index === index) as HTMLElement | undefined
  if (target && editorContainerDom) {
    const top = target.offsetTop - 10
    editorContainerDom.scrollTop = top
  }
}

// 监听页面大小变化
watch([() => documentStore.pageMode], val => {
  setPageSetting()
  setEditorMarginLeft()
})

// 监听是否开启目录
watch([() => isCatalogCollapse.value], val => {
  setEditorMarginLeft()
})

const setEditorMarginLeft = debounce(() => {
  const windowWidth = window.innerWidth
  const editorDom = document.getElementById("editor-content")
  const editorWidth = editorDom?.offsetWidth
  if (!editorWidth) return
  if (windowWidth < editorWidth + 270 + 270 && isCatalogCollapse.value) {
    if (editorDom.parentElement) editorDom.parentElement.style.justifyContent = "flex-start"
    editorDom.style.marginLeft = "270px"
  } else {
    if (editorDom.parentElement) editorDom.parentElement.style.justifyContent = "center"
    editorDom.style.marginLeft = "50px"
  }
}, 10)
</script>

<style lang="less" scoped>
.editor-page-container {
  position: relative;
  background: #f3f3f2;
  height: 100%;

  .editor-page-main {
    height: calc(100% - 90px);
    min-height: 500px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    .editor-body {
      flex: 1;
      box-sizing: border-box;
      display: flex;
      position: relative;
      width: 100%;
      height: calc(100% - 40px);
      min-width: 920px;

      // 不可删除：bubble-menu不在视线范围内会引起容器高度变化，导致滚动条异常
      overflow: hidden;

      .catalogue-list {
        position: absolute;
        left: 0px;
        top: 10px;
        bottom: 10px;
        margin: auto;
        border: none;
        z-index: 2;
      }

      .editor-area {
        height: 100%;
        width: calc(100% - 50px);
        box-sizing: border-box;
        .editor-area-container {
          display: grid;
          place-items: center;
          height: 100%;
          overflow: auto;
          padding: 10px 0px;
          box-sizing: border-box;
        }
      }

      .side-toolbar {
        position: absolute;
        width: 50px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        margin: auto;
        border: none;
        z-index: 1;
      }
    }
  }
}

.dropdown-item {
  position: relative;
  width: 100px;
  .select-file {
    opacity: 0;
    position: absolute;
  }
  .desc {
    margin-left: 8px;
  }
}
</style>
