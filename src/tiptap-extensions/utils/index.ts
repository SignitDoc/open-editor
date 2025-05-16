import { Decoration, DecorationSet } from "@tiptap/pm/view"
import { Node as PMNode } from "@tiptap/pm/model"
import { Extension, Range } from "@tiptap/core"

export interface ProcessedSearches {
  decorationsToReturn: DecorationSet
  results: Range[]
}

interface TextNodesWithPosition {
  text: string
  pos: number
}

export function processSearches(doc: PMNode, searchTerm: RegExp): Range[] {
  let textNodesWithPosition: TextNodesWithPosition[] = []
  const results: Range[] = []

  let index = 0

  if (!searchTerm) return []

  doc?.descendants((node, pos) => {
    if (node.isText) {
      if (textNodesWithPosition[index]) {
        textNodesWithPosition[index] = {
          text: textNodesWithPosition[index].text + node.text,
          pos: textNodesWithPosition[index].pos
        }
      } else {
        textNodesWithPosition[index] = {
          text: `${node.text}`,
          pos
        }
      }
    } else {
      index += 1
    }
  })

  textNodesWithPosition = textNodesWithPosition.filter(Boolean)
  for (let i = 0; i < textNodesWithPosition.length; i += 1) {
    const { text, pos } = textNodesWithPosition[i]

    const matches = Array.from(text.matchAll(searchTerm)).filter(([matchText]) => matchText.trim())

    for (let j = 0; j < matches.length; j += 1) {
      const m = matches[j]

      if (m[0] === "") break

      if (m.index !== undefined) {
        results.push({
          from: pos + m.index,
          to: pos + m.index + m[0].length
        })
      }
    }
  }

  return results
}
