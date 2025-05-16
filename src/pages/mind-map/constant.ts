export const supportLineRadiusLayouts = [
  'logicalStructure',
  'logicalStructureLeft',
  'mindMap',
  'verticalTimeline'
]

export const supportNodeUseLineStyleLayouts = [
  'logicalStructure',
  'logicalStructureLeft',
  'mindMap',
  'catalogOrganization',
  'organizationStructure'
]

export const supportRootLineKeepSameInCurveLayouts = [
  'logicalStructure',
  'logicalStructureLeft',
  'mindMap'
]

// 彩虹线条配置
export const rainbowLinesOptions = [
  {
    value: 'close'
  },
  {
    value: 'colors1',
    list: [
      'rgb(255, 213, 73)',
      'rgb(255, 136, 126)',
      'rgb(107, 225, 141)',
      'rgb(151, 171, 255)',
      'rgb(129, 220, 242)',
      'rgb(255, 163, 125)',
      'rgb(152, 132, 234)'
    ]
  },
  {
    value: 'colors2',
    list: [
      'rgb(248, 93, 93)',
      'rgb(255, 151, 84)',
      'rgb(255, 214, 69)',
      'rgb(73, 205, 140)',
      'rgb(64, 192, 255)',
      'rgb(84, 110, 214)',
      'rgb(164, 93, 220)'
    ]
  },
  {
    value: 'colors3',
    list: [
      'rgb(140, 240, 231)',
      'rgb(74, 210, 255)',
      'rgb(65, 168, 243)',
      'rgb(49, 128, 205)',
      'rgb(188, 226, 132)',
      'rgb(113, 215, 123)',
      'rgb(120, 191, 109)'
    ]
  },
  {
    value: 'colors4',
    list: [
      'rgb(169, 98, 99)',
      'rgb(245, 125, 123)',
      'rgb(254, 183, 168)',
      'rgb(251, 218, 171)',
      'rgb(138, 163, 181)',
      'rgb(131, 127, 161)',
      'rgb(84, 83, 140)'
    ]
  },
  {
    value: 'colors5',
    list: [
      'rgb(255, 229, 142)',
      'rgb(254, 158, 41)',
      'rgb(248, 119, 44)',
      'rgb(232, 82, 80)',
      'rgb(182, 66, 98)',
      'rgb(99, 54, 99)',
      'rgb(65, 40, 82)'
    ]
  },
  {
    value: 'colors6',
    list: [
      'rgb(171, 227, 209)',
      'rgb(107, 201, 196)',
      'rgb(55, 170, 169)',
      'rgb(18, 135, 131)',
      'rgb(74, 139, 166)',
      'rgb(75, 105, 150)',
      'rgb(57, 75, 133)'
    ]
  }
]

export const supportLineStyleLayoutsMap = {
  curve: [
    'logicalStructure',
    'logicalStructureLeft',
    'mindMap',
    'verticalTimeline'
  ],
  direct: [
    'logicalStructure',
    'logicalStructureLeft',
    'mindMap',
    'organizationStructure',
    'verticalTimeline'
  ]
}

export const defaultMindMapData={
  data: {
    text: "根节点"
  },
  children: [
    {
      data: {
        text: "分支主题1",
        expand: true
      }
    },
    {
      data: {
        text: "分支主题2",
        expand: true
      }
    },
    {
      data: {
        text: "分支主题3",
        expand: true
      }
    }
    ,   {
      data: {
        text: "分支主题4",
        expand: true
      }
    }
  ]
}

export const copyOptions: Array<{ name: string; value: string }> = [
  {
    name: "SMM",
    value: "smm"
  },
  {
    name: "JSON",
    value: "json"
  },
  {
    name: "Markdown",
    value: "md"
  },
  {
    name: "Txt",
    value: "txt"
  }
]

export const expandOptions = ["一级主题", "二级主题", "三级主题", "四级主题", "五级主题", "六级主题"]


