import TableHeader from "@tiptap/extension-table-header"

const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      // extend the existing attributes …
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: element => element.getAttribute("data-background-color"),
        renderHTML: attributes => {
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`
          }
        }
      }
    }
  }
})

export default CustomTableHeader
