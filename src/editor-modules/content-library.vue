<template>
  <div class="content-library-root">
    <!-- 插入内容预览模块 -->
    <div class="insert-content-container">
      <div class="insert-content-title">
        <div class="content-title">
          <span>插入内容</span>
          <el-radio-group v-model="radioModel" size="small">
            <el-radio-button label="卡片模式" value="卡片模式" />
            <el-radio-button label="列表模式" value="列表模式" />
          </el-radio-group>
        </div>
        <IconButton label="关闭内容库" icon="ri-close-line" @click="closeContentLibrary"></IconButton>
      </div>
      <div v-if="radioModel === '卡片模式'" class="insert-content-card tip-tap-view-wrapper">
        <div
          v-for="(document, index) in currentFolder"
          :key="index"
          class="insert-item"
          @click="insertContent(document)"
        >
          <div v-if="document.html" class="content-item-text">
            <div
              class="content-scale-item"
              :style="{ width: 100 * (630 / 150) + '%', transformOrigin: '0px 0px', scale: 150 / 630 }"
              v-html="document.html"
            ></div>
          </div>
          <div v-else class="content-item-text">{{ document.content }}</div>
          <div class="content-item-title">{{ document.documentName }}</div>
        </div>
      </div>
      <div v-else class="insert-content-list">
        <div
          v-for="(document, index) in currentFolder"
          :key="index"
          class="content-list-item"
          @click="insertContent(document)"
        >
          <div class="item-title">{{ document.documentName }}</div>
          <div class="item-text">
            {{ document.txt }}
          </div>
        </div>
      </div>
    </div>
    <el-divider></el-divider>

    <!-- 内容库目录模块 -->
    <div class="content-catalog">
      <div class="content-catalog-title">内容库</div>
      <div class="input-search">
        <el-input v-model="searchValue" placeholder="请输入关键词" :prefix-icon="Search" />
        <!-- <div class="icon-plus" @click="openContentLibrary">
          <i class="ri-add-line"></i>
        </div> -->
      </div>
      <div class="catalog-menu">
        <el-menu v-if="searchContent.length" :unique-opened="true" @close="handleChangeMenu" @open="handleChangeMenu">
          <el-sub-menu v-for="(folder, index) in searchContent" :key="index" :index="String(index)">
            <template #title>
              <i class="ri-folder-2-line"></i>
              <span>{{ folder.folderName }}</span>
              <i class="ri-delete-bin-6-line delete-icon" @click.stop="deleteFolder(folder)"></i>
            </template>
            <el-menu-item
              v-for="(document, docIndex) in folder.documentContent"
              :key="docIndex"
              :index="index + '-' + docIndex"
              @click="changeSubMenu(folder, document)"
            >
              <i class="ri-article-line"></i>
              <span>{{ document.documentName }}</span>
              <i class="ri-delete-bin-6-line delete-icon" @click.stop="deleteDocument(folder, document)"></i>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
        <el-empty v-else description="还没创建内容库"></el-empty>
      </div>
    </div>

    <!-- 创建内容库弹窗 -->
    <DialogContainer
      title="创建新的内容库"
      v-model:visible="contentLibraryDialogState.visible"
      :confirm-callback="handleConfirm"
    >
      <el-input v-model="contentLibraryName" placeholder="请输入内容库名称"></el-input>
    </DialogContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from "vue"
import { ElMessage } from "element-plus"
import { Search } from "@element-plus/icons-vue"
import { IconButton, DialogContainer } from "@/components"
import StarterKit from "@tiptap/starter-kit"
import { Editor, generateHTML } from "@tiptap/vue-3"
import { cloneDeep } from "lodash"
import { useDocumentStore } from "@/store"
import { ContentItem } from "@/types"
import { generateText, SystemPrompt } from "@/utils"
import { defaultContentLibraryData } from "@/configs/default-content-library-data"
import extensions from "@/tiptap-extensions"

const documentStore = useDocumentStore()

const props = defineProps<{
  isContentLibrary: boolean
  editor: Editor | undefined
}>()

// 内容库名称
const contentLibraryName = ref("")

const radioModel = ref("卡片模式")

const contentLibraryDialogState = reactive({
  visible: false
})

const currentFolder = ref<Array<ContentItem>>([])

// 搜索内容，默认为全部的内容库列表
const searchValue = ref("")
const searchContent = computed(() => {
  return documentStore.contentLibrary.filter(folder => {
    return (
      folder.folderName.includes(searchValue.value) ||
      folder.documentContent.find(doc => doc.documentName.includes(searchValue.value))
    )
  })
})

const emits = defineEmits(["update:isContentLibrary"])

function getContentLibrary() {
  const contentLibraryData = cloneDeep(defaultContentLibraryData)
  currentFolder.value = contentLibraryData[0].documentContent
  contentLibraryData.forEach(folder => {
    folder.documentContent.forEach(doc => {
      if (doc.content)
        doc.html = generateHTML(doc.content, [
          StarterKit.configure({ paragraph: false, codeBlock: false }),
          ...extensions
        ])

      doc.txt = generateText(doc.content, props.editor?.schema)
    })
  })

  documentStore.$patch({ contentLibrary: contentLibraryData })
}

watch(
  () => props.editor,
  val => {
    if (val) {
      if (documentStore.contentLibrary.length === 0) getContentLibrary()
      else currentFolder.value = documentStore.contentLibrary[0].documentContent
    }
  }
)

