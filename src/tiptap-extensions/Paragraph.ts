import Paragraph from "@tiptap/extension-paragraph"

const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      minHeight: {
        default: "1em",
        // Take the attribute values
        renderHTML: attributes => {
          // … and return an object with HTML attributes.
          return {
            style: `min-height: ${attributes.minHeight}`
          }
        }
      }
    }
  }
})

export default CustomParagraph
