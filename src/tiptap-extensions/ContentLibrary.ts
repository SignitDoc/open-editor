import { Extension } from "@tiptap/core"
import { generateHTML } from "@tiptap/html"
import StarterKit from "@tiptap/starter-kit"
import { useDocumentStore } from "@/store"
import extensions from "./index"
import { generateText } from "@/utils"
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    ContentLibrary: {
      /**
       * @description 添加内容库
       */
      addContentLibrary: (folderId: string, name: string) => ReturnType
    }
  }
}

const ContentLibrary = Extension.create({
  name: "ContentLibrary",
  addCommands() {
    return {
      addContentLibrary: (folderId, name) => options => {
        const documentStore = useDocumentStore()
        const contentLibrary = documentStore.contentLibrary
        const index = contentLibrary.findIndex(item => item.id === folderId)
        if (index === -1) return false
        const content = contentLibrary[index].documentContent || []

        const nodes = [] as Array<any>
        options.editor.state.doc.nodesBetween(options.tr.selection.from, options.tr.selection.to, (node, pos) => {
          nodes.push(node.toJSON())
          if (node.nodeSize + pos >= options.tr.selection.to) {
            const json = {
              type: "doc",
              content: nodes
            }
            content.push({
              id: `${contentLibrary[index].id}-${content.length + 1}`,
              documentName: name,
              content: json,
              html: generateHTML(json, [StarterKit.configure({ paragraph: false, codeBlock: false }), ...extensions]),
              txt: generateText(json, options.editor.schema)
            })
            contentLibrary[index].documentContent = content
            documentStore.$patch({ contentLibrary: contentLibrary })
          }
        })

        return true
      }
    }
  }
})

export default ContentLibrary
