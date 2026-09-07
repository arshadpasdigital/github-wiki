import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import type { Document } from "@langchain/core/documents";


class VectorStore {
  public static instance: QdrantVectorStore | null = null;

  constructor() {
  }

  static async Connected(collectionName: string): Promise<QdrantVectorStore> {
    // Already connected this run — return the cached instance, don't reconnect
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-large"
    });
    if (this.instance) {
      return this.instance;
    }

    this.instance = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: process.env.QDRANT_URL,
      collectionName,
      apiKey: process.env.QDRANT_API_KEY
    });

    return this.instance;
  }

  static async save(documents: Document[], collectionName: string) {
    const vectorStore = await this.Connected(collectionName);
    await vectorStore.addDocuments(documents);
  }

}

export { VectorStore };
