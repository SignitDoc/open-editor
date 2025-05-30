import { defineStore } from "pinia"
import { DocumentItem } from "@/types"
import { Message } from "@/utils"
import { initDocList } from "@/pages/document-home/doc-list"

// 文档列表存储
const useDocumentListStore = defineStore("DOCUMENT_LIST", {
  state: () => {
    return {
      isInit: false, // 是否初始化，false显示doc-list.ts的数据,true显示listData
      listData: [] as Array<DocumentItem>
    }
  },
  actions: {
    setInit(){
      if(this.isInit) return

      this.isInit = true
      this.listData = initDocList as Array<any>
    },
    create(doc) {
      this.listData.push(doc)
    },
    edit(doc) {
      const index = this.listData.findIndex(item => item._id === doc._id)
      if (index === -1) {
        Message.error("文档不存在")
        throw new Error("文档不存在")
      }
      this.listData[index] = doc
    },
    editAttrs(docId, attrs) {
      const index = this.listData.findIndex(item => item._id === docId)
      if (index === -1) {
        Message.error("文档不存在")
        throw new Error("文档不存在")
      }
      this.listData[index] = { ...this.listData[index], ...attrs }
    },
    delete(documentsId) {
      this.listData = this.listData.filter(item => {
        return !documentsId.includes(item._id)
      })
    },
    getDetail(id) {
      return this.listData.find(item => item._id === id)
    }
  },
  persist: true
})

export default useDocumentListStore
