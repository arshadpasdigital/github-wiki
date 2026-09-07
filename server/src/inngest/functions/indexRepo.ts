import { fetchRepo } from "@/shared/config/github";
import { inngest } from "..";
import { chunkFiles } from "@/rag/chunking";
import { VectorStore } from "@/rag/vectorStorage";

export const indexRepo = inngest.createFunction({
    id:"rag-indexing",triggers:[{event:"rag-indexing"}],
}, async({event,step})=>{
    const {repo,token, owner} = event.data;
    const repoName = repo.replace(/\.git$/,"");
    const repoKey = `${owner}:${repoName}`;

    const files = await step.run("get-repo-files",async ()=>{
        return fetchRepo(token,owner,repoName);
    })

    const document = await step.run("chunk-files",async()=>{
        return chunkFiles(files,repo);
    })

    await step.run("save-to-vectorDB",async()=>{
        await VectorStore.save(document,'abcd')
    })

    return {repo:repoKey, fileCount:files.length, chunkSize:document.length}
})