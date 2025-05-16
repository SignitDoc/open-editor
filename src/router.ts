import { createRouter, createWebHistory } from "vue-router"
import { getDocumentTypeShowIcon } from "@/utils"
import { DocumentTypeEnum } from "./enum"
import { useDocumentStore } from "./store"

/**
 * 文档编辑/预览页面路由结构：
 * `/${DocumentTypeEnum.xxx}-edit` 或者 `/${DocumentTypeEnum.xxx}-view`
 * 以便在页面上更好区分文档类型来获取icon
 */
const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    { path: "/", redirect: "/home" },
    {
      path: "/home",
      redirect: "/home/document",
      component: () => import("@/layout/home-layout/index.vue"),
      children: [
        {
          path: "/home/document",
          component: () => import("@/pages/document-home/index.vue")
        }
      ]
    },
    { path: "/word-edit", component: () => import("@/pages/word/edit.vue") },
    { path: "/word-view", component: () => import("@/pages/word/view.vue") },
    { path: "/excel-edit", component: () => import("@/pages/sheet-edit/index.vue") },
    { path: "/excel-view", component: () => import("@/pages/sheet-view/index.vue") },
    { path: "/mindMap-edit", component: () => import("@/pages/mind-map/mind-map-edit.vue") },
    { path: "/mindMap-view", component: () => import("@/pages/mind-map/mind-map-view.vue") },
    { path: "/ppt-edit", component: () => import("@/pages/ppt/edit.vue") },
    { path: "/ppt-view", component: () => import("@/pages/ppt/view.vue") },
    { path: "/markdown-edit", component: () => import("@/pages/markdown/edit.vue") },
    { path: "/markdown-view", component: () => import("@/pages/markdown/view.vue") },
    { path: "/flowChart-edit", component: () => import("@/pages/flow-chart/edit.vue") },
    { path: "/none", component: () => import("@/pages/error-page/none-document.vue") },
    { path: "/without-permission", component: () => import("@/pages/error-page/without-permission.vue") }
  ],
  strict: true
})

router.beforeEach((to, from) => {
  let toPath = to.path
  toPath = toPath.replace("/", "")
  const toPathArray = toPath.split("-")
  let icon = new URL("/src/assets/favicon.ico", import.meta.url).href
  if (Object.values(DocumentTypeEnum).includes(toPathArray[0] as DocumentTypeEnum)) {
    icon = getDocumentTypeShowIcon(toPathArray[0])
  }

  const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement
  link.href = icon
  // 编辑页面不需要弹窗
  if (to.path.indexOf("edit") !== -1) return true
  if (!useDocumentStore().isSave)
    if (confirm("数据暂未保存，是否要离开改页面") === true) {
      // 跳转后重置store
      useDocumentStore().$patch({ isSave: true })
      return true
    } else {
      return false
    }

  return true
})
export default router