// 常量
export const CONSTANTS = {
  CHANGE_THEME: "changeTheme",
  CHANGE_LAYOUT: "changeLayout",
  SET_DATA: "setData",
  TRANSFORM_TO_NORMAL_NODE: "transformAllNodesToNormalNode",
  MODE: {
    READONLY: "readonly",
    EDIT: "edit"
  },
  LAYOUT: {
    LOGICAL_STRUCTURE: "logicalStructure",
    LOGICAL_STRUCTURE_LEFT: "logicalStructureLeft",
    MIND_MAP: "mindMap",
    ORGANIZATION_STRUCTURE: "organizationStructure",
    CATALOG_ORGANIZATION: "catalogOrganization",
    TIMELINE: "timeline",
    TIMELINE2: "timeline2",
    FISHBONE: "fishbone",
    VERTICAL_TIMELINE: "verticalTimeline"
  },
  DIR: {
    UP: "up",
    LEFT: "left",
    DOWN: "down",
    RIGHT: "right"
  },
  KEY_DIR: {
    LEFT: "Left",
    UP: "Up",
    RIGHT: "Right",
    DOWN: "Down"
  },
  SHAPE: {
    RECTANGLE: "rectangle",
    DIAMOND: "diamond",
    PARALLELOGRAM: "parallelogram",
    ROUNDED_RECTANGLE: "roundedRectangle",
    OCTAGONAL_RECTANGLE: "octagonalRectangle",
    OUTER_TRIANGULAR_RECTANGLE: "outerTriangularRectangle",
    INNER_TRIANGULAR_RECTANGLE: "innerTriangularRectangle",
    ELLIPSE: "ellipse",
    CIRCLE: "circle"
  },
  MOUSE_WHEEL_ACTION: {
    ZOOM: "zoom",
    MOVE: "move"
  },
  INIT_ROOT_NODE_POSITION: {
    LEFT: "left",
    TOP: "top",
    RIGHT: "right",
    BOTTOM: "bottom",
    CENTER: "center"
  },
  LAYOUT_GROW_DIR: {
    LEFT: "left",
    TOP: "top",
    RIGHT: "right",
    BOTTOM: "bottom"
  },
  PASTE_TYPE: {
    CLIP_BOARD: "clipBoard",
    CANVAS: "canvas"
  },
  SCROLL_BAR_DIR: {
    VERTICAL: "vertical",
    HORIZONTAL: "horizontal"
  },
  CREATE_NEW_NODE_BEHAVIOR: {
    DEFAULT: "default",
    NOT_ACTIVE: "notActive",
    ACTIVE_ONLY: "activeOnly"
  },
  TAG_POSITION: {
    RIGHT: "right",
    BOTTOM: "bottom"
  }
}

//  布局结构列表
export const layoutOptions = [
  {
    name: "逻辑结构图",
    value: CONSTANTS.LAYOUT.LOGICAL_STRUCTURE
  },
  {
    name: "向左逻辑结构图",
    value: CONSTANTS.LAYOUT.LOGICAL_STRUCTURE_LEFT
  },
  {
    name: "思维导图",
    value: CONSTANTS.LAYOUT.MIND_MAP
  },
  {
    name: "组织结构图",
    value: CONSTANTS.LAYOUT.ORGANIZATION_STRUCTURE
  },
  {
    name: "目录组织图",
    value: CONSTANTS.LAYOUT.CATALOG_ORGANIZATION
  },
  // {
  //   name: "时间轴",
  //   value: CONSTANTS.LAYOUT.TIMELINE
  // },
  {
    name: "时间轴",
    value: CONSTANTS.LAYOUT.TIMELINE2
  },
  // {
  //   name: "竖向时间轴",
  //   value: CONSTANTS.LAYOUT.VERTICAL_TIMELINE
  // },
  {
    name: "鱼骨图",
    value: CONSTANTS.LAYOUT.FISHBONE
  }
]

//  布局结构图片映射
export const layoutImgMap = {
  logicalStructure: new URL("/src/assets/mind-map/structure/logical-structure.png", import.meta.url).href,
  logicalStructureLeft: new URL("/src/assets/mind-map/structure/logical-structure-left.png", import.meta.url).href,
  mindMap: new URL("/src/assets/mind-map/structure/mind-map.png", import.meta.url).href,
  organizationStructure: new URL("/src/assets/mind-map/structure/organization-structure.png", import.meta.url).href,
  catalogOrganization: new URL("/src/assets/mind-map/structure/catalog-organization.png", import.meta.url).href,
  // timeline: new URL("/src/assets/mind-map/structure/timeline.png", import.meta.url).href,
  timeline2: new URL("/src/assets/mind-map/structure/timeline2.png", import.meta.url).href,
  fishbone: new URL("/src/assets/mind-map/structure/fish-bone.png", import.meta.url).href,
  verticalTimeline: new URL("/src/assets/mind-map/structure/vertical-timeline.png", import.meta.url).href
}

