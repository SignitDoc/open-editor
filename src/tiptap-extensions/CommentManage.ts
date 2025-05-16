// 批注
import { Extension } from "@tiptap/core"
import { uniqueId } from "lodash"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { Decoration, DecorationSet } from "@tiptap/pm/view"
import { CommentItem } from "@/types"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    CommentManage: {
      /**
       * @description 初始化批注
       */
      initComment: (commentList?: Array<CommentItem>) => ReturnType
      /**
       * @description 添加批注
       */
      addComment: (comment?: CommentItem, position?: { from: number; to: number }) => ReturnType

      /**
       * @description 删除批注
       */
      deleteComment: (commentId: string) => ReturnType
      /**
       * @description 当前选中批注
       */
      activeComment: (commentId: Array<CommentItem>) => ReturnType
    }
  }
}

export const CommentManagePluginKey = new PluginKey("CommentManagePlugin")
let commentChange = false

const CommentManage = Extension.create({
  name: "CommentManage",
  addStorage() {
    return {
      comment: null,
      commentList: [],
      activeComments: []
    }
  },

  addOptions() {
    return {
      onCommentChange: (comment: CommentItem, commentList: Array<CommentItem>) => ({
        comment,
        commentList
      })
    }
  },

  addCommands() {
    return {
      // 初始化批注
      initComment:
        (commentList?: Array<CommentItem>) =>
        ({ editor }) => {
          editor.storage.CommentManage.commentList = commentList || []
          editor.storage.CommentManage.activeComments = []

          return true
        },

      // 添加批注
      addComment:
        (comment?: CommentItem, position?: { from: number; to: number }) =>
        ({ tr, editor }) => {
          const from = position?.from ? position.from : tr.selection.from
          const to = position?.to ? position.to : tr.selection.to
          // 判断是否有交叉
          const isCross = this.storage.commentList.find(item => {
            if (from !== item.from || to !== item.to)
              return (from >= item.from && from < item.to) || (to > item.from && to <= item.to)
          })

          if (isCross) return false

          if (comment) {
            comment.id = new Date().getTime() + uniqueId()
            comment.from = from
            comment.to = to
            commentChange = true
            editor.storage.CommentManage.comment = comment
            editor.storage.CommentManage.commentList.push(comment)
          }
          return true
        },

      // 删除批注
      deleteComment:
        (commentId: string) =>
        ({ editor }) => {
          if (!commentId) return false

          const { activeComments } = editor.storage.CommentManage

          const index = editor.storage.CommentManage.commentList.findIndex(item => item.id === commentId)
          commentChange = true
          if (activeComments.findIndex(item => item.id === commentId) !== -1) {
            editor.storage.CommentManage.activeComments = []
          }
          editor.storage.CommentManage.commentList.splice(index, 1)
          return true
        },

      // 当前批注
      activeComment:
        (comments: Array<CommentItem>) =>
        ({ editor }) => {
          if (!comments || comments.length === 0) return false

          editor.storage.CommentManage.activeComments = comments
          return true
        }
    }
  },

  addProseMirrorPlugins() {
    const editor = this.editor
    const { onCommentChange } = this.options
    return [
      new Plugin({
        key: CommentManagePluginKey,
        state: {
          init: () => DecorationSet.empty,
          apply: (tr, value, oldState, newState) => {
            const { doc } = tr
            const { commentList, comment, activeComments } = editor.storage.CommentManage
            const decorationsArray: Decoration[] = []
            if (!commentList) return DecorationSet.empty
            if (commentChange) {
              onCommentChange(comment, commentList)
              commentChange = false
            }

            commentList.forEach(item => {
              // 编辑文档时，更新批注位置(文档内容发生变化: tr.selectionSet && tr.docChanged)
              if (tr.selectionSet && tr.docChanged) {
                item.from = tr.mapping.map(item.from)
                item.to = tr.mapping.map(item.to)
              }

              if (item.from !== item.to)
                decorationsArray.push(
                  Decoration.inline(item.from, item.to, {
                    class: "comment-item",
                    from: item.from,
                    to: item.to,
                    id: item.id
                  })
                )
              // item.from = item.to说明该批注的文本内容已经被删除，因此相关批注也将被删除
              else editor.commands.deleteComment(item.id)
            })

            // 当前选中高亮
            if (activeComments.length > 0) {
              const activePosition = {
                from: activeComments[0].from,
                to: activeComments[0].to
              }
              decorationsArray.push(
                Decoration.inline(activePosition.from, activePosition.to, { class: "active-comment-item" })
              )
            }
            if (decorationsArray.length > 0) {
              const test = DecorationSet.create(doc, decorationsArray)
              return test
            } else return DecorationSet.empty
          }
        },
        props: {
          decorations(state) {
            return this.getState(state)
          }
        }
      })
    ]
  }
})

export default CommentManage
