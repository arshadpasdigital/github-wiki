import { QdrantVectorStore as LangChainQdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { OpenAIEmbeddings } from "@langchain/openai";

/** The model and vector size must stay aligned with the Qdrant collection. */
export const EMBEDDING_MODEL = "text-embedding-3-large" as const;
export const EMBEDDING_VECTOR_SIZE = 3072;
export const DEFAULT_SEARCH_LIMIT = 4;

class QdrantVectorStore {
  private vectorStore: LangChainQdrantVectorStore | null = null;
  private readonly embeddings = new OpenAIEmbeddings({ model: EMBEDDING_MODEL });

  constructor(private readonly collectionName: string) {}

  /** Connect to the collection, creating it when it does not exist. */
  async connect(): Promise<LangChainQdrantVectorStore> {
    if (this.vectorStore) {
      return this.vectorStore;
    }

    const client = new QdrantClient({
      url: process.env.QDRANT_URL ?? "http://localhost:6333",
      apiKey: process.env.QDRANT_API_KEY,
    });

    const { collections } = await client.getCollections();
    const collectionExists = collections.some(
      (collection) => collection.name === this.collectionName,
    );

    if (!collectionExists) {
      await client.createCollection(this.collectionName, {
        vectors: {
          size: EMBEDDING_VECTOR_SIZE,
          distance: "Cosine",
        },
      });
    }

    this.vectorStore = await LangChainQdrantVectorStore.fromExistingCollection(
      this.embeddings,
      {
        client,
        collectionName: this.collectionName,
      },
    );

    return this.vectorStore;
  }

  /** Search this repository collection using the same embedding model as indexing. */
  async vectorSearch(query: string, limit = DEFAULT_SEARCH_LIMIT) {
    const vectorStore = await this.connect();
    return vectorStore.similaritySearchWithScore(query, limit);
  }
}

export default QdrantVectorStore;