export const colorsCard = [
  "#4D4D4D",
  "#999999",
  "#FFFFFF",
  "#F44E3B",
  "#FE9200",
  "#FCDC00",
  "#DBDF00",
  "#A4DD00",
  "#68CCCA",
  "#73D8FF",
  "#AEA1FF",
  "#FDA1FF",
  "#333333",
  "#808080",
  "#cccccc",
  "#D33115",
  "#E27300",
  "#FCC400",
  "#B0BC00",
  "#68BC00",
  "#16A5A5",
  "#009CE0",
  "#7B64FF",
  "#FA28FF",
  "#000000",
  "#666666",
  "#B3B3B3",
  "#9F0500",
  "#C45100",
  "#FB9E00",
  "#808900",
  "#194D33",
  "#0C797D",
  "#0062B1",
  "#653294"
]

// 边框宽度
export const borderWidthOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// 行高
export const lineHeightOptions = [1, 1.5, 2, 2.5, 3]

// 形状列表
export const shapeOptions = [
  {
    name: "矩形",
    value: "rectangle"
  },
  {
    name: "菱形",
    value: "diamond"
  },
  {
    name: "平行四边形",
    value: "parallelogram"
  },
  {
    name: "圆角矩形",
    value: "roundedRectangle"
  },
  {
    name: "八角矩形",
    value: "octagonalRectangle"
  },
  {
    name: "外三角矩形",
    value: "outerTriangularRectangle"
  },
  {
    name: "内三角矩形",
    value: "innerTriangularRectangle"
  },
  {
    name: "椭圆",
    value: "ellipse"
  },
  {
    name: "圆",
    value: "circle"
  }
]

// 边框样式
export const borderDasharrayOptions = [
  {
    name: "实线",
    value: "none"
  },
  {
    name: "虚线1",
    value: "5,5"
  },
  {
    name: "虚线2",
    value: "10,10"
  },
  {
    name: "虚线3",
    value: "20,10,5,5,5,10"
  },
  {
    name: "虚线4",
    value: "5, 5, 1, 5"
  },
  {
    name: "虚线5",
    value: "15, 10, 5, 10, 15"
  },
  {
    name: "虚线6",
    value: "1, 5"
  }
]

export const shapesMap = {
  rectangle: "M 4 12 L 4 3 L 56 3 L 56 21 L 4 21 L 4 12 Z",
  diamond: "M 4 12 L 30 3 L 56 12 L 30 21 L 4 12 Z",
  parallelogram: "M 10 3 L 56 3 L 50 21 L 4 21 L 10 3 Z",
  roundedRectangle: "M 13 3 L 47 3 A 9 9 0, 0 1 47 21 L 13 21 A 9 9 0, 0 1 13 3 Z",
  octagonalRectangle: "M 4 12 L 4 9 L 10 3 L 50 3 L 56 9 L 56 15 L 50 21 L 10 21 L 4 15 L 4 12 Z",
  outerTriangularRectangle: "M 4 12 L 10 3 L 50 3 L 56 12 L 50 21 L 10 21 L 4 12 Z",
  innerTriangularRectangle: "M 10 12 L 4 3 L 56 3 L 50 12 L 56 21 L 4 21 L 10 12 Z",
  ellipse: "M 4 12 A 26 9 0, 1, 0 30 3 A 26 9 0, 0, 0 4 12 Z",
  circle: "M 21 12 A 9 9 0, 1, 0 30 3 A 9 9 0, 0, 0 21 12 Z"
}

// 圆角
export const borderRadiusOptions = [2, 4, 6, 8,10]

// 线宽
export const lineWidthOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const lineStyleMap = {
  straight: `<svg width="60" height="26"><path d="M18,14L30,14L30,5L42,5" fill="none" stroke="#000" stroke-width="2"></path><path d="M18,14L30,14L30,23L42,23" fill="none" stroke="#000" stroke-width="2"></path></svg>`,
  curve: `<svg width="60" height="26"><path d="M18,14L30,14A12,-9 0 0 1 42,5" fill="none" stroke="#000" stroke-width="2"></path><path d="M18,14L30,14A12,9 0 0 0 42,23" fill="none" stroke="#000" stroke-width="2"></path></svg>`,
  direct: `<svg width="60" height="26"><path d="M18,14L30,14L42,5" fill="none" stroke="#000" stroke-width="2"></path><path d="M18,14L30,14L42,23" fill="none" stroke="#000" stroke-width="2"></path></svg>`
}