// 给内容库的内容添加id
function addId() {
  return documentStore.contentLibrary.map((contentItem, index) => {
    contentItem.id = String(index)
    contentItem.documentContent.forEach((docItem, docIndex) => {
      docItem.id = String(index) + "-" + String(docIndex)
    })
  })
}

// 关闭内容库
function closeContentLibrary() {
  emits("update:isContentLibrary", false)
}

// 删除内容库文件夹
function deleteFolder(folder) {
  SystemPrompt("确定删除该内容库吗？").then(() => {
    try {
      const contentLibrary = documentStore.contentLibrary
      const index = contentLibrary.findIndex(item => item.id === folder.id)
      contentLibrary.splice(index, 1)
      currentFolder.value = contentLibrary.length > 0 ? contentLibrary[0].documentContent : []
      ElMessage.success("删除内容库成功")
    } catch (err) {
      ElMessage.error("删除内容库失败")
    }
  })
}

// 删除对应内容库中的文件
function deleteDocument(folder, document) {
  SystemPrompt("确定删除该文件吗？").then(() => {
    try {
      const index = folder.documentContent.findIndex(item => item.id === document.id)
      folder.documentContent.splice(index, 1)

      ElMessage.success("删除文件成功")
    } catch (err) {
      ElMessage.error("删除文件失败")
    }
  })
}

// 添加内容库
function openContentLibrary() {
  contentLibraryName.value = ""
  contentLibraryDialogState.visible = true
}

// 处理确认操作
function handleConfirm() {
  const contentItem = {
    id: "",
    folderName: contentLibraryName.value,
    documentContent: [] as Array<ContentItem>
  }
  documentStore.contentLibrary.push(contentItem)
  addId() // 添加id
  contentLibraryName.value = ""
  contentLibraryDialogState.visible = false
}

// 点击子菜单时切换当前显示文件
function changeSubMenu(folder, document) {
  const index = folder.documentContent.findIndex(item => item.id === document.id)
  currentFolder.value = [folder.documentContent[index]]
}

// 关闭该目录时，将显示的文件更改为该目录下的所有文件
function handleChangeMenu(searchIndex) {
  const index = documentStore.contentLibrary.findIndex(item => item.id === searchContent.value[searchIndex].id)
  currentFolder.value = documentStore.contentLibrary[Number(index)].documentContent
}

// 插入内容
function insertContent(document) {
  props.editor?.commands.insertContent(document.content)
}
</script>

<style lang="less" scoped>
.content-library-root {
  width: 360px;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  // 插入内容模块
  .insert-content-container {
    height: 50%;
    .insert-content-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      padding-top: 20px;
      margin-left: 18px;
      font-size: 14px;
      font-weight: bold;
      .content-title {
        display: flex;
        align-items: center;
        span {
          padding-right: 10px;
        }
      }
    }
    .insert-content-card {
      display: flex;
      flex-wrap: wrap;
      padding: 0px 16px;
      box-sizing: border-box;
      height: 82%;
      overflow-y: auto;
      gap: 20px;

      .insert-item {
        width: 150px;
        height: 220px;
        cursor: pointer;
        &:hover {
          .content-item-text {
            background: rgba(0, 0, 0, 0.02);
          }
          .content-item-title {
            color: #999;
          }
        }
        .content-item-text {
          width: 100%;
          height: calc(100% - 30px);
          background: #fff;
          border: 1px solid #dbd9d9;
          box-shadow: 4px 4px #fcfafa;
          font-size: 5px;
          padding: 3px;
          box-sizing: border-box;
          color: #797878;
          overflow: hidden;

          .content-scale-item {
            :deep(span) {
              font-size: initial;
            }
          }
        }
        .content-item-title {
          font-size: 14px;
          margin-top: 10px;
          text-align: center;
          color: #333;
        }
      }
    }
    .insert-content-list {
      margin: 8px 0px 8px 28px;
      height: 82%;
      overflow-y: auto;
      .content-list-item {
        width: 260px;
        height: 70px;
        box-sizing: border-box;
        padding: 12px;
        margin-bottom: 20px;
        background: #edf2f6;
        cursor: pointer;
        .item-title {
          color: #000;
          font-weight: bold;
          font-size: 13px;
        }
        .item-text {
          font-size: 14px;
          margin-top: 6px;
          color: #333;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
  // 内容库目录模块
  .content-catalog {
    overflow-y: auto;
    .content-catalog-title {
      font-size: 14px;
      font-weight: bold;
      padding: 0px 0 24px 12px;
      margin-left: 18px;
    }
    .input-search {
      display: flex;
      align-items: center;
      margin: 0px 30px;

      .icon-plus {
        margin-left: 54px;
        i {
          color: #0c7ffc;
          font-size: 24px;
        }
      }
    }
    .catalog-menu {
      margin: 10px;
      :deep(.el-menu) {
        border-right: none;
        .el-sub-menu__title {
          height: 40px;
          line-height: 40px;

          .el-sub-menu__icon-arrow {
            display: none;
          }
        }
        .el-menu--inline {
          .el-menu-item {
            height: 38px;
            line-height: 38px;
          }
        }
        i {
          color: gray;
          padding-right: 8px;
        }
        .delete-icon {
          position: absolute;
          right: 40px;
        }
        span {
          width: 174px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      :deep(.el-empty) {
        padding: 0;
      }
    }
  }
}
</style>
