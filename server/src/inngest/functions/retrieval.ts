import { Document } from 'mongoose';
import { hydeDocument } from "./../../rag/query-rewriting";
import { queryRewrite } from "@/rag/query-rewriting";
import { inngest } from "..";
import QdrantVectorStore from "@/shared/config/qdrant";

type labelType = {
	label: string;
	text: string;
};

export const ragRetrieval = inngest.createFunction(
	{
		id: "handle-repo-rag-retrieval",
		triggers: [{ event: "repo/rag-retrieval" }],
	},
	async ({ event, step }) => {
		const { message, sessionId, repoKey } = event.data;

		const store = new QdrantVectorStore(repoKey);

		const labelled = await step.run("query-rewriting", async () => {
			const [{ stepBack, rewritten, subQueries }, hyde] = await Promise.all([
				queryRewrite(message),
				hydeDocument(message),
			]);
			const labelled = [
				{ label: "rewritten", text: rewritten },
				{ label: "stepBack", text: stepBack },
				{ label: "hyde", text: hyde },
				...subQueries.map((q, i) => ({ label: `subQuery${i + 1}`, text: q })),
			].filter((q) => typeof q.text === "string" && q.text.trim().length > 0);

			return labelled;
		});

		await step.run("vector-search", async () => {
			const results = [];
			for await (const item of labelled) {
				const result = await store.vectorSearch(item.text as string);
				const obj = Object.fromEntries(result);
				results.push(obj)
			}
			const seen = new Set<string>();

			const dedupedDocs = results.filter(([Score,Document]) => {
				const key = Document.pageContent;
				if (seen.has(key)) return false;
				if(Number(Score)<= 0.75) return false
				seen.add(key);
				return true;
			});
			return dedupedDocs;
		});
	},
);
