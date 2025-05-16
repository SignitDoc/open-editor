import { DocumentActionEnum } from "@/enum"
import { DocumentActionType, DocxDocumentItem, HistoryItem } from "@/types"
import { useDocumentStore, useDocumentListStore } from "@/store"
import { v4 as uuid } from "uuid"
import { Ref } from "vue"
const useSaveWord = (
  actionType: DocumentActionType,
  title: string,
  wordContent: "" | Record<string, any>,
  loading: Ref<boolean>,
  oldDoc: DocxDocumentItem | null,
  type: "word",
  callback?: (document: DocxDocumentItem) => void
) => {
  if (actionType !== DocumentActionEnum.Create && !oldDoc) throw new Error("编辑文档时，oldDoc不可为空")
  const documentStore = useDocumentStore()
  // 存储时间
  const saveTime = new Date().getTime()

  // 存储历史
  const localHistoryArray: Array<HistoryItem> = oldDoc?.history || []
  const item = {
    time: saveTime,
    content: wordContent,
    title: title || "未命名文档",
    changer: "易企签用户",
    actionType: actionType
  }
  localHistoryArray.unshift(item)

  const document: DocxDocumentItem = {
    _id: oldDoc?._id || "",
    type: actionType === DocumentActionEnum.Create || !oldDoc?.type ? type : oldDoc?.type,
    history: localHistoryArray,
    title: title || "未命名文档",
    updateTime: saveTime,
    createdTime: actionType === DocumentActionEnum.Create || !oldDoc?.type ? saveTime : oldDoc?.createdTime,
    content: wordContent,
    creator: oldDoc?.creator || "易企签用户",
    versionList: oldDoc?.versionList || [],
    commentList: documentStore.commentList,
    pageMode: documentStore.pageMode
  }

  // 版本生成插入数据
  if (actionType === DocumentActionEnum.Release) {
    document.versionList.unshift({
      id: uuid(),
      changer: "易企签用户",
      title: title || "未命名文档",
      content: wordContent,
      time: saveTime
    })
  }

  // 正在写新建编辑到store中，要改CommonDocumentItem结构，把用户相关的剔除但是留下用户名称，默认写入“易企签用户”
  // 首次新增
  const documentListStore = useDocumentListStore()
  loading.value = true
  if (actionType === DocumentActionEnum.Create) {
    // 新增
    const id = uuid()
    document._id = id
    documentListStore.create(document)
  } else {
    documentListStore.edit(document)
  }
  documentStore.$patch({ isSave: true })
  loading.value = false
  callback && callback(document)
}

export default useSaveWord
