import { fetchRepo } from "@/shared/config/github";
import { inngest } from "..";
import { chunkFiles } from "@/rag/chunking";
import QdrantVectorStore from "@/shared/config/qdrant";
import { IndexingStatus, RepoModel } from "@/shared/models/repos.model";

const BATCH_SIZE = 25;

export const indexRepo = inngest.createFunction({
    id: "handle-repo-rag-indexing", triggers: [{ event: "repo/rag-indexing" }],
}, async ({ event, step }) => {
    const { repo, token, owner, githubRepoId } = event.data;
    const repoName = repo.replace(/\.git$/, "");
    const repoKey = `${owner}:${repoName}`;

    const { files, sha } = await step.run("get-repo-files", async () => {
        return fetchRepo(token, owner, repoName);
    })

    await step.run("init-progress", async () => {
        await RepoModel.findByIdAndUpdate(githubRepoId, {
            $set: {
                "indexingProgress.totalFiles": files.length,
                "indexingProgress.filesProcessed": 0,
            },
        });
    });



    const totalBatches = Math.ceil(files.length / BATCH_SIZE);

    for (let i = 0; i < totalBatches; i++) {
        const batch = files.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
        const filesProcessed = Math.min(files.length, (i + 1) * BATCH_SIZE);

        await step.run(`process-batch-${i}`, async () => {
            const store = new QdrantVectorStore(repoKey);
            const vectorStore = await store.connect();
            const documents = await chunkFiles(batch, repoName);
            await vectorStore.addDocuments(documents);

            await RepoModel.findByIdAndUpdate(githubRepoId, {
                $set: { "indexingProgress.filesProcessed": filesProcessed },
            });
        });
    }

    await RepoModel.findByIdAndUpdate(githubRepoId, {
        $set: {
            indexingStatus: IndexingStatus.Ready,
            lastIndexedAt: Date.now(),
            lastIndexedCommitSha: sha,
        }
    })

    return { repo: repoKey, fileCount: files.length }
})
