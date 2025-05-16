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
      <div class="editor-header">
        <HeaderItem
          type="action"
          desc="撤销"
          icon="ri-arrow-go-back-line"
          @click="editor?.chain().focus().undo().run()"
          :disabled="!editor?.can().chain().focus().undo().run() || !documentStore.editable"
        />
        <HeaderItem
          type="action"
          desc="重做"
          icon="ri-arrow-go-forward-line"
          @click="editor?.chain().focus().redo().run()"
          :disabled="!editor?.can().chain().focus().redo().run() || !documentStore.editable"
        />
        <HeaderItem type="action" desc="格式刷" icon="ri-brush-2-line" disabled />
        <HeaderItem
          type="action"
          desc="清除样式"
          icon="ri-eraser-fill"
          @click="editor?.chain().focus().unsetAllMarks().run()"
          :disabled="!editor?.can().chain().focus().unsetAllMarks().run() || !documentStore.editable"
        />

        <el-divider direction="vertical" />

        <HeadingEditor :editor="editor" />
        <TextEditor :editor="editor" />
        <TableEditor :editor="editor" />
        <FontFamilyEditor :editor="editor" />
        <FontSizeEditor :editor="editor" />

        <el-divider direction="vertical" />

        <TypographyEditor :editor="editor" :nowDoc="documentState.nowDoc" />

        <el-divider direction="vertical" />

        <el-dropdown trigger="click" :disabled="!documentStore.editable">
          <div style="outline: none; cursor: pointer; font-size: 14px">
            <i class="ri-add-circle-fill"></i>
            <span>插入</span>
            <i class="ri-arrow-drop-down-line"></i>
          </div>
          <template #dropdown>
            <el-dropdown-menu style="overflow: hidden">
              <el-dropdown-item :icon="Picture" class="dropdown-item">
                <input type="file" id="file" class="select-file" title="" accept="image/*" @change="uploadImage" />
                <span class="desc">图片</span>
              </el-dropdown-item>
              <el-dropdown-item :icon="LinkIcon" class="dropdown-item" @click="linkDialogVisible = true">
                <span class="desc">链接</span>
              </el-dropdown-item>

              <el-dropdown-item class="dropdown-item" @click="editor?.chain().focus().setHorizontalRule().run()">
                <i class="ri-separator"></i>
                <span class="desc">分割线</span>
              </el-dropdown-item>
              <el-dropdown-item
                class="dropdown-item"
                @click="insertContent({ type: 'RawFormItem', attrs: { type: 'input' } })"
              >
                <i class="ri-keyboard-line"></i>
                <span class="desc">输入框</span>
              </el-dropdown-item>

              <el-dropdown-item
                :icon="Calendar"
                class="dropdown-item"
                @click="insertContent({ type: 'RawFormItem', attrs: { type: 'date' } })"
              >
                <span class="desc">日期</span>
              </el-dropdown-item>
              <el-dropdown-item
                class="dropdown-item"
                @click="insertContent({ type: 'RawFormItem', attrs: { type: 'radio-group', options: defaultOptions } })"
              >
                <i class="ri-radio-button-line"></i>
                <span class="desc">单选</span>
              </el-dropdown-item>
              <el-dropdown-item
                class="dropdown-item"
                @click="insertContent({ type: 'RawFormItem', attrs: { type: 'select', options: defaultOptions } })"
              >
                <i class="ri-dropdown-list"></i>
                <span class="desc">下拉</span>
              </el-dropdown-item>
              <el-dropdown-item
                :icon="Discount"
                class="dropdown-item"
                @click="
                  insertContent({
                    type: 'DraggableItem',
                    content: [{ type: 'paragraph', content: [{ type: 'text', text: '高亮块' }] }]
                  })
                "
              >
                <span class="desc">高亮块</span>
              </el-dropdown-item>
              <el-dropdown-item
                :icon="h('i', { class: 'ri-code-box-line' })"
                class="dropdown-item"
                @click="
                  editor?.commands.insertContent({
                    type: 'codeBlock',
                    content: [
                      {
                        type: 'text',
                        text: ' '
                      }
                    ]
                  })
                "
              >
                <span class="desc">代码块</span>
                <span class="shortcut">``` + 空格/回车</span>
              </el-dropdown-item>
              <el-dropdown-item :icon="EditPen" class="dropdown-item" @click="insertContent({ type: 'ESign' })">
                <span class="desc">电子签名</span>
              </el-dropdown-item>
              <el-dropdown-item :icon="Discount" class="dropdown-item" @click="insertContent({ type: 'SvgBox' })">
                <span class="desc">svg绘制</span>
              </el-dropdown-item>
              <el-dropdown-item class="dropdown-item">
                <SymbolEditor :insert-content="insertContent" />
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <SearchPopover :editor="editor" />
      </div>

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
        <div ref="editorAreaRef" class="editor-area" @contextmenu="openRightClickMenu">
          <div id="editor" class="editor-area-container">
            <editor-content
              class="doc-editor-content"
              id="editor-content"
              :style="{
                transform: `scale(${scaleRatio})`,
                'transform-origin': 'top left'
              }"
              :editor="editor"
              :page-mode="documentStore.pageMode"
            />
            <OnlineBubbleMenu :editor="editor" :selection="selection" :now-doc="documentState.nowDoc" />
            <RightClickMenu :editor="editor" />
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
    <FooterToolbar
      :editor="editor"
      :editor-ref="editorRef"
      v-model:scale-ratio="scaleRatio"
      @open-page-setting="pageSettingDialogRef?.openDialog()"
    />

    <HyperlinkEditor :editor="editor" v-model:visible="linkDialogVisible" />
  </div>

  <!-- 批注弹窗 -->
  <AnnotationDialog
    :editor="editor"
    :now-doc="documentState.nowDoc"
    :add-comment-callback="sideToolbarRef?.addCommentListener"
  />
  <!-- 电子签名弹窗 -->
  <EsignEditor />

  <!-- 页面配置弹窗 -->
  <PageSettingDialog ref="pageSettingDialogRef" :document-id="id" />
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, onBeforeUnmount, nextTick, h, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { cloneDeep, debounce } from "lodash"

import {
  TextEditor,
  TableEditor,
  FontFamilyEditor,
  FontSizeEditor,
  TypographyEditor,
  HeadingEditor,
  SymbolEditor,
  OnlineBubbleMenu,
  HyperlinkEditor,
  EsignEditor,
  SearchPopover
} from "@/editor-functions"

import {
  DocHeader,
  FooterToolbar,
  CatalogueList,
  AnnotationDialog,
  SideToolbar,
  RightClickMenu,
  PageSettingDialog
} from "@/editor-modules"
import { DocumentActionEnum } from "@/enum"
import { HeaderItem } from "@/components"
import extensions from "@/tiptap-extensions"
import { setPageSetting } from "@/utils"
import { useEventListener } from "@vueuse/core"
import { DocxDocumentItem, HistoryItem, CommentItem } from "@/types"
import { useDocumentStore, useGlobalStore, useDocumentListStore } from "@/store"
import { EditorContent, JSONContent, Editor } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import BubbleMenu from "@tiptap/extension-bubble-menu"
import { Picture, Link as LinkIcon, EditPen, Calendar, Discount, Tickets } from "@element-plus/icons-vue"
import { defaultOptions } from "@/config"

const router = useRouter()

// ref
const editorHeaderRef = ref()
const editorRef = ref<HTMLElement | null>(null)
const sideToolbarRef = ref()
const editorAreaRef = ref<HTMLElement | null>(null)
const pageSettingDialogRef = ref()

// store
const globalStore = useGlobalStore()
const documentStore = useDocumentStore()
const documentListStore = useDocumentListStore()

// 目录展开状态
const isCatalogCollapse = ref(true)

const provider = ref()
const editor = ref()

const editorLoading = ref(false)
const id = router.currentRoute.value.query.id as string
const selection = ref<undefined | Record<string, any>>(undefined)

onMounted(async () => {
  // 获取当前dpi
  documentStore.setDPI()
  // 获取当前点击的文档
  editorLoading.value = true
  let document = documentListStore.getDetail(id)
  if (!document || document.type !== "word") return router.push(`/none`)

  document = cloneDeep(document)
  if (!document.pageMode) document.pageMode = "A4"

  // 设置编辑器的编辑状态和用户权限
  documentStore.$patch({
    editable: true,
    preview: false,
    pageMode: document.pageMode
  })
  documentState.nowDoc = document
  editorLoading.value = false

  initEditor()

  // 每次打开滚动回到顶部
  nextTick(() => {
    if (editorAreaRef.value) editorAreaRef.value.scrollTop = 0
  })
  // 只能检测刷新和关闭事件，路由跳转在路由守卫中进行拦截
  window.addEventListener("beforeunload", saveHint)
})

function saveHint(e) {
  if (!documentStore.isSave) {
    e.preventDefault()
    e.returnValue = "数据暂未保存，是否要离开改页面"
    return "数据暂未保存，是否要离开改页面"
  }
}

onUnmounted(() => {
  window.removeEventListener("beforeunload", saveHint)
})

let isCreated = false

function initEditor() {
  let extensionsArray: Array<any> = extensions

  extensionsArray = [
    // 文本悬浮菜单
    BubbleMenu.configure({
      pluginKey: "TextBubbleMenu",
      element: document.querySelector(".text-bubble-menu") as HTMLElement,
      shouldShow: ({ editor, view, state, oldState, from, to }) => {
        return !editor.isActive("image") && from !== to
      }
    }),
    // 图片悬浮菜单
    BubbleMenu.configure({
      pluginKey: "ImageBubbleMenu",
      element: document.querySelector(".image-bubble-menu") as HTMLElement,
      shouldShow: ({ editor, view, state, oldState, from, to }) => {
        return editor.isActive("image")
      }
    }),
    StarterKit.configure({
      codeBlock: false,
      paragraph: false
    }),
    ...extensions
  ]

  editor.value = new Editor({
    content: documentState.nowDoc.content || "",
    editable: documentStore.editable,
    onCreate: () => {
      isCreated = true
      setPageSetting()
      setEditorMarginLeft()

      // 由于bubble-menu改变了docChanged和selectionSet,导致了插件误认为文本更新,但此时文本未插入,导致了批注坐标错乱
      // 因此初始化批注列表必须得等editor完全创建好,即bubble-menu已经完全生成后才能进行初始化
      editor.value?.commands.initComment(documentState.nowDoc.commentList)
      documentStore.setCommentList(documentState.nowDoc.commentList)
    },
    onUpdate: e => {
      changeHeading()
    },
    onSelectionUpdate: options => {
      // 从创建好以后改变编辑器记录
      if (isCreated && options.transaction.docChanged) documentStore.$patch({ isSave: false })
      const { transaction } = options
      selection.value = transaction.selection
      getSelectedAnnotations(options)
    },
    extensions: extensionsArray
  })

  setTimeout(() => {
    sideToolbarRef.value?.commentListener()
  })
}

onBeforeUnmount(() => {
  // destroy会引起token warning，暂时无法解决，等官方看看是个什么事
  // 必须destroy，否则再次进来会有上次房间里的缓存
  provider.value?.destroy()
  editor.value?.destroy()
  provider.value = undefined
  editor.value = undefined

  window.removeEventListener("resize", setEditorMarginLeft)
})

const documentState = reactive({
  nowDoc: {
    //当前选中的文档
    _id: id,
    content: "",
    title: "无标题文档",
    updateTime: "",
    history: [] as Array<HistoryItem>,
    createdTime: "",
    commentList: [] as Array<CommentItem>,
    pageMode: "A4"
  } as DocxDocumentItem
})

// 监听编辑器是否可编辑
watch(
  () => documentStore.editable,
  val => {
    editor.value?.setEditable(val)
  }
)

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

const linkDialogVisible = ref(false)

// 编辑区域缩放比例
const scaleRatio = ref(1.0)

onMounted(() => {
  // 自动保存
  useEventListener(document, "keydown", e => {
    if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
      // 禁用浏览器自动保存事件
      e.preventDefault()
      if (editorHeaderRef.value) editorHeaderRef.value.handleSave(DocumentActionEnum.Edit)
    }
  })

  // 监听窗口
  window.addEventListener("resize", setEditorMarginLeft)
})

// 打开右键菜单
function openRightClickMenu(e) {
  // 拒绝浏览器时间
  e.preventDefault()
  if (documentStore.editable) {
    // 保证在document的contextmenu后才打开，不然不会显示
    setTimeout(() => {
      const type = getContextType(e.target as HTMLElement)
      globalStore.setMenuInfo({
        type: type,
        display: "block",
        x: e.x + "px", //offsetX,pageX,screenX,clientX
        y: e.y + "px"
      })
    })
  }
}

// 获取当前选中节点
const getSelectedAnnotations = debounce(options => {
  const selection = options.transaction.selection
  documentStore.$patch({ selection: selection })
}, 500)

// 获取当前区域内的菜单类型
function getContextType(dom: HTMLElement) {
  const { tagName, id } = dom
  if (tagName === "TABLE") {
    return "table"
  }
  if (id === "editor-content" || id === "editor") {
    return "common"
  } else {
    const parent = dom.parentNode as HTMLElement
    return getContextType(parent)
  }
}

// 插入任意内容
function insertContent(nodeContent: JSONContent | string) {
  editor.value?.commands.insertContent(nodeContent)
}

// 插入图片
function uploadImage(e: any) {
  const file = e?.target?.files[0]
  if (!file) return
  const fileReader = new FileReader()
  fileReader.readAsDataURL(file)
  fileReader.onload = function () {
    editor.value?.commands.insertContent({
      type: "image",
      attrs: { src: fileReader.result }
    })
  }
}

// heading是否发生变化 true false只是改变标志，不是发生/未发生改变
const isHeadingChange = ref(false)
function changeHeading() {
  isHeadingChange.value = !isHeadingChange.value
}

// 点击菜单跳转heading
function locateHeading(clickHeading: Record<string, any>) {
  const editorContainerDom = document.getElementById("editor")
  const editorDom = editor.value?.options.element
  const proseMirrorDom = editorDom?.children[0] as HTMLElement
  const children = proseMirrorDom?.childNodes ?? []
  const headings = [...children].filter((item: any) => ["H1", "H2", "H3", "H4", "H5", "H6"].includes(item.tagName))
  const target = headings.find((item, index) => clickHeading.index === index) as HTMLElement | undefined
  if (target && editorContainerDom) {
    const top = target.offsetTop < 10 ? 0 : target.offsetTop - 10
    editorContainerDom.scrollTop = top
  }
}
</script>

<style lang="less" scoped>
.editor-page-container {
  position: relative;
  background: #f3f3f2;
  height: 100%;

  .editor-page-main {
    height: calc(100% - 90px);
    min-height: 500px;
    display: flex;
    flex-direction: column;

    .editor-header {
      display: flex;
      width: 100%;
      justify-content: center;
      align-items: center;
      padding: 8px;
      background: #fff;
      border-bottom: 1px solid #eee;
      column-gap: 8px;
      box-sizing: border-box;
      min-width: 920px;

      :deep(.el-divider--vertical) {
        margin: 0px;
      }

      :deep(.el-color-picker__trigger) {
        padding: 0px;
        width: 16px;
        height: 16px;
      }
    }

    .editor-body {
      flex: 1;
      box-sizing: border-box;
      width: 100%;
      height: calc(100% - 40px);
      display: flex;
      position: relative;
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
          height: 100%;
          overflow: auto;
          padding: 10px 0px;
          box-sizing: border-box;
          display: grid;
          place-items: center;
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
        z-index: 2;
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
  .shortcut {
    color: #999;
    margin-left: 48px;
    white-space: pre;
  }
}
</style>
