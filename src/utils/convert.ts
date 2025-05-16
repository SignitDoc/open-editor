import { Document, Paragraph, TextRun, UnderlineType } from "docx"
let bulletIndex = -1
// tiptap的json结构转换为docx的json结构
export function generateDocxJson(json) {
  const result: Array<any> = []
  json.forEach(item => {
    if (item.type === "doc")
      result.push(
        new Document({
          sections: [{ properties: {}, children: generateDocxJson(item.content) }]
        })
      )
    else {
      if (item.type === "paragraph" || item.type === "heading") {
        result.push(new Paragraph(getConvertOptions(item)))
      } else if (item.type === "bulletList") {
        bulletIndex = -1
        result.push(...getBulletConvertOptions(item, 0))
      } else if (item.type === "text") result.push(new TextRun(getConvertOptions(item)))
    }
  })
  return result
}

// 常规类options转换（paragraphs、heading、text）
function getConvertOptions(convertItem) {
  const result: Record<string, any> = {}

  if (convertItem.content && convertItem.content.length > 0) result.children = generateDocxJson(convertItem.content)

  if (convertItem.type === "heading") result.heading = `Heading${convertItem.attrs.level}`
  if (convertItem.text) result.text = convertItem.text

  // 样式
  let fontColor, fontSize

  convertItem.marks?.forEach(mark => {
    // 文字样式
    if (mark.type === "textStyle") {
      if (mark.attrs?.color) {
        const reg = /^(rgb|RGB)/
        if (reg.test(mark.attrs.color)) mark.attrs.color = colorHex(mark.attrs.color)
        fontColor = mark.attrs?.color.replace("#", "")
        if (fontColor.length === 3) fontColor += fontColor
        if (fontColor.length !== 6) throw new Error("color的形式必须为RRGGBB")
        result.color = fontColor
      }
      if (mark.attrs?.fontFamily) result.font = mark.attrs?.fontFamily
      if (mark.attrs?.fontSize) {
        fontSize = mark.attrs?.fontSize
        // fontSize以pt为单位，docx以半点为单位，所以在原来的单位要再乘以2才是真实单位
        if (fontSize.indexOf("pt") !== -1) fontSize = Number(fontSize.replace("pt", "")) * 2 + "pt"
        if (fontSize.indexOf("px") !== -1) fontSize = Math.round((Number(fontSize.replace("px", "")) * 6) / 4) + "pt"
        result.size = fontSize
      }
    }
    // 加粗
    if (mark.type === "bold") result.bold = true
    // 倾斜
    if (mark.type === "italic") result.italics = true
    // 删除线
    if (mark.type === "strike") result.strike = true
    // 下划线
    if (mark.type === "underline")
      result.underline = {
        color: fontColor,
        type: UnderlineType.SINGLE
      }
  })

  //属性
  const attrs = convertItem.attrs
  //   文本对齐方式
  if (attrs?.textAlign) result.alignment = attrs.textAlign
  //   缩进
  if (attrs?.indent)
    result.indent = {
      left: attrs.indent * 480
    }
  // 行高-默认1的行高为240(若paragraph的行高含有单位，则lienHeight默认为1.3)
  if (attrs?.lineHeight) {
    const lineHeight = attrs?.lineHeight
    result.spacing = {
      line: typeof lineHeight === "number" ? lineHeight * 240 : 1.3 * 240
    }
  }

  return result
}

// 无序列表转换
/* ===============================================
docx的无序列表结构：
const result = [
  {
    children: [], //无序列表里面的内容元素
    bullet:{
      level: 0 //递归的无序列表放在同一层只改变level
    }
  },
  {
    children: [], //无序列表里面的内容元素
    bullet:{
      level: 1 //递归的无序列表放在同一层只改变level
    }
  },...
]
=============================================== */
function getBulletConvertOptions(bulletList, bulletIndex) {
  let result: Array<any> = [] //存储的结果
  bulletList.content?.forEach(listItem => {
    let children: Array<any> = [] //一个list-item里面包含的数据
    listItem.content.forEach(listContentItem => {
      // 当遇到无序列表时，递归并将结果推入result，level层级加1
      if (listContentItem.type === "bulletList") {
        const tempBullet = getBulletConvertOptions(listContentItem, bulletIndex + 1)
        result = result.concat(tempBullet)
      } else {
        // paragraph特殊解析，此时丢失了paragraph的attrs
        if (listContentItem.type === "paragraph") {
          listContentItem.content.forEach(paragraphItem => {
            children = children.concat(generateDocxJson([paragraphItem]))
          })
        }
        result.push(
          new Paragraph({
            children,
            bullet: { level: bulletIndex }
          })
        )
        // 其他情况还没考虑
      }
    })
  })
  return result
}

// rgb转16进制
export function colorHex(color) {
  // RGB颜色值的正则
  const reg = /^(rgb|RGB)/
  if (reg.test(color)) {
    let strHex = "#"
    // 把RGB的3个数值变成数组
    const colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",")
    // 转成16进制
    for (let i = 0; i < colorArr.length; i++) {
      let hex = Number(colorArr[i]).toString(16)
      if (hex === "0") {
        hex += hex
      }
      strHex += hex
    }
    return strHex
  } else {
    return String(color)
  }
}
