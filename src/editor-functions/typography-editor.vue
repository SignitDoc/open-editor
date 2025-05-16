<template>
  <div class="typography-editor-container">
    <HeaderItem
      type="style"
      desc="左对齐"
      icon="ri-align-left"
      :active="editor?.isActive({ textAlign: 'left' })"
      :disabled="!documentStore.editable"
      @click="editor?.chain().focus().setTextAlign('left').run()"
    />
    <HeaderItem
      type="style"
      desc="居中"
      icon="ri-align-center"
      :active="editor?.isActive({ textAlign: 'center' })"
      :disabled="!documentStore.editable"
      @click="editor?.chain().focus().setTextAlign('center').run()"
    />
    <HeaderItem
      type="style"
      desc="右对齐"
      icon="ri-align-right"
      :active="editor?.isActive({ textAlign: 'right' })"
      :disabled="!documentStore.editable"
      @click="editor?.chain().focus().setTextAlign('right').run()"
    />

    <el-dropdown trigger="click" :teleported="false" :disabled="!documentStore.editable">
      <span>
        <HeaderItem type="style" desc="行距" icon="ri-line-height" active />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in lineSpacingOptions"
            :key="item"
            :class="editor?.isActive({ lineHeight: item }) ? 'active-spacing' : ''"
            @click="setLineSpacing(item)"
            >{{ item }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <HeaderItem
      type="style"
      desc="向右缩进"
      icon="ri-indent-increase"
      :disabled="!documentStore.editable"
      @click="props.editor?.commands.indent()"
    />

    <HeaderItem
      type="style"
      desc="回退缩进"
      icon="ri-indent-decrease"
      :disabled="!documentStore.editable"
      @click="props.editor?.commands.outdent()"
    />

    <HeaderItem
      type="style"
      desc="块引用"
      icon="ri-double-quotes-l"
      @click="editor?.chain().focus().toggleBlockquote().run()"
      :active="editor?.isActive('blockquote')"
      :disabled="!editor?.can().toggleBlockquote() || !documentStore.editable"
    />

    <HeaderItem
      type="style"
      desc="有序列表(可通过新的一行输入1. 触发)"
      icon="ri-list-ordered"
      :disabled="!documentStore.editable"
      @click="editor?.chain().focus().toggleOrderedList().run()"
    />

    <HeaderItem
      type="style"
      desc="无序列表(可通过新的一行输入+/-触发)"
      icon="ri-list-unordered"
      :disabled="!documentStore.editable"
      @click="editor?.chain().focus().toggleBulletList().run()"
    />

    <HeaderItem
      type="style"
      desc="待办事项(可通过新的一行输入[ ] 触发)"
      icon="ri-list-check-3"
      :disabled="!documentStore.editable"
      @click="editor?.chain().focus().toggleTaskList().run()"
    />

    <HeaderItem
      type="style"
      desc="下方插入列表"
      v-if="editor?.can().splitListItem('listItem')"
      icon="ri-play-list-add-line"
      :disabled="!documentStore.editable"
      @click="editor?.chain().focus().splitListItem('listItem').run()"
    />

    <HeaderItem
      type="style"
      desc="向右缩进列表"
      v-if="editor?.can().sinkListItem('listItem')"
      icon="ri-play-list-2-fill"
      :disabled="!documentStore.editable"
      @click="editor.chain().focus().sinkListItem('listItem').run()"
    />

    <HeaderItem
      type="style"
      desc="回退"
      v-if="editor?.can().liftListItem('listItem')"
      icon="ri-loop-left-fill"
      :disabled="!documentStore.editable"
      @click="editor.chain().focus().liftListItem('listItem').run()"
    />
  </div>
</template>

<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3"
import HeaderItem from "@/components/header-item.vue"
import { useDocumentStore } from "@/store"
import { DocxDocumentItem } from "@/types"

const documentStore = useDocumentStore()

const props = defineProps<{
  editor: Editor | undefined
  nowDoc: DocxDocumentItem
}>()
/* ======================= 行距 ====================== */
const lineSpacingOptions = [1, 1.15, 1.3, 1.5, 2, 3]

// 设置行距
function setLineSpacing(lineHeight) {
  if (!props.editor) return
  props.editor.commands.setLineSpacing(lineHeight)
}
</script>

<style lang="less" scoped>
.typography-editor-container {
  display: flex;
  align-items: center;
  column-gap: 8px;
}
:deep(.el-dropdown) {
  .active-spacing {
    background: #ecf5ff;
    color: #409eff;
  }
}
</style>

<style lang="scss">
@for $i from 1 through 8 {
  .tt-indent-#{$i} {
    $val: $i * 3rem;
    padding-left: $val;
  }
}

ul[data-type="taskList"] {
  list-style: none;
  padding: 0;

  p {
    margin: 0;
  }

  li {
    display: flex;

    > label {
      flex: 0 0 auto;
      margin-right: 0.5rem;
      user-select: none;
    }

    > div {
      flex: 1 1 auto;
    }

    ul li,
    ol li {
      display: list-item;
    }

    ul[data-type="taskList"] > li {
      display: flex;
    }
  }
}
</style>
