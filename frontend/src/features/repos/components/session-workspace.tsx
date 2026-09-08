import { useState } from "react"
import {
  ArrowDown,
  Boxes,
  FileCode2,
  FolderOpen,
  FolderTree,
  GitBranch,
  MoreHorizontal,
  Network,
  PanelRightClose,
  Search,
  Send,
  Sparkles,
  Square,
  X,
} from "lucide-react"

import { RepoChromeHeader } from "./repo-chrome-header"

type Message = {
  id: string
  role: "user" | "assistant"
  time: string
  text: string
  citation?: { file: string; line: string; code: string }
}

const initialMessages: Message[] = [
  {
    id: "m1",
    role: "user",
    time: "14:26:41",
    text: "Where does the OAuth callback become a workspace session? Trace the boundary from the GitHub redirect.",
  },
  {
    id: "m2",
    role: "assistant",
    time: "14:26:44",
    text: "The handoff happens in two stages. GitHub returns to the auth callback, which exchanges the temporary code and then creates the application session before redirecting to the workspace.",
    citation: {
      file: "src/auth/github-callback.ts",
      line: "42–68",
      code: "const githubUser = await github.exchangeCode(code)\nconst session = await sessions.create(githubUser)",
    },
  },
  {
    id: "m3",
    role: "assistant",
    time: "14:26:44",
    text: "The session is then attached to the request context by the middleware layer. Downstream repository handlers never read the OAuth token directly; they receive the normalized workspace identity instead.",
    citation: {
      file: "src/middleware/session-context.ts",
      line: "19–34",
      code: "req.context = {\n  userId: session.userId,\n  workspaceId: session.workspaceId\n}",
    },
  },
]

const folderTree = [
  { name: "src/", depth: 0, type: "dir" as const },
  { name: "auth/", depth: 1, type: "dir" as const },
  { name: "github-callback.ts", depth: 2, type: "file" as const },
  { name: "middleware/", depth: 1, type: "dir" as const },
  { name: "session-context.ts", depth: 2, type: "file" as const },
  { name: "context/", depth: 1, type: "dir" as const },
  { name: "request-context.ts", depth: 2, type: "file" as const },
  { name: "index.ts", depth: 1, type: "file" as const },
]

const repoTools = [
  { label: "SEARCH INDEX", icon: Search },
  { label: "CODE GRAPH", icon: Network },
  { label: "SYMBOLS", icon: Boxes },
]

