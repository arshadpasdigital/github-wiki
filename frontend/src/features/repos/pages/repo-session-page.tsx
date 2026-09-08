import { useParams } from "@tanstack/react-router"

import { SessionWorkspace } from "@/features/repos/components/session-workspace"

export function RepoSessionPage() {
  const { repoId, sessionId } = useParams({
    from: "/protected/repo/$repoId/sessions/$sessionId",
  })
  return <SessionWorkspace repoId={repoId} sessionId={sessionId} />
}
