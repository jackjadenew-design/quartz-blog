import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

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
  const SidebarNav: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <nav class={classNames(displayClass, "sidebar-nav")}>
        <p class="sidebar-nav-label">Sections</p>
        <ul class="sidebar-nav-list">
          {config.items.map((item) => (
            <li>
              <a class="sidebar-nav-item" href={item.href}>
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
  margin-top: 1rem;
}

.sidebar-nav-label {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--tertiary);
  margin: 0 0 0.6rem;
}

.sidebar-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar-nav-item {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  padding: 0.6rem 0.7rem;
  border-radius: 0.75rem;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s ease;
}

.sidebar-nav-item:hover {
  background: color-mix(in srgb, var(--highlight) 80%, white 20%);
  color: inherit;
}

.sidebar-nav-number {
  font-family: var(--headerFont);
  font-size: 1.1rem;
  font-weight: 700;
  color: color-mix(in srgb, var(--secondary) 15%, transparent);
  line-height: 1;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.sidebar-nav-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sidebar-nav-tag {
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--tertiary);
  line-height: 1.2;
}

.sidebar-nav-title {
  font-family: var(--headerFont);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--dark);
  line-height: 1.3;
}

.sidebar-nav-desc {
  font-size: 0.72rem;
  color: var(--darkgray);
  line-height: 1.5;
  margin-top: 0.1rem;
}

@media all and (max-width: 800px) {
  .sidebar-nav-list {
    flex-direction: row;
    gap: 0.15rem;
    overflow-x: auto;
  }

  .sidebar-nav-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.2rem;
    padding: 0.5rem 0.6rem;
    min-width: max-content;
  }

  .sidebar-nav-text {
    align-items: center;
  }

  .sidebar-nav-desc {
    display: none;
  }
}
`

  return SidebarNav
}) satisfies QuartzComponentConstructor<SidebarNavConfig>
