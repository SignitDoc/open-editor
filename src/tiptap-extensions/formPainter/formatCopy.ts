import type { JSONContent, ChainedCommands } from '@tiptap/core'

const editorClass = 'ProseMirror'

function eleIncludesTags(ele: HTMLElement, tags: string[]) {
  return tags.includes(ele.nodeName)
}
function eleIncludesClasses(ele: HTMLElement, classes: string[]) {
  if (!ele || !ele.classList) return false
  const classList = ele.classList
  return !!classes.find((classname) => classList?.contains(classname))
}
function getIndexInParentElement(ele: HTMLElement) {
  return Array.from(ele.parentElement?.childNodes || []).indexOf(ele)
}

type EleDataType = {
  id: string | undefined
  index: number
  isTable: boolean
  isLi: boolean
}
export type TStateNotify = (isEnable: boolean) => void

class FormatCopy {
  private _isCopying: boolean
  get isCopying(): boolean {
    return this._isCopying
  }
  private _cache: JSONContent | undefined
  get cacheData(): JSONContent | undefined {
    return this._cache
  }
  private _once: boolean
  private _selectionChangeCb

  public getChain?: () => ChainedCommands
  public stateNotifyList: TStateNotify[] = []

  constructor() {
    this._isCopying = false
    this._once = true
    this._cache = undefined
    this._selectionChangeCb = this.SelectionChange.bind(this)
  }

  private _getSelectionEle(): HTMLElement | null {
    const selection = window.getSelection()
    if (!selection || !selection.anchorNode) return null

    const selectEle = selection.anchorNode as HTMLElement
    if (
      eleIncludesTags(selectEle, ['UL', 'OL', 'TABLE', 'TR', 'CODE', 'BODY']) ||
      eleIncludesClasses(selectEle, [editorClass, 'code-block'])
    ) {
      return null
    }
    return selectEle
  }

  private _getSelectionEleDataId(anchorNode: HTMLElement): EleDataType | null {
    let selectEle = anchorNode
    let selectEleIndex = getIndexInParentElement(selectEle)
    let selectEleDataId = ''
    while (
      selectEle !== document.body &&
      !eleIncludesClasses(selectEle, [editorClass]) &&
      !eleIncludesTags(selectEle, ['LI', 'TH', 'TD'])
    ) {
      if (eleIncludesClasses(selectEle, ['code-block'])) return null

      if (selectEle.dataset?.id) {
        selectEleDataId = selectEle.dataset.id
        break
      }
      selectEleIndex = getIndexInParentElement(selectEle)
      selectEle = selectEle.parentElement as HTMLElement
    }
    if (!selectEleDataId) return null
    selectEle = selectEle.parentElement as HTMLElement
    const isTable = eleIncludesTags(selectEle, ['TH', 'TD'])
    const isLi = eleIncludesTags(selectEle, ['LI'])
    return { id: selectEleDataId, index: selectEleIndex, isTable, isLi }
  }

  Copy(once: boolean, getJSON: () => JSONContent) {
    if (this._isCopying) return console.log('copying')

    const anchorNode = this._getSelectionEle()
    if (!anchorNode) return console.log('no selection element')

    const selectEle = this._getSelectionEleDataId(anchorNode)
    if (!selectEle) return console.log('not available element', selectEle)

    const jsonList = getJSON()?.content || []
    let currJson = jsonList.find((item) => item?.attrs?.id === selectEle.id)
    // 复制 table 内的样式
    if (!currJson && selectEle.isTable)
      currJson = this._findMarksInTable(jsonList, selectEle)
    // 复制 ul, ol 内的样式
    if (!currJson && selectEle.isLi)
      currJson = this._findMarksInLi(jsonList, selectEle)
    if (!currJson) return console.log('did not find marks', selectEle)

    const marks =
      currJson.content && currJson.content.length > selectEle.index
        ? currJson.content[selectEle.index].marks
        : currJson.marks
    this._cache = { type: currJson.type, attrs: currJson.attrs, marks }
    console.log('cache marks:', this._cache)
    this._isCopying = true
    this._once = once
    this._listenSelectionChange()
    this._notifyState()
    document.body.querySelector(`.${editorClass}`)?.classList.add('formatPainting')
  }

  private _findMarksInTable(jsonList: JSONContent[], selectEle: EleDataType) {
    let currJson = undefined
    const tables = jsonList.filter((item) => item.type === 'table')
    tables.find((item) =>
      item.content?.find((tr) =>
        tr.content?.find((td) =>
          td.content?.find((tdinn) => {
            if (tdinn?.attrs?.id === selectEle.id) {
              currJson = tdinn
              return true
            } else {
              return false
            }
          })
        )
      )
    )
    return currJson
  }
  private _findMarksInLi(jsonList: JSONContent[], selectEle: EleDataType) {
    let currJson = undefined
    const uls = jsonList.filter((item) =>
      ['bulletList', 'orderedList'].includes(item.type || '')
    )
    uls.find((item) =>
      item.content?.find((li) =>
        li.content?.find((tdinn) => {
          if (tdinn?.attrs?.id === selectEle.id) {
            // console.log('-------------:', tdinn, item)
            currJson = tdinn
            return true
          } else {
            return false
          }
        })
      )
    )
    return currJson
  }

  SelectionChange() {
    if (!this.getChain) return this.Stop();
    let chain = this.getChain()
    chain = chain.focus().unsetAllMarks().clearNodes()
    // cmd.clearNodes()

    if (this._cache?.marks) {
      this._cache?.marks.forEach(({ type, attrs }) => {
        console.log('应用样式：', type, { ...attrs })
        chain = chain.setMark(type, attrs)
      })
    }
    if (this._cache?.attrs) {
      const attrs = this._cache?.attrs
      if (attrs.level) {
        // @ts-ignore
        chain = chain.setHeading({ level: attrs.level })
        // console.log('应用属性： heading', attrs.level)
      }
      if (attrs.textAlign) {
        // @ts-ignore
        chain = chain.setTextAlign(attrs.textAlign)
        // console.log('应用属性： textAlign', attrs.textAlign)
      }
      chain.run()
      // 未处理的格式如下
      // isActive('tableCell')
      // isActive('listItem')) {
      // isActive('bulletList', { class: opt })
      // isActive('bulletList')
      // isActive('orderedList', { class: opt })
      // isActive('orderedList')
    }

    if (this._once) this.Stop()
  }

  private _listenSelectionChange() {
    const options = this._once ? { once: true } : undefined
    document.body.addEventListener('mouseup', this._selectionChangeCb, options)
  }

  Stop() {
    console.log('格式刷 结束')
    this._isCopying = false
    this._cache = undefined
    this._notifyState()
    document.body.querySelector(`.${editorClass}`)?.classList.remove('formatPainting')
    document.body.removeEventListener('mouseup', this._selectionChangeCb)
  }

  private _notifyState() {
    this.stateNotifyList.forEach(fn => fn(this._isCopying))
  }
}

export default new FormatCopy()
