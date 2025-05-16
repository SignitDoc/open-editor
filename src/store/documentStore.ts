import { defineStore } from "pinia"
import { getDPI } from "@/utils"
import { CommentItem, ContentFolderItem, PageModeType } from "@/types"

const useDocumentStore = defineStore("DOCUMENT_INFO", {
  state: () => {
    return {
      selection: null as null | Record<string, any>, //当前选择
      editable: true, // 编辑器是否可编辑
      preview: false, //预览模式
      transferDoc: "" as any, //导入数据
      transferTitle: "", //导入标题
      transferType: "", //导入类型
      contentLibrary: [] as Array<ContentFolderItem>, //内容库列表
      commentList: [] as Array<CommentItem>, //当前批注
      isSave: true,
      pageMode: "A4" as PageModeType, //页面模式：A4、A3
      dpi: [96, 96]
    }
  },
  actions: {
    setTransferDoc(doc, type) {
      this.transferDoc = doc
      this.transferType = type
    },
    setTransferTitle(title) {
      title = title.split(".")
      if (title.length >= 2) title.pop()
      title.join("")
      this.transferTitle = title[0]
    },
    setCommentList(commentList) {
      this.commentList = commentList
    },

    setDPI() {
      this.dpi = getDPI()
    }
  }
})

export default useDocumentStore
