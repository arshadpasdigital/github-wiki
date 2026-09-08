import { Link, useLocation } from "@tanstack/react-router"
import {
  Activity,
  BookOpen,
  Grid2X2,
  MessageSquareText,
  Settings2,
} from "lucide-react"

const appNavLinks = [
  { label: "Overview", to: "/dashboard", icon: Grid2X2 },
  { label: "Repositories", to: "/dashboard/repository", icon: BookOpen },
  { label: "Activity", to: "/dashboard/activity", icon: Activity },
  { label: "Settings", to: "/settings", icon: Settings2 },
] as const

export function RepoChromeHeader({ repoId }: { repoId: string }) {
  const location = useLocation()

  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-[var(--terminal-rule)] bg-[#070a0c] px-[18px] max-[900px]:flex-wrap max-[900px]:h-auto max-[900px]:gap-y-2 max-[900px]:py-2">
      <div className="flex min-w-0 items-center gap-6">
        <Link
          to="/dashboard"
          className="flex shrink-0 items-center gap-2.5 no-underline"
          aria-label="Wiki RAG home"
        >
          <span className="grid size-[29px] shrink-0 place-items-center border border-[var(--terminal-cyan)] font-mono text-[12px] leading-none font-bold tracking-[-1px] text-[var(--terminal-cyan)]">
            W/
          </span>
          <span className="hidden flex-col gap-[3px] whitespace-nowrap min-[520px]:flex">
            <strong className="font-mono text-[12px] leading-none font-bold tracking-[0.08em] text-[var(--terminal-text)]">
              WIKI//RAG
            </strong>
            <small className="font-mono text-[8px] leading-none tracking-[0.14em] text-[var(--terminal-muted)]">
              CODE INTELLIGENCE
            </small>
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-[7px] font-mono text-[10px] leading-none tracking-[0.06em] text-[var(--terminal-muted)]">
          <Link
            to="/dashboard/repository"
            className="shrink-0 text-[var(--terminal-cyan)] no-underline hover:text-[#a5eeee]"
          >
            REPOSITORY CONTROL
          </Link>
          <span className="text-[var(--terminal-faint)]">/</span>
          <span className="truncate text-[var(--terminal-text)]">{repoId}</span>
        </div>
      </div>

      <div className="flex items-center gap-[14px]">
        <nav
          className="flex items-center gap-1 border border-[var(--terminal-rule)] bg-[#0b1114] p-[3px] font-mono text-[9px] leading-none tracking-[0.06em]"
          aria-label="Workspace navigation"
        >
          {appNavLinks.map(({ label, to, icon: Icon }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-[24px] items-center gap-[6px] px-2 no-underline transition-colors ${
                  isActive
                    ? "bg-[#101a1e] text-[var(--terminal-cyan)]"
                    : "text-[var(--terminal-muted)] hover:bg-[#0d161a] hover:text-[var(--terminal-text)]"
                }`}
              >
                <Icon size={13} />
                <span className="hidden min-[480px]:inline">{label}</span>
              </Link>
            )
          })}
        </nav>

        <button
          className="relative grid size-[28px] shrink-0 place-items-center border-0 bg-transparent text-[var(--terminal-muted)] transition-colors hover:bg-[var(--terminal-surface-raised)] hover:text-[var(--terminal-text)]"
          type="button"
          aria-label="Messages"
        >
          <MessageSquareText size={16} />
          <span className="absolute top-[5px] right-[5px] size-1 rounded-full bg-[var(--terminal-amber)]" />
        </button>

        <div className="flex items-center gap-2 border-l border-[var(--terminal-rule)] pl-[14px]">
          <span className="grid size-[26px] place-items-center bg-[var(--terminal-amber)] font-mono text-[10px] leading-none font-bold text-[#101719]">
            PA
          </span>
          <span className="hidden flex-col gap-[3px] min-[380px]:flex">
            <strong className="font-mono text-[11px] leading-none font-semibold text-[var(--terminal-text)]">
              pasdigital
            </strong>
            <small className="font-mono text-[8px] leading-none tracking-[0.08em] text-[var(--terminal-muted)]">
              GITHUB
            </small>
          </span>
        </div>
      </div>
    </header>
  )
}
