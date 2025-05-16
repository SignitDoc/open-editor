<template>
  <div class="menu-container table-menu">
    <ContextMenuItem
      @click="
        e => {
          // disabled时点击不会关闭菜单
          if (!props.editor?.can().deleteTable()) e.stopPropagation()
          else props.editor?.chain().focus().deleteTable().run()
        }
      "
      :disabled="!props.editor?.can().deleteTable()"
    >
      <template #icon><i class="ri-delete-bin-5-line"></i></template>
      <span>删除表格</span>
    </ContextMenuItem>

    <ContextMenuItem
      @click="
        e => {
          if (!props.editor?.can().addRowBefore()) e.stopPropagation()
          else props.editor?.chain().focus().addRowBefore().run()
        }
      "
      :disabled="!props.editor?.can().addRowBefore()"
    >
      <template #icon><i class="ri-insert-row-top"></i></template>

      <span>插入行(上方)</span>
    </ContextMenuItem>

    <ContextMenuItem
      @click="
        e => {
          if (!props.editor?.can().addRowAfter()) e.stopPropagation()
          else props.editor?.chain().focus().addRowAfter().run()
        }
      "
      :disabled="!props.editor?.can().addRowAfter()"
    >
      <template #icon><i class="ri-insert-row-bottom"></i></template>

      <span>插入行(下方)</span>
    </ContextMenuItem>

    <ContextMenuItem
      @click="
        e => {
          if (!props.editor?.can().addColumnBefore()) e.stopPropagation()
          else props.editor?.chain().focus().addColumnBefore().run()
        }
      "
      :disabled="!props.editor?.can().addColumnBefore()"
    >
      <template #icon><i class="ri-insert-column-left"></i></template>

      <span>插入列(左侧)</span>
    </ContextMenuItem>

    <ContextMenuItem
      @click="
        e => {
          if (!props.editor?.can().addColumnAfter()) e.stopPropagation()
          else props.editor?.chain().focus().addColumnAfter().run()
        }
      "
      :disabled="!props.editor?.can().addColumnAfter()"
    >
      <template #icon><i class="ri-insert-column-right"></i></template>

      <span>插入列(右侧)</span>
    </ContextMenuItem>

    <ContextMenuItem
      @click="
        e => {
          if (!props.editor?.can().deleteRow()) e.stopPropagation()
          else props.editor?.chain().focus().deleteRow().run()
        }
      "
      :disabled="!props.editor?.can().deleteRow()"
    >
      <template #icon><i class="ri-delete-row"></i></template>
      <span>删除行</span>
    </ContextMenuItem>

    <ContextMenuItem
      @click="
        e => {
          if (!props.editor?.can().deleteColumn()) e.stopPropagation()
          else props.editor?.chain().focus().deleteColumn().run()
        }
      "
      :disabled="!props.editor?.can().deleteColumn()"
    >
      <template #icon><i class="ri-delete-column"></i></template>

      <span>删除列</span>
    </ContextMenuItem>

    <ContextMenuItem
      @click="
        e => {
          if (!props.editor?.can().mergeCells()) e.stopPropagation()
          else props.editor?.chain().focus().mergeCells().run()
        }
      "
      :disabled="!props.editor?.can().mergeCells()"
    >
      <template #icon><i class="ri-merge-cells-vertical"></i></template>

      <span>合并单元格</span>
    </ContextMenuItem>

    <ContextMenuItem
      @click="
        e => {
          if (!props.editor?.can().splitCell()) e.stopPropagation()
          else props.editor?.chain().focus().splitCell().run()
        }
      "
      :disabled="!props.editor?.can().splitCell()"
    >
      <template #icon><i class="ri-merge-cells-vertical"></i></template>
      <span>分割单元格</span>
    </ContextMenuItem>

    <ContextMenuItem
      @click="
        e => {
          if (!props.editor?.can().mergeOrSplit()) e.stopPropagation()
          else props.editor?.chain().focus().mergeOrSplit().run()
        }
      "
      :disabled="!props.editor?.can().mergeOrSplit()"
    >
      <template #icon><i class="ri-merge-cells-vertical"></i></template>
      <span>合并/分割单元格</span>
    </ContextMenuItem>

    <ContextMenuItem
      @click="
        e => {
          if (!props.editor?.can().toggleHeaderRow()) e.stopPropagation()
          else props.editor?.chain().focus().toggleHeaderRow().run()
        }
      "
      :disabled="!props.editor?.can().toggleHeaderRow()"
    >
      <template #icon><i class="ri-layout-row-fill"></i></template>

      <span>设置/取消表头行</span>
    </ContextMenuItem>

    <ContextMenuItem
      @click="
        e => {
          if (!props.editor?.can().toggleHeaderColumn()) e.stopPropagation()
          else props.editor?.chain().focus().toggleHeaderColumn().run()
        }
      "
      :disabled="!props.editor?.can().toggleHeaderColumn()"
    >
      <template #icon><i class="ri-layout-column-fill"></i></template>

      <span>设置/取消表头列</span>
    </ContextMenuItem>

    <ContextMenuItem
      @click="
        e => {
          if (!props.editor?.can().toggleHeaderCell()) e.stopPropagation()
          else props.editor?.chain().focus().toggleHeaderCell().run()
        }
      "
      :disabled="!props.editor?.can().toggleHeaderCell()"
    >
      <template #icon><i class="ri-artboard-2-fill"></i></template>
      <span>设置/取消表头</span>
    </ContextMenuItem>
  </div>
</template>

<script setup lang="ts">
import { Editor } from "@tiptap/vue-3"
import { ContextMenuItem } from "@/components"

const props = defineProps<{
  editor: Editor | undefined
}>()
</script>
