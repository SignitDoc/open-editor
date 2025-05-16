import { Extension } from "@tiptap/core"

// 加入setLineSpacing命令
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    lineSpacing: {
      /**
       * @description 设置行高
       */
      setLineSpacing: (lineHeight: number) => ReturnType
    }
  }
}

const LineSpacing = Extension.create({
  name: "LineSpacing",
  addOptions() {
    return {
      types: ["paragraph"] //需要生效的extensions
    }
  },
  // 暴露在storage的数据
  addStorage() {
    return {
      lineHeight: 1.3
    }
  },
  // 添加样式
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.storage.lineHeight,
            parseHTML: element => element.style.lineHeight || this.storage.lineHeight,
            renderHTML: attributes => {
              if (!attributes.lineHeight) {
                return {}
              }

              return { style: `line-height: ${attributes.lineHeight}` }
            }
          }
        }
      }
    ]
  },
  addCommands() {
    return {
      setLineSpacing:
        (height: number) =>
        ({ commands }) => {
          if (this.storage.lineHeight === height) return false

          // 更新样式
          this.storage.lineHeight = height
          return this.options.types.every(type => {
            commands.updateAttributes(type, { lineHeight: height })
          })
        }
    }
  }
})

export default LineSpacing
