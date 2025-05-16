import CharacterCount from "@tiptap/extension-character-count"

const chineseReg = /[\u4e00-\u9fa5]/

// 统计方法实现细节需要优化
const CustomCharacterCount = CharacterCount.extend({
  onBeforeCreate() {
    this.storage.characters = options => {
      const node = options?.node || this.editor.state.doc
      const mode = options?.mode || this.options.mode

      if (mode === "textSize") {
        const text = node.textBetween(0, node.content.size, undefined, " ")

        return text.length
      }

      return node.nodeSize
    }

    this.storage.words = options => {
      let wordCount = 0
      const node = options?.node || this.editor.state.doc
      const text = node.textBetween(0, node.content.size, " ", " ")
      const words = text.split(" ").filter(word => word !== "")
      for (const word of words) {
        if (chineseReg.test(word)) wordCount += word.length
        else wordCount++
      }
      return wordCount
    }
  }
})

export default CustomCharacterCount
