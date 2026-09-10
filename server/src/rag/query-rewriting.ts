import { env } from "@/shared/config/env";
import { LLMProvider } from "./llmProvider";
import z from "zod";

const queryRewriteSchema = z.object({
	stepBack: z
		.string()
		.describe(
			"A broader, higher-level 'step-back' question whose answer gives useful background for the original query.",
		),
	rewritten: z
		.string()
		.describe(
			"The original query with spelling/grammar fixed and made clear and self-contained. Preserve the original intent.",
		),
	subQueries: z
		.array(z.string())
		.describe(
			"Exactly 3 focused sub-questions the original query can be decomposed into.",
		),
});

export const queryRewrite = async (query: string) => {
	const llmInstance = LLMProvider.getInstance(env.REWRITE_QUERY_LLM);
	const llm = (await llmInstance).withStructuredOutput(queryRewriteSchema, {
		name: "query_rewrite",
	});

	const llmResponse = await llm.invoke([
		{
			type: "system",
			content:
				"You are a query understanding assistant for a retrieval system. " +
				"Given a user's question, produce query variants that help retrieve relevant documents. " +
				"Apply three techniques: (1) step-back prompting -> one broader background question; " +
				"(2) query rewriting -> fix typos/grammar and make the query explicit and self-contained; " +
				"(3) sub-query decomposition -> break the query into exactly 3 focused sub-questions. " +
				"Respond ONLY with the structured JSON.",
		},
		{
			type: "user",
			content: query,
		},
	]);

	return {
		stepBack: llmResponse.stepBack ?? "",
		rewritten: llmResponse.rewritten ?? query,
		// Guard against the model returning more/fewer than 3.
		subQueries: Array.isArray(llmResponse.subQueries)
			? llmResponse.subQueries.slice(0, 3)
			: [],
	};
};


export const hydeDocument = async (query:string) =>{
    const llmInstance = LLMProvider.getInstance(env.REWRITE_QUERY_LLM);
    const llmResponse = (await llmInstance).invoke([{role: "system",
        content:
          "You are an expert writer. Write a concise, factual passage (3-5 sentences) that directly answers " +
          "the user's question, as if it were an excerpt from a relevant reference document. " +
          "Write confidently in a neutral, encyclopedic tone. Do not add disclaimers or say you are unsure."},
        {
            role:"human",content:query
        }]);
    return (await llmResponse).content;
}