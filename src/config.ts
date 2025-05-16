export const MAX_FILE_SIZE = 1024 * 1024 * 5
export const defaultContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      attrs: {
        textAlign: "center"
      },
      content: [
        {
          type: "text",
          text: "易企签电子文档签署平台",
          marks: [
            {
              attrs: { color: "#000" },
              type: "textStyle"
            }
          ]
        }
      ]
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left"
      },
      content: [
        {
          type: "text",
          text: "Tiptap is a headless wrapper around ProseMirror – a toolkit for building rich text WYSIWYG editors, which is already in use at many well-known companies such as New York Times, The Guardian or Atlassian.",
          marks: [
            {
              type: "textStyle"
            }
          ]
        }
      ]
    }
  ]
}

export const defaultOptions = [
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2" }
]

export const personFolder = [
  {
    name: "我的文档",
    code: "my",
    isEnterprise: false,
    children: [{ name: "与我共享", code: "share", isEnterprise: false, children: [] }]
  }
]

export const defaultPPTData = [
  {
    id: 'slide-1',
    elements: [
    ],
    background: {
      type: 'solid',
      color: '#fff',
    },
  },
]

export const enterpriseFolder = [{ name: "企业文档", code: "enterprise", isEnterprise: true, children: [] }]
