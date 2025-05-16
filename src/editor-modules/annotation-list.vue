<!-- 批注列表 -->
<template>
  <div class="annotation-list-container">
    <div class="annotation-title-wrapper">
      <div>批注列表</div>
      <IconButton label="关闭批注列表" icon="ri-close-line" @click="closeAnnotation"></IconButton>
    </div>

    <!-- 批注列表 -->
    <div v-if="commentGroup.length > 0" id="annotation-list" class="annotation-list-wrapper">
      <!-- 批注组 -->
      <div
        v-for="item in commentGroup"
        :key="item.id"
        class="annotation-group-container"
        :class="groupActiveID === item.id ? 'is-active' : ''"
        :id="item.id"
        :from="item.from"
        :to="item.to"
        @click="clickGroup(item)"
      >
        <div class="group-action-container">
          <div class="action-item" @click="clickAddGroup(item)"><i class="ri-add-line"></i>添加</div>
        </div>

        <!-- 单条批注 -->
        <div v-for="comment in item.comments" :key="comment.id" class="annotation-item-container">
          <div class="user-info-container">
            <img class="user-avatar" :src="defaultAvatar" />
            <div>
              <div class="user-name">{{ comment.userName }}</div>
              <div class="action-container">
                <div>{{ comment.time }}</div>
                <div class="action-item" @click="deleteComment(comment.id)">删除</div>
              </div>
            </div>
          </div>
          <div class="content-container">{{ comment.content }}</div>
        </div>

        <!-- 编辑操作 -->
        <div v-if="groupEditID === item.id" class="edit-container">
          <el-input v-model="annotationState.content" class="group-input" type="textarea" placeholder="请输入批注" />
          <div style="display: flex; align-items: center; justify-content: flex-end">
            <EmojiSelect @add-emoji="emoji => (annotationState.content += emoji.emoji)" />

            <el-button class="edit-action-item" size="small" @click="cancelGroupAdd">取消</el-button>
            <el-button class="edit-action-item" size="small" type="primary" @click="addGroupComment(item)">
              发送
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="annotation-list-wrapper">
      <el-empty description="批注列表为空" style="height: 100%" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from "vue"
import { IconButton, EmojiSelect } from "@/components"
import { useDocumentListStore, useDocumentStore } from "@/store"
import type { CommentItem, DocumentItem } from "@/types"
import { v4 as uuid } from "uuid"
import { Editor } from "@tiptap/vue-3"
import defaultAvatar from "@/assets/default-avatar.png"
import { noop } from "lodash"

const documentStore = useDocumentStore()
const documentListStore = useDocumentListStore()
interface PropsType {
  editor: Editor | undefined
  isAnnotationListCollapse: boolean
  nowDoc: DocumentItem
  addCommentCallback?: (id) => void
}
const props = withDefaults(defineProps<PropsType>(), {
  isAnnotationListCollapse: false,
  addCommentCallback: noop
})

interface CommentGroup {
  id: string
  from: number
  to: number
  comments: Array<CommentItem>
}

// 批注列表
const commentGroup = computed(() => {
  let data: Array<CommentGroup> = []
  documentStore.commentList.forEach(item => {
    if (!item.from || !item.to) return
    const dataIndex = data.findIndex(dataItem => dataItem.from === item.from && dataItem.to === item.to)
    if (dataIndex === -1)
      data.push({
        id: uuid(),
        from: item.from,
        to: item.to,
        comments: [item]
      })
    else {
      data[dataIndex].comments.push(item)
    }
  })
  data = data.sort((a, b) => {
    if (a.from < b.from) return -1
    else if (a.from > b.from) return 1
    else {
      if (a.to <= b.to) return -1
      else return 1
    }
  })
  return data
})

const emits = defineEmits(["update:isAnnotationListCollapse"])

// 关闭弹窗
function closeAnnotation() {
  emits("update:isAnnotationListCollapse", false)
}

/* ============================ 批注组操作 ============================ */

const groupActiveID = ref("")
const groupEditID = ref("")
const annotationState = reactive({
  content: ""
})

// 点击添加组内批注
function clickAddGroup(group) {
  groupEditID.value = group.id
  annotationState.content = ""
}