export function SessionWorkspace({
  sessionId = "s1",
  repoId = "atlas-core",
}: {
  sessionId?: string
  repoId?: string
}) {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState("")
  const [citation, setCitation] = useState<Message["citation"]>(
    initialMessages[1].citation
  )
  const [isStreaming, setIsStreaming] = useState(false)

  function sendMessage() {
    const text = draft.trim()
    if (!text || isStreaming) return
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", time: "now", text },
    ])
    setDraft("")
    setIsStreaming(true)
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          time: "now",
          text: "I’m tracing that path across the indexed files now. The first relevant handoff is in the request boundary; I’ll keep the answer anchored to the implementation.",
          citation: {
            file: "src/context/request-context.ts",
            line: "11–29",
            code: "export function withWorkspace(req, next) {\n  return next(resolveWorkspace(req))\n}",
          },
        },
      ])
      setIsStreaming(false)
    }, 900)
  }

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-[var(--terminal-bg)] text-[var(--terminal-text)]">
      <RepoChromeHeader repoId={repoId} />

      <div className="chat-layout min-h-0! flex-1! border-0! max-[760px]:flex! max-[760px]:min-h-0!">
        <aside className="session-sidebar">
          <div className="session-sidebar-top">
            <div>
              <span className="eyebrow">REPOSITORY TOOLS</span>
              <strong>STRUCTURE</strong>
            </div>
            <FolderTree size={15} className="text-[var(--terminal-cyan)]" />
          </div>

          <div className="p-[10px] font-mono text-[10px] leading-[1.7] text-[var(--terminal-muted)]">
            {folderTree.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-[6px]"
                style={{ paddingLeft: item.depth * 10 }}
              >
                {item.type === "dir" ? (
                  <FolderOpen size={11} className="text-[var(--terminal-cyan)]" />
                ) : (
                  <FileCode2 size={11} className="text-[var(--terminal-faint)]" />
                )}
                <span className={item.type === "dir" ? "text-[var(--terminal-cyan)]" : ""}>
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          <div className="p-[10px]">
            <div className="mb-[7px] font-mono text-[9px] tracking-[0.16em] text-[var(--terminal-muted)]">
              TOOLS
            </div>
            {repoTools.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                className="mb-[4px] flex w-full items-center gap-[8px] border border-transparent bg-transparent px-[8px] py-[6px] font-mono text-[9px] tracking-[0.06em] text-[var(--terminal-muted)] transition-colors hover:border-[var(--terminal-rule)] hover:text-[var(--terminal-text)]"
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          <div className="session-sidebar-bottom">
            <div className="repo-context">
              <span className="repo-icon">
                <FolderOpen size={15} />
              </span>
              <div>
                <strong>{repoId}</strong>
                <small>
                  <GitBranch size={11} /> main
                </small>
              </div>
              <MoreHorizontal size={15} />
            </div>
            <div className="session-hint">
              <Sparkles size={13} />
              <span>
                Answers stay grounded
                <br />
                in indexed source.
              </span>
            </div>
          </div>
        </aside>

        <section className="chat-thread">
          <div className="thread-toolbar">
            <div>
              <span className="eyebrow">SESSION {sessionId}</span>
              <h2>trace the auth boundary</h2>
            </div>
            <div className="thread-toolbar-actions">
              <span className="thread-token-count">1.2k TOKENS</span>
              <button
                className="mini-icon-button"
                type="button"
                aria-label="More session actions"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
          <div className="message-scroll">
            <div className="thread-date">
              <span />
              TODAY · 04 SEP 2026
              <span />
            </div>
            {messages.map((message) => (
              <article
                key={message.id}
                className={
                  message.role === "user"
                    ? "message-row is-user"
                    : "message-row"
                }
              >
                <div className="message-meta">
                  <span
                    className={
                      message.role === "user"
                        ? "message-avatar user"
                        : "message-avatar assistant"
                    }
                  >
                    {message.role === "user" ? "PA" : <Sparkles size={13} />}
                  </span>
                  <span>{message.role === "user" ? "YOU" : "WIKI//RAG"}</span>
                  <time>{message.time}</time>
                </div>
                <div
                  className={
                    message.role === "user"
                      ? "message-bubble user-bubble"
                      : "message-bubble"
                  }
                >
                  <p>{message.text}</p>
                  {message.citation && (
                    <button
                      className="citation-chip"
                      type="button"
                      onClick={() => setCitation(message.citation)}
                    >
                      <FileCode2 size={13} />
                      <span>{message.citation.file}</span>
                      <strong>:{message.citation.line}</strong>
                      <span>↗</span>
                    </button>
                  )}
                </div>
              </article>
            ))}
            {isStreaming && (
              <div className="streaming-line">
                <Sparkles size={14} />
                <span>SEARCHING INDEX</span>
                <i />
                <i />
                <i />
              </div>
            )}
          </div>
          <div className="composer-wrap">
            <div className="composer-context">
              <span>
                <span className="status-dot is-green" /> ANSWERS FROM 1,244
                INDEXED FILES
              </span>
              <span>SHIFT ↵ FOR NEWLINE</span>
            </div>
            <div className="composer">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Ask about this repository..."
                rows={2}
              />
              <button
                className="composer-send"
                type="button"
                onClick={sendMessage}
                disabled={!draft.trim() || isStreaming}
                aria-label="Send message"
              >
                {isStreaming ? <Square size={15} /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </section>

        {citation && (
          <aside className="citation-panel">
            <div className="citation-panel-heading">
              <div>
                <span className="eyebrow">SOURCE TRACE</span>
                <h2>Referenced file</h2>
              </div>
              <button
                className="mini-icon-button"
                type="button"
                onClick={() => setCitation(undefined)}
                aria-label="Close source trace"
              >
                <X size={15} />
              </button>
            </div>
            <div className="citation-file-head">
              <FileCode2 size={17} />
              <div>
                <strong>{citation.file}</strong>
                <small>{repoId} · main</small>
              </div>
            </div>
            <div className="source-location">
              <span>LINES {citation.line}</span>
              <span>TS</span>
            </div>
            <pre className="code-block">
              <code>{citation.code}</code>
            </pre>
            <div className="citation-panel-footer">
              <button className="text-button" type="button">
                <ArrowDown size={14} /> OPEN IN GITHUB
              </button>
              <button className="text-button" type="button">
                <PanelRightClose size={14} /> HIDE PANEL
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
