import { Extension, ChainedCommands } from "@tiptap/core";
import formatCopy, { TStateNotify } from './formatCopy'

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    formatPainter: {
      /** 启用格式刷 */
      enableFormatPainter: (options: {
        once: boolean;
        getChain: () => ChainedCommands;
      }) => ReturnType;
    };
    watchFormatPainterState: (fn: TStateNotify) => void
  }
}

export const FormatPainter = Extension.create<void>({
  name: "formatPainter",

  addCommands() {
    return {
      // prettier-ignore
      enableFormatPainter: ({ once, getChain }) => (props) => {
        if (formatCopy.isCopying) {
          formatCopy.Stop()
        } else {
          formatCopy.getChain = getChain
          formatCopy.Copy(once, props.editor.getJSON.bind(props.editor))
        }
        return true
      },
      // prettier-ignore
      watchFormatPainterState: (fn: TStateNotify) => () => {
        formatCopy.stateNotifyList.push(fn)
      }
    };
  },
});
