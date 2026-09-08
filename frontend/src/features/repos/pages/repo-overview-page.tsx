import { Link, useParams } from "@tanstack/react-router"
import { ArrowRight, FolderTree, MessageSquareText, Search } from "lucide-react"

import { RepoChromeHeader } from "@/features/repos/components/repo-chrome-header"

export function RepoOverviewPage() {
  const { repoId } = useParams({ from: "/protected/repo/$repoId" })

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-[var(--terminal-bg)] text-[var(--terminal-text)]">
      <RepoChromeHeader repoId={repoId} />

      <main className="min-h-0 flex-1 overflow-auto p-[30px] max-[760px]:p-[17px]">
        <div className="mb-[22px] flex items-end justify-between">
          <div>
            <span className="eyebrow">REPOSITORY</span>
            <h1 className="mt-[9px] font-mono text-[27px] leading-none font-medium tracking-[-0.04em] text-[#edf5f5]">
              {repoId}
            </h1>
          </div>
          <span className="header-context-pill">
            <span className="status-dot is-green" /> INDEXED
          </span>
        </div>

        <div className="grid grid-cols-3 gap-[14px] max-[1060px]:grid-cols-2 max-[760px]:grid-cols-1">
          <Link
            to="/repo/$repoId/sessions"
            params={{ repoId }}
            className="border border-[var(--terminal-rule)] bg-[var(--terminal-surface)] p-[19px] no-underline transition-colors hover:border-[var(--terminal-cyan)]"
          >
            <span className="grid size-[34px] place-items-center border border-[#2d555c] bg-[#0b181b] text-[var(--terminal-cyan)]">
              <MessageSquareText size={18} />
            </span>
            <span className="eyebrow mt-[16px] block">SESSIONS</span>
            <strong className="mt-[7px] block font-mono text-[15px] leading-none font-medium text-[#e7f0ef]">
              Chat threads
            </strong>
            <p className="mt-[9px] m-0 font-mono text-[10px] leading-[1.5] text-[var(--terminal-muted)]">
              Browse and continue conversations for this repository.
            </p>
            <span className="mt-[14px] inline-flex items-center gap-[6px] font-mono text-[9px] tracking-[0.06em] text-[var(--terminal-cyan)]">
              OPEN <ArrowRight size={13} />
            </span>
          </Link>

          <div className="border border-[var(--terminal-rule)] bg-[var(--terminal-surface)] p-[19px] opacity-70">
            <span className="grid size-[34px] place-items-center border border-[#66532c] text-[var(--terminal-amber)]">
              <FolderTree size={18} />
            </span>
            <span className="eyebrow mt-[16px] block">FOLDER STRUCTURE</span>
            <strong className="mt-[7px] block font-mono text-[15px] leading-none font-medium text-[#e7f0ef]">
              Repository tree
            </strong>
            <p className="mt-[9px] m-0 font-mono text-[10px] leading-[1.5] text-[var(--terminal-muted)]">
              Visualize the repo layout and file relationships.
            </p>
            <span className="mt-[14px] inline-flex items-center gap-[6px] font-mono text-[9px] tracking-[0.06em] text-[var(--terminal-faint)]">
              SOON
            </span>
          </div>

          <div className="border border-[var(--terminal-rule)] bg-[var(--terminal-surface)] p-[19px] opacity-70">
            <span className="grid size-[34px] place-items-center border border-[#2d4f57] text-[var(--terminal-cyan)]">
              <Search size={18} />
            </span>
            <span className="eyebrow mt-[16px] block">SEARCH INDEX</span>
            <strong className="mt-[7px] block font-mono text-[15px] leading-none font-medium text-[#e7f0ef]">
              Symbol search
            </strong>
            <p className="mt-[9px] m-0 font-mono text-[10px] leading-[1.5] text-[var(--terminal-muted)]">
              Find functions, types, and files across the indexed source.
            </p>
            <span className="mt-[14px] inline-flex items-center gap-[6px] font-mono text-[9px] tracking-[0.06em] text-[var(--terminal-faint)]">
              SOON
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
