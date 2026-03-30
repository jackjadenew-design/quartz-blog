import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackjadenew-design",
      "Google Scholar": "https://scholar.google.com/citations?user=FQiiPPoAAAAJ&hl=zh-CN",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta({ showComma: false }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.TagList(),
      condition: (page) => page.fileData.slug !== "index",
    }),
  ],
  afterBody: [
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "最新文章",
        limit: 10,
        showTags: true,
        linkToMore: false,
        filter: (f) =>
          f.slug !== "index" && !f.slug?.endsWith("/index") && !f.slug?.startsWith("tags/"),
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.ConditionalRender({
      component: Component.SidebarNav({
        items: [
          {
            number: "01",
            tag: "AI",
            title: "人工智能",
            desc: "只是一个用户而已",
            href: "AI/",
          },
          {
            number: "02",
            tag: "Geoscience",
            title: "地理与遥感",
            desc: "遥感与地学研究",
            href: "Geoscience/",
          },
          {
            number: "03",
            tag: "Life",
            title: "生活与思考",
            desc: "阅读、日常与思考",
            href: "Life/",
          },
        ],
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
  ],
  right: [],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
  ],
  right: [],
}