// 连线风格
export const lineStyleOptions = [
  {
    name: "直线",
    value: "straight"
  },
  {
    name: "曲线",
    value: "curve"
  },
  {
    name: "直连",
    value: "direct"
  }
]

// 曲线风格中，根节点样式是否和其他节点保持一致
export const rootLineKeepSameInCurveOptions = [
  {
    name: "括号",
    value: "bracket"
  },
  {
    name: "大括号",
    value: "brace"
  }
]

// 图片重复方式
export const backgroundRepeatOptions = [
  {
    name: "不重复",
    value: "no-repeat"
  },
  {
    name: "重复",
    value: "repeat"
  },
  {
    name: "水平方向重复",
    value: "repeat-x"
  },
  {
    name: "垂直方向重复",
    value: "repeat-y"
  }
]

// 背景图片定位
export const backgroundPositionOptions = [
  {
    name: "默认",
    value: "0% 0%"
  },
  {
    name: "左上",
    value: "left top"
  },
  {
    name: "左中",
    value: "left center"
  },
  {
    name: "左下",
    value: "left bottom"
  },
  {
    name: "右上",
    value: "right top"
  },
  {
    name: "右中",
    value: "right center"
  },
  {
    name: "右下",
    value: "right bottom"
  },
  {
    name: "中上",
    value: "center top"
  },
  {
    name: "居中",
    value: "center center"
  },
  {
    name: "中下",
    value: "center bottom"
  }
]

// 背景图片大小
export const backgroundSizeOptions = [
  {
    name: "自动",
    value: "auto"
  },
  {
    name: "覆盖",
    value: "cover"
  },
  {
    name: "保持",
    value: "contain"
  }
]

// 字体列表
export const fontFamilyOptions = [
  {
    name: "宋体",
    value: "宋体, SimSun, Songti SC"
  },
  {
    name: "微软雅黑",
    value: "微软雅黑, Microsoft YaHei"
  },
  {
    name: "楷体",
    value: "楷体, 楷体_GB2312, SimKai, STKaiti"
  },
  {
    name: "黑体",
    value: "黑体, SimHei, Heiti SC"
  },
  {
    name: "隶书",
    value: "隶书, SimLi"
  },
  {
    name: "Andale Mono",
    value: "andale mono"
  },
  {
    name: "Arial",
    value: "arial, helvetica, sans-serif"
  },
  {
    name: "arialBlack",
    value: "arial black, avant garde"
  },
  {
    name: "Comic Sans Ms",
    value: "comic sans ms"
  },
  {
    name: "Impact",
    value: "impact, chicago"
  },
  {
    name: "Times New Roman",
    value: "times new roman"
  },
  {
    name: "Sans-Serif",
    value: "sans-serif"
  },
  {
    name: "serif",
    value: "serif"
  }
]

// 字号
export const fontSizeOptions = [10, 12,14, 16, 18,2022, 24, 32, 48]

export const fontSizes = [
  { value: 42, label: "初号" },
  { value: 36, label: "小初" },
  { value: 26, label: "一号" },
  { value: 24, label: "小一" },
  { value: 22, label: "二号" },
  { value: 18, label: "小二" },
  { value: 16, label: "三号" },
  { value: 15, label: "小三" },
  { value: 14, label: "四号" },
  { value: 12, label: "小四" },
  { value: 10.5, label: "五号" },
  { value: 9, label: "小五" },
  { value: 7.5, label: "六号" },
  { value: 6.5, label: "小六" },
  { value: 5.5, label: "七号" },
  { value: 5, label: "八号" },
  { value: 5, label: "5" },
  { value: 5.5, label: "5.5" },
  { value: 6.5, label: "6.5" },
  { value: 7.5, label: "7.5" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10" },
  { value: 10.5, label: "10.5" },
  { value: 11, label: "11" },
  { value: 12, label: "12" },
  { value: 14, label: "14" },
  { value: 16, label: "16" },
  { value: 18, label: "18" },
  { value: 20, label: "20" },
  { value: 22, label: "22" },
  { value: 26, label: "26" },
  { value: 28, label: "28" },
  { value: 36, label: "36" },
  { value: 48, label: "48" },
  { value: 56, label: "56" },
  { value: 72, label: "72" }
]
