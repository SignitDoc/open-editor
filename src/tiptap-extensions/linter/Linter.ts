import { Extension, Range } from "@tiptap/core"
import { Node as ProsemirrorNode } from "@tiptap/pm/model"
import { Plugin, PluginKey, TextSelection } from "@tiptap/pm/state"
import { Decoration, DecorationSet } from "@tiptap/pm/view"

import { Node as PMNode } from "@tiptap/pm/model"
import { processSearches } from "../utils/index"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    Linter: {
      /**
       * @description 拼写检查
       */
      spellChecker: (errorWords: Array<string>) => ReturnType
      /**
       * @description 清除拼写检查
       */
      clearChecker: () => ReturnType
    }
  }
}

interface IconDivElement extends HTMLDivElement {
  pos?: Range
}

function renderIcon(pos) {
  const icon = document.createElement("div") as IconDivElement

  icon.className = "lint-icon"
  icon.title = "该行存在拼写错误或者语法错误，请检查。"
  icon.pos = pos

  return icon
}

export const LinterPluginPluginKey = new PluginKey("LinterPlugin")

const Linter = Extension.create({
  name: "Linter",
  addStorage: () => {
    return {
      errorWords: [] as Array<string>
    }
  },
  addCommands() {
    return {
      spellChecker:
        errorWords =>
        ({ editor }) => {
          editor.storage.Linter.errorWords = errorWords
          return false
        },
      clearChecker:
        () =>
        ({ editor }) => {
          editor.storage.Linter.errorWords = []
          return false
        }
    }
  },
  addProseMirrorPlugins() {
    const editor = this.editor

    return [
      new Plugin({
        key: LinterPluginPluginKey,
        state: {
          init: () => DecorationSet.empty,
          apply: ({ doc, docChanged }, oldState) => {
            if (!editor.storage.Linter) return DecorationSet.empty
            const { errorWords } = editor.storage.Linter
            // 存在拼写错误
            if (errorWords.length > 0) {
              let pos: Array<Range> = []
              errorWords.forEach(item => {
                const itemPos = processSearches(doc, item)
                pos = pos.concat(itemPos)
              })

              const decorations: Decoration[] = []

              for (let i = 0; i < pos.length; i += 1) {
                const r = pos[i]
                decorations.push(
                  Decoration.inline(r.from, r.to, { class: "problem" }),
                  Decoration.widget(r.from, renderIcon(r))
                )
              }

              return DecorationSet.create(doc, decorations)
            }

            return DecorationSet.empty
          }
        },
        props: {
          decorations(state) {
            return this.getState(state)
          },
          handleClick(view, _, event) {
            const target = event.target as IconDivElement

            if (/lint-icon/.test(target.className) && target.pos) {
              const { from, to } = target.pos

              view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to)).scrollIntoView())

              return true
            }

            return false
          }
        }
      })
    ]
  }
})

export default Linter
