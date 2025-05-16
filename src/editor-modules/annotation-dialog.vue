<template>
  <DialogContainer
    title="批注"
    v-model:visible="globalStore.annotationVisible"
    :width="800"
    :no-footer="true"
    :close-callback="handleDialogClose"
  >
    <!-- 添加批注 -->
    <el-form label-suffix=":" label-width="50px">
      <el-form-item label="批注">
        <el-input v-model="annotationState.content" type="textarea" placeholder="请输入批注"></el-input>
      </el-form-item>
      <el-form-item label="">
        <div style="display: flex; align-items: center; justify-content: flex-end; width: 100%">
          <EmojiSelect style="margin-right: 12px" @add-emoji="emoji => (annotationState.content += emoji.emoji)" />
          <el-button type="primary" @click="addAnnotation">确认</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!-- 分割线 -->
    <el-divider style="margin: 12px 0px" />

    <!-- 批注列表 -->
    <div>
      <div class="annotation-title">批注列表</div>
      <div>
        <div v-if="selectedAnnotation.length > 0" class="annotation-list" style="height: 300px; overflow-y: auto">
          <div v-for="item in selectedAnnotation" :key="item.id" class="annotation-item">
            <div class="annotation-user">
              <img class="user-avatar" :src="defaultAvatar" />

              <div class="user-name">{{ item.userName }}</div>
              <div class="annotation-time">{{ item.time }}</div>
              <el-button class="delete-btn" link @click="deleteComment(item)">删除</el-button>
            </div>
            <div class="annotation-content">{{ item.content }}</div>
          </div>
        </div>
        <div v-else>
          <el-empty description="暂无批注" style="height: 300px"></el-empty>
        </div>
      </div>
    </div>
  </DialogContainer>
</template>

<script setup lang="ts">
import { reactive, computed, ref, watch } from "vue"
import { DialogContainer, EmojiSelect } from "@/components"
import { useGlobalStore, useDocumentStore, useDocumentListStore } from "@/store"
import { Editor } from "@tiptap/vue-3"
import { DocxDocumentItem } from "@/types"
import defaultAvatar from "@/assets/default-avatar.png"
import { Message } from "@/utils"
import type { CommentItem } from "@/types"
import { noop } from "lodash"

interface PropsType {
  editor: Editor | undefined
  nowDoc: DocxDocumentItem
  addCommentCallback?: (id) => void
}

const props = withDefaults(defineProps<PropsType>(), {
  addCommentCallback: noop
})

const globalStore = useGlobalStore()
const documentStore = useDocumentStore()
const documentListStore = useDocumentListStore()

const annotationState = reactive({
  content: ""
})

// 打开弹窗
watch(
  () => globalStore.annotationVisible,
  val => {
    if (val) annotationState.content = ""
  },
  { immediate: true }
)

// 获取批注列表
const selectedAnnotation = computed(() => {
  const selection = documentStore.selection
  if (!selection) return []
  return documentStore.commentList.filter(item => {
    return item.from === selection.from && item.to === selection.to
  })
})

// 添加批注
function addAnnotation() {
  if (!props.nowDoc._id) return Message.error("文件暂未保存，请保存后再添加批注。")
  if (!props.editor || !annotationState.content) return
  let comment: CommentItem = {
    content: annotationState.content,
    time: new Date().toLocaleString()
  }

  const commentAll = {
    id: "",
    ...comment,
    userName: "易企签用户",
    userAvatar: ""
  }
  props.editor?.commands.addComment(commentAll)

  const data = {
    ...props.nowDoc,
    content: props.editor?.getJSON() || ""
  }

  documentListStore.edit(data)
  if (props.addCommentCallback) props.addCommentCallback(commentAll.id)
  annotationState.content = ""
}

// 删除批注
function deleteComment(row) {
  props.editor?.commands.deleteComment(row.id)
  const data = {
    ...props.nowDoc,
    content: props.editor?.getJSON() || ""
  }
  documentListStore.edit(data)
}

// 关闭弹窗
function handleDialogClose() {
  annotationState.content = ""
  if (!props.editor) return
  props.editor.commands.setTextSelection(0)
}
</script>

<style scoped lang="less">
.annotation-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}
.annotation-list {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  padding-right: 10px;

  .annotation-item {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 12px;
    .annotation-user {
      display: flex;
      align-items: center;
      .user-avatar {
        width: 28px;
        height: 28px;
        object-fit: cover;
        border-radius: 50%;
      }

      .user-name {
        margin: 0px 10px;
        max-width: calc(100% - 180px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .annotation-time {
        color: #999;
      }

      .delete-btn {
        width: fit-content;
        margin: 0px 10px;
        padding: 0px;
        line-height: 1;
        height: fit-content;
      }
    }
    .annotation-content {
      margin-left: 38px;
      margin-top: 5px;
    }
  }
}
</style>
