<template>
  <el-tooltip content="表格" placement="top-start" effect="dark" :show-after="500">
    <el-dropdown :disabled="!documentStore.editable">
      <span style="outline: none">
        <i class="ri-table-2"></i>
        <i class="ri-arrow-drop-down-line"></i>
      </span>
      <template #dropdown>
        <el-dropdown-menu style="max-height: 300px; overflow-y: auto">
          <dropdown-button
            @click="editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()"
            :disabled="!editor?.can().insertTable()"
            icon="ri-page-separator"
          >
            插入表格
          </dropdown-button>
          <dropdown-button
            @click="editor?.chain().focus().deleteTable().run()"
            :disabled="!editor?.can().deleteTable()"
            icon="ri-delete-bin-5-line"
          >
            删除表格
          </dropdown-button>

          <dropdown-button
            @click="editor?.chain().focus().addRowBefore().run()"
            :disabled="!editor?.can().addRowBefore()"
            icon="ri-insert-row-top"
          >
            插入行(上方)
          </dropdown-button>
          <dropdown-button
            @click="editor?.chain().focus().addRowAfter().run()"
            :disabled="!editor?.can().addRowAfter()"
            icon="ri-insert-row-bottom"
          >
            插入行(下方)
          </dropdown-button>
          <dropdown-button
            @click="editor?.chain().focus().addColumnBefore().run()"
            :disabled="!editor?.can().addColumnBefore()"
            icon="ri-insert-column-left"
          >
            插入列(左侧)
          </dropdown-button>
          <dropdown-button
            @click="editor?.chain().focus().addColumnAfter().run()"
            :disabled="!editor?.can().addColumnAfter()"
            icon="ri-insert-column-right"
          >
            插入列(右侧)
          </dropdown-button>
          <dropdown-button
            @click="editor?.chain().focus().deleteRow().run()"
            :disabled="!editor?.can().deleteRow()"
            icon="ri-delete-row"
          >
            删除行
          </dropdown-button>
          <dropdown-button
            @click="editor?.chain().focus().deleteColumn().run()"
            :disabled="!editor?.can().deleteColumn()"
            icon="ri-delete-column"
          >
            删除列
          </dropdown-button>
          <dropdown-button
            @click="editor?.chain().focus().mergeCells().run()"
            :disabled="!editor?.can().mergeCells()"
            icon="ri-merge-cells-vertical"
          >
            合并单元格
          </dropdown-button>
          <dropdown-button
            @click="editor?.chain().focus().splitCell().run()"
            :disabled="!editor?.can().splitCell()"
            icon="ri-merge-cells-vertical"
          >
            分割单元格
          </dropdown-button>
          <dropdown-button
            @click="editor?.chain().focus().mergeOrSplit().run()"
            :disabled="!editor?.can().mergeOrSplit()"
            icon="ri-merge-cells-vertical"
          >
            合并/分割单元格
          </dropdown-button>
          <dropdown-button
            @click="editor?.chain().focus().toggleHeaderRow().run()"
            :disabled="!editor?.can().toggleHeaderRow()"
            icon="ri-layout-row-fill"
          >
            设置/取消表头行
          </dropdown-button>
          <dropdown-button
            @click="editor?.chain().focus().toggleHeaderColumn().run()"
            :disabled="!editor?.can().toggleHeaderColumn()"
            icon="ri-layout-column-fill"
          >
            设置/取消表头列
          </dropdown-button>
          <dropdown-button
            @click="editor?.chain().focus().toggleHeaderCell().run()"
            :disabled="!editor?.can().toggleHeaderCell()"
            icon="ri-artboard-2-fill"
          >
            设置/取消表头
          </dropdown-button>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-tooltip>

  <IconColorPicker
    v-model:color="tableCellColor"
    desc="表格颜色"
    icon="ri-rectangle-line"
    :editable="!documentStore.editable"
    @changeColor="changeColor"
  />
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { Editor } from "@tiptap/vue-3"
import { DropdownButton, IconColorPicker } from "@/components"
import { useDocumentStore } from "@/store"

const documentStore = useDocumentStore()

const props = defineProps<{
  editor: Editor | undefined
}>()

const tableCellColor = ref("")

// 修改表格项的背景颜色
function changeColor() {
  props.editor?.chain().focus().setCellAttribute("backgroundColor", tableCellColor.value).run()
}
</script>
