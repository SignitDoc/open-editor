import Highlight from "@tiptap/extension-highlight"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TextStyle from "@tiptap/extension-text-style"
import FontFamily from "@tiptap/extension-font-family"
import FontSize from "tiptap-extension-font-size"
import { Color } from "@tiptap/extension-color"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"

import ESign from "./e-sign"
import CustomCharacterCount from "./CustomCharacterCount"
import CustomFormItem from "./custom-form-item"
import DraggableItem from "./draggable-item"
import RawFormItem from "./raw-form-item"
import CustomTableCell from "./CustomTableCell"
import CustomTableHeader from "./CustomTableHeader"
import SvgBox from "./svg-box"

import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import Indent from "@weiruo/tiptap-extension-indent"

import FormatPainter from "./formPainter/index"

import SearchAndReplace from "./searchAndReplace"

import LineSpacing from "./LineSpacing"
import Paragraph from "./Paragraph"

import ContentLibrary from "./ContentLibrary"

import CommentManage from "./CommentManage"

import useDocumentStore from "@/store/documentStore"
import router from "@/router"
import { CommentItem } from "@/types"
import CustomTextStyle from "./CustomTextStyle"

// load all languages with "all" or common languages with "common"
import { common, createLowlight } from "lowlight"
import CodeBlock from "./code-block"
import css from "highlight.js/lib/languages/css"
import ts from "highlight.js/lib/languages/typescript"
import html from "highlight.js/lib/languages/xml"
import DragHandle from "@tiptap-pro/extension-drag-handle"
import NodeRange from "@tiptap-pro/extension-node-range"

import Linter from "./linter/Linter"
const lowlight = createLowlight(common)

lowlight.register("html", html)
lowlight.register("css", css)
lowlight.register("ts", ts)

export default [
  Paragraph,
  Linter,
  NodeRange.configure({
    // allow to select only on depth 0
    // depth: 0,
    key: null
  }),
  DragHandle.configure({
    render() {
      const element = document.createElement("div")
      element.classList.add("custom-drag-handle")
      return element
    }
  }),
  CodeBlock.configure({ lowlight }),
  DraggableItem,
  CustomCharacterCount,
  CustomFormItem,
  RawFormItem,
  ESign,
  SvgBox,

  Highlight.configure({
    multicolor: true
  }),
  // TextStyle,
  CustomTextStyle,
  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph"]
  }),
  Image.configure({
    allowBase64: true,
    inline: true
  }),
  SearchAndReplace.configure(),
  Link,
  LineSpacing,
  Color,
  Table.configure({
    resizable: true
  }),
  CustomTableCell,
  CustomTableHeader,
  TableRow,
  Superscript,
  Subscript,
  FontFamily,
  FontSize,
  TaskItem,
  TaskList,
  Indent,
  FormatPainter,
  ContentLibrary,
  CommentManage.configure({
    onCommentChange: (comment, commentList: Array<CommentItem>) => {
      const documentStore = useDocumentStore()

      documentStore.setCommentList(commentList)
    }
  })
]
