// MIT License

// Copyright (c) 2023 Jeet Mandaliya (Github Username: sereneinserenade)

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { Extension, Range } from "@tiptap/core"
import { Decoration, DecorationSet } from "@tiptap/pm/view"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { Node as PMNode } from "@tiptap/pm/model"
import { processSearches } from "./utils/index"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    search: {
      /**
       * @description Set search term in extension.
       */
      setSearchTerm: (searchTerm: string) => ReturnType
      /**
       * @description Set replace term in extension.
       */
      setReplaceTerm: (replaceTerm: string) => ReturnType
      /**
       * @description Replace first instance of search result with given replace term.
       */
      replace: () => ReturnType
      /**
       * @description Replace all instances of search result with given replace term.
       */
      replaceAll: () => ReturnType
      /**
       * @description 下一个.
       */
      nextSearch: () => ReturnType
      /**
       * @description 上一个.
       */
      prevSearch: () => ReturnType
    }
  }
}

const getRegex = (s: string, disableRegex: boolean, caseSensitive: boolean): RegExp => {
  return RegExp(disableRegex ? s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") : s, caseSensitive ? "gu" : "gui")
}

function setCurrentClass(doc: PMNode, currentIndex: number, classArray: Array<string>, results: Range[]) {
  const decorations: Decoration[] = []

  for (let i = 0; i < results.length; i += 1) {
    const r = results[i]
    const decorationClass = i === currentIndex ? classArray.join(" ") : classArray[0]
    decorations.push(Decoration.inline(r.from, r.to, { class: decorationClass }))
  }

  return DecorationSet.create(doc, decorations)
}

const replace = (replaceTerm: string, currentIndex: number, results: Range[], { state, dispatch }: any) => {
  if (currentIndex < 0 || currentIndex >= results.length) return
  const firstResult = results[currentIndex]

  if (!firstResult) return

  const { from, to } = results[currentIndex]

  if (dispatch) dispatch(state.tr.insertText(replaceTerm, from, to))
}

const rebaseNextResult = (
  replaceTerm: string,
  index: number,
  lastOffset: number,
  results: Range[]
): [number, Range[]] | null => {
  const nextIndex = index + 1

  if (!results[nextIndex]) return null

  const { from: currentFrom, to: currentTo } = results[index]

  const offset = currentTo - currentFrom - replaceTerm.length + lastOffset

  const { from, to } = results[nextIndex]

  results[nextIndex] = {
    to: to - offset,
    from: from - offset
  }

  return [offset, results]
}

const replaceAll = (replaceTerm: string, results: Range[], { tr, dispatch }: any) => {
  let offset = 0

  let resultsCopy = results.slice()

  if (!resultsCopy.length) return

  for (let i = 0; i < resultsCopy.length; i += 1) {
    const { from, to } = resultsCopy[i]

    tr.insertText(replaceTerm, from, to)

    const rebaseNextResultResponse = rebaseNextResult(replaceTerm, i, offset, resultsCopy)

    if (!rebaseNextResultResponse) continue

    offset = rebaseNextResultResponse[0]
    resultsCopy = rebaseNextResultResponse[1]
  }

  dispatch(tr)
}

export const searchAndReplacePluginKey = new PluginKey("searchAndReplacePlugin")

export interface SearchAndReplaceOptions {
  searchResultClass: string
  currentSearchClass: string
  caseSensitive: boolean
  disableRegex: boolean
}

export interface SearchAndReplaceStorage {
  searchTerm: string
  replaceTerm: string
  results: Range[]
  lastSearchTerm: string
  currentIndex: number
  total: number
}

export const SearchAndReplace = Extension.create<SearchAndReplaceOptions, SearchAndReplaceStorage>({
  name: "searchAndReplace",

  addOptions() {
    return {
      searchResultClass: "search-result",
      currentSearchClass: "current-search",
      caseSensitive: false,
      disableRegex: true
    }
  },

  addStorage() {
    return {
      total: 0, //搜索总数
      currentIndex: 0, //当前索引
      lastIndex: 0,
      searchTerm: "", //搜索值
      replaceTerm: "", //替换值
      results: [], //搜索结果
      lastSearchTerm: "", //上一次搜索值
      canPrev: false, //是否可以切换上一个
      canNext: false //是否可以切换下一个
    }
  },

  addCommands() {
    return {
      setSearchTerm:
        (searchTerm: string) =>
        ({ editor }) => {
          // 每次搜索索引置0
          editor.storage.searchAndReplace.currentIndex = 0
          editor.storage.searchAndReplace.searchTerm = searchTerm
          return false
        },
      setReplaceTerm:
        (replaceTerm: string) =>
        ({ editor }) => {
          editor.storage.searchAndReplace.replaceTerm = replaceTerm

          return false
        },
      replace:
        () =>
        ({ editor, state, dispatch }) => {
          const { replaceTerm, results, currentIndex } = editor.storage.searchAndReplace
          replace(replaceTerm, currentIndex, results, { state, dispatch })
          editor.storage.searchAndReplace.currentIndex = 0

          return false
        },
      replaceAll:
        () =>
        ({ editor, tr, dispatch }) => {
          const { replaceTerm, results } = editor.storage.searchAndReplace
          replaceAll(replaceTerm, results, { tr, dispatch })
          editor.storage.searchAndReplace.currentIndex = 0

          return false
        },
      nextSearch:
        () =>
        ({ editor }) => {
          editor.storage.searchAndReplace.currentIndex += 1
          return false
        },
      prevSearch:
        () =>
        ({ editor }) => {
          editor.storage.searchAndReplace.currentIndex -= 1
          return false
        }
    }
  },

  addProseMirrorPlugins() {
    const editor = this.editor
    const { searchResultClass, currentSearchClass, disableRegex, caseSensitive } = this.options

    const setLastSearchTerm = t => (editor.storage.searchAndReplace.lastSearchTerm = t)
    const setLastCurrentIndex = index => (editor.storage.searchAndReplace.lastIndex = index)
    return [
      new Plugin({
        key: searchAndReplacePluginKey,
        state: {
          init: () => DecorationSet.empty,
          apply({ doc, docChanged }, oldState) {
            const { searchTerm, lastSearchTerm, lastIndex, currentIndex, total } = editor.storage.searchAndReplace

            if (!docChanged && lastSearchTerm === searchTerm) {
              if (lastIndex === currentIndex) return oldState
              else {
                // 设置当前current index的class
                setLastCurrentIndex(currentIndex)

                editor.storage.searchAndReplace.canPrev = currentIndex > 0
                editor.storage.searchAndReplace.canNext = currentIndex < total - 1
                const decorationsToReturn = setCurrentClass(
                  doc,
                  currentIndex,
                  [searchResultClass, currentSearchClass],
                  editor.storage.searchAndReplace.results
                )
                return decorationsToReturn
              }
            }
            setLastCurrentIndex(currentIndex)
            setLastSearchTerm(searchTerm)

            if (!searchTerm) {
              editor.storage.searchAndReplace.total = 0
              return DecorationSet.empty
            }

            const results = processSearches(doc, getRegex(searchTerm, disableRegex, caseSensitive))
            editor.storage.searchAndReplace.total = results.length
            editor.storage.searchAndReplace.canPrev = false
            editor.storage.searchAndReplace.canNext = results.length > 0 ? true : false
            editor.storage.searchAndReplace.results = results

            const decorations: Decoration[] = []
            const classArray = [searchResultClass, currentSearchClass]

            for (let i = 0; i < results.length; i += 1) {
              const r = results[i]
              const decorationClass = i === 0 ? classArray.join(" ") : classArray[0]
              decorations.push(Decoration.inline(r.from, r.to, { class: decorationClass }))
            }

            return DecorationSet.create(doc, decorations)
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

export default SearchAndReplace
