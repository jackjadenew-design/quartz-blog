import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { pathToRoot } from "../util/path"

interface NavItem {
  number: string
  tag: string
  title: string
  desc: string
  href: string
}

interface SidebarNavConfig {
  items: NavItem[]
}

export default ((config: SidebarNavConfig) => {
  const SidebarNav: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const baseDir = pathToRoot(fileData.slug!)
    return (
      <nav class={classNames(displayClass, "sidebar-nav")}>
        <p class="sidebar-nav-label">Sections</p>
        <ul class="sidebar-nav-list">
          {config.items.map((item) => (
            <li>
              <a class="sidebar-nav-item" href={`${baseDir}/${item.href}`}>
                <span class="sidebar-nav-number">{item.number}</span>
                <div class="sidebar-nav-text">
                  <span class="sidebar-nav-tag">{item.tag}</span>
                  <span class="sidebar-nav-title">{item.title}</span>
                  <span class="sidebar-nav-desc">{item.desc}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  SidebarNav.css = `
.sidebar-nav {
  margin-top: 0.5rem;
}

.sidebar-nav-label {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gray);
  margin: 0 0 0.5rem;
  font-weight: 400;
}

.sidebar-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.sidebar-nav-item {
  display: flex;
  align-items: baseline;
  gap: 0.65rem;
  padding: 0.55rem 0;
  border-radius: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--lightgray) 60%, transparent);
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
}

.sidebar-nav-list li:last-child .sidebar-nav-item {
  border-bottom: none;
}

.sidebar-nav-item:hover {
  background: none;
  color: inherit;
  opacity: 0.6;
}

.sidebar-nav-number {
  font-family: var(--headerFont);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--secondary);
  line-height: 1;
  flex-shrink: 0;
  opacity: 0.5;
}

.sidebar-nav-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 0.1rem;
}

.sidebar-nav-tag {
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gray);
  line-height: 1.2;
}

.sidebar-nav-title {
  font-family: var(--headerFont);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--dark);
  line-height: 1.3;
}

.sidebar-nav-desc {
  font-size: 0.72rem;
  color: var(--gray);
  line-height: 1.45;
  margin-top: 0;
}

@media all and (max-width: 1200px) {
  .sidebar-nav {
    display: none;
  }
}
`

  return SidebarNav
}) satisfies QuartzComponentConstructor<SidebarNavConfig>
