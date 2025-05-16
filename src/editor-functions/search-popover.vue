<template>
  <el-tooltip
    effect="dark"
    :content="documentStore.editable ? '查找替换' : '查找'"
    placement="top-start"
    :disabled="!justIcon"
  >
    <span>
      <el-popover trigger="click" :width="280">
        <template #reference>
          <div
            v-if="!justIcon"
            style="width: 100%; display: flex; flex-direction: column; align-items: center; font-size: 12px"
          >
            <i class="ri-search-line" style="font-size: 24px; color: gray"></i>
            搜索
          </div>
          <i v-else class="ri-search-line"></i>
        </template>
        <!-- 搜索悬浮窗 -->
        <div class="search-popover">
          <el-input v-model="searchValue" placeholder="请输入搜索值" @keydown.enter="handleKeyDown">
            <!-- 搜索index操作提示栏 -->
            <template #suffix>
              <div v-if="searchTotal > 0" class="search-count">
                <i
                  class="ri-arrow-left-s-line"
                  :class="props.editor?.storage?.searchAndReplace?.canPrev ? '' : 'disabled-action'"
                  @click="prevSearch"
                ></i>
                <span class="search-index">{{ currentSearchIndex + 1 }}</span>
                <span>/</span>
                <span>{{ searchTotal }}</span>
                <i
                  class="ri-arrow-right-s-line"
                  :class="props.editor?.storage?.searchAndReplace?.canNext ? '' : 'disabled-action'"
                  @click="nextSearch"
                ></i>
              </div>
              <div v-else-if="currentSearchIndex >= 0" class="result-hint">无结果</div>
            </template>
          </el-input>
          <el-input
            v-if="documentStore.editable"
            v-model="replaceValue"
            placeholder="请输入替换值"
            @keydown.enter="handleKeyDown"
          />

          <!-- 操作列表 -->
          <div class="action-list">
            <el-button @click="e => searchEditorValue(true)" type="primary" plain>搜索</el-button>
            <el-button v-if="documentStore.editable" type="primary" @click="replace">替换</el-button>
            <el-button v-if="documentStore.editable" type="primary" @click="replaceAll">替换所有</el-button>
          </div>
        </div>
      </el-popover>
    </span>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue"
import { Editor } from "@tiptap/vue-3"
import { useDocumentStore } from "@/store"

const documentStore = useDocumentStore()

interface PropsType {
  editor: Editor | undefined
  justIcon?: boolean //仅展示图标
}
const props = withDefaults(defineProps<PropsType>(), { justIcon: true })

const searchTotal = ref(0)
const currentSearchIndex = ref(-1)
const searchValue = ref("")
const replaceValue = ref("")

// 清除筛选
watch(
  () => searchValue.value,
  val => {
    if (!val) {
      searchEditorValue(false)
    }
  }
)

onBeforeUnmount(() => {
  searchValue.value = ""
  searchEditorValue(false)
})

// 键盘事件
function handleKeyDown(e) {
  // 回车搜索
  if (e.keyCode === 13 && searchValue.value) searchEditorValue(true)
}

// 搜索
function searchEditorValue(isSearch) {
  if (!props.editor) return
  props.editor.commands.setSearchTerm(searchValue.value)
  const total = props.editor.extensionStorage?.searchAndReplace?.total
  searchTotal.value = total || 0
  currentSearchIndex.value = isSearch ? 0 : -1
}

// 上一个
function prevSearch() {
  if (!props.editor || !props.editor.storage.searchAndReplace?.canPrev) return
  props.editor.commands.prevSearch()
  currentSearchIndex.value = props.editor.storage.searchAndReplace?.currentIndex
}

// 下一个
function nextSearch() {
  if (!props.editor || !props.editor.storage.searchAndReplace?.canNext) return
  props.editor.commands.nextSearch()
  currentSearchIndex.value = props.editor.storage.searchAndReplace?.currentIndex
}

// 重置当前index
function replace() {
  if (!props.editor) return
  props.editor.commands.setReplaceTerm(replaceValue.value)
  props.editor.commands.replace()
  const total = props.editor.extensionStorage?.searchAndReplace?.total
  searchTotal.value = total || 0
  currentSearchIndex.value = 0
}

// 重置所有
function replaceAll() {
  if (!props.editor) return
  props.editor.commands.setReplaceTerm(replaceValue.value)
  props.editor.commands.replaceAll()
  const total = props.editor.extensionStorage?.searchAndReplace?.total
  searchTotal.value = total || 0
  currentSearchIndex.value = 0
}
</script>

<style lang="less" scoped>
.search-popover {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  :deep(.el-input) {
    .ri-close-circle-line {
      color: transparent;
      line-height: 1;
    }
    &:hover {
      .ri-close-circle-line {
        color: #a8abb2;
        line-height: 1;
      }
    }
  }

  .search-count {
    display: flex;
    align-items: center;
    column-gap: 5px;
    line-height: 1;
    color: #a8abb2;

    .search-index {
      color: #606266;
    }

    .disabled-action {
      color: #a8abb2;
      cursor: not-allowed;
    }
  }
  .result-hint {
    color: #a8abb2;
    line-height: 1;
    margin-left: 5px;
  }
}

.action-list {
  display: flex;
  :deep(.el-button) {
    flex: 1;
  }
}
</style>