// 添加组内批注
function addGroupComment(item) {
  if (!props.editor || !annotationState.content) return
  let comment: CommentItem = {
    content: annotationState.content,
    time: new Date().toLocaleString(),
    from: item.from,
    to: item.to
  }

  const commentAll = {
    id: "",
    ...comment,
    userName: "易企签用户",
    userAvatar: ""
  }
  props.editor.commands.addComment(commentAll, { from: item.from, to: item.to })

  const data = {
    ...props.nowDoc,
    content: props.editor?.getJSON()
  }

  documentListStore.edit(data)
  if (props.addCommentCallback) props.addCommentCallback(commentAll.id)
}

// 取消批注
function cancelGroupAdd() {
  groupEditID.value = ""
  annotationState.content = ""
}

// 点击当前批注
function clickGroup(item) {
  // 设置高亮
  groupActiveID.value = item.id
  props.editor?.commands.activeComment(item.comments)

  // 获取当前批注dom
  const editorDom = props.editor?.options.element
  const editorContainerDom = editorDom?.parentElement
  const activeComment = editorContainerDom?.getElementsByClassName("active-comment-item")?.[0] as HTMLElement

  // 滑动
  if (activeComment && editorContainerDom) {
    const top = activeComment.offsetTop - 10
    editorContainerDom.scrollTop = top
  }
}

// 滑动到当前批注
function scrollGroup(position) {
  const listDom = document.getElementById("annotation-list")
  const groupDom = listDom?.children ? [...listDom.children] : []
  const activeDom = groupDom.find(item => {
    const from = item.getAttribute("from")
    const to = item.getAttribute("to")
    if (from === position.from && to === position.to) return item
  }) as HTMLElement | undefined
  // 滑动
  if (activeDom && listDom) {
    // 设置当前选中
    groupActiveID.value = activeDom.getAttribute("id") || ""
    // 设置高亮
    const { from, to } = position
    const group = commentGroup.value.find(item => item.from === Number(from) && item.to === Number(to))
    if (group) props.editor?.commands.activeComment(group.comments)

    // 滑动至当前批注
    const top = activeDom.offsetTop - 10 - listDom.offsetTop
    listDom.scrollTop = top
  }
}

/* ============================ 单条批注操作 ============================ */
// 删除批注
function deleteComment(id) {
  props.editor?.commands.deleteComment(id)
  const data = {
    ...props.nowDoc,
    content: props.editor?.getJSON() || ""
  }
  documentListStore.edit(data)
}

defineExpose({ scrollGroup })
</script>

<style lang="less" scoped>
.annotation-list-container {
  width: 360px;
  height: 100%;
  background: #fff;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  .annotation-title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #c8c9cc;
    padding: 12px;
    box-sizing: border-box;
  }

  .annotation-list-wrapper {
    flex: 1;
    min-height: 0px;
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    padding: 12px;
    overflow-y: auto;
    box-sizing: border-box;
    .annotation-group-container {
      border: 1px solid #c8c9cc;
      border-radius: 5px;
      padding: 12px;
      .group-action-container {
        display: flex;
        justify-content: flex-end;
        column-gap: 12px;
        .action-item {
          cursor: pointer;
          i {
            margin-right: 6px;
          }
          &:hover {
            color: #909399;
          }
        }
      }
      .annotation-item-container {
        background: #f4f4f5;
        border-radius: 5px;
        padding: 12px;
        margin-top: 12px;

        .user-info-container {
          display: flex;
          align-items: center;

          .user-avatar {
            width: 36px;
            height: 36px;
            object-fit: contain;
            border-radius: 50%;
            margin-right: 12px;
          }

          .action-container {
            display: flex;
            font-size: 12px;
            margin-top: 2px;
            color: #909399;
            .action-item {
              margin-left: 12px;
              cursor: pointer;
              &:hover {
                color: #b1b3b8;
              }
            }
          }
        }
        .content-container {
          margin-top: 12px;
        }
      }

      .edit-container {
        .group-input {
          margin: 12px 0px;
        }
        .edit-action-item {
          float: right;
          margin-left: 12px;
        }
      }
    }

    .is-active {
      border-color: #79bbff;
    }
  }
}
</style>
