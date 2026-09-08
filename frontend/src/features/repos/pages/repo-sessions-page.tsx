import { useState } from "react"
import { Link, useParams } from "@tanstack/react-router"
import { ChevronRight, Pin, Plus } from "lucide-react"

import { RepoChromeHeader } from "@/features/repos/components/repo-chrome-header"

type Session = {
  id: string
  title: string
  time: string
  pinned: boolean
}

const mockSessions: Session[] = [
  { id: "s1", title: "trace the auth boundary", time: "14:26", pinned: true },
  { id: "s2", title: "where are retries handled?", time: "yesterday", pinned: false },
  { id: "s3", title: "map the webhook flow", time: "yesterday", pinned: false },
  { id: "s4", title: "session invalidation notes", time: "12 Aug", pinned: false },
]

export function RepoSessionsPage() {
  const { repoId } = useParams({ from: "/protected/repo/$repoId/sessions" })
  const [sessions, setSessions] = useState(mockSessions)

  function addSession() {
    const next: Session = {
      id: `s-${Date.now()}`,
      title: "new session",
      time: "now",
      pinned: false,
    }
    setSessions((current) => [next, ...current])
  }

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-[var(--terminal-bg)] text-[var(--terminal-text)]">
      <RepoChromeHeader repoId={repoId} />

      <main className="min-h-0 flex-1 overflow-auto p-[30px] max-[760px]:p-[17px]">
        <div className="mb-[22px] flex items-end justify-between">
          <div>
            <span className="eyebrow">SESSIONS</span>
            <h1 className="mt-[9px] font-mono text-[27px] leading-none font-medium tracking-[-0.04em] text-[#edf5f5]">
              {sessions.length.toString().padStart(2, "0")} THREADS
            </h1>
          </div>
          <button className="solid-button" type="button" onClick={addSession}>
            <Plus size={15} /> NEW SESSION
          </button>
        </div>

        <section className="border border-[var(--terminal-rule)] bg-[var(--terminal-surface)]">
          {sessions.map((session) => (
            <Link
              key={session.id}
              to="/repo/$repoId/sessions/$sessionId"
              params={{ repoId, sessionId: session.id }}
              className="flex min-h-[54px] items-center gap-[12px] border-b border-[var(--terminal-rule-soft)] px-[16px] no-underline transition-colors last:border-b-0 hover:bg-[#0e171b]"
            >
              <span className="size-[7px] rounded-full border border-[var(--terminal-faint)]" />
              <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
                <strong className="truncate font-mono text-[11px] leading-none font-medium text-[var(--terminal-text)]">
                  {session.title}
                </strong>
                <small className="font-mono text-[9px] leading-none text-[var(--terminal-muted)]">
                  {session.time}
                </small>
              </div>
              {session.pinned && <Pin size={13} className="text-[var(--terminal-amber)]" />}
              <ChevronRight size={15} className="text-[var(--terminal-faint)]" />
            </Link>
          ))}
        </section>
      </main>
    </div>
  )
}
