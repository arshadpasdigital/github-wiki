import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import type { Embeddings } from "@langchain/core/embeddings";

class VectorStore {
  private instance: QdrantVectorStore | null = null;

  constructor(
    private readonly embeddings: Embeddings,
    private readonly collectionName: string,
    private readonly vectorSize: number = 3072, // text-embedding-3-large outputs 3072 dimensions
  ) {}

  async Connected(): Promise<QdrantVectorStore> {
    // Already connected this run — return the cached instance, don't reconnect
    if (this.instance) {
      return this.instance;
    }

    const client = new QdrantClient({
      url: process.env.QDRANT_URL ?? "http://localhost:6333",
      apiKey: process.env.QDRANT_API_KEY,
    });


    const { collections } = await client.getCollections();
    const exists = collections.some((c) => c.name === this.collectionName);

    if (!exists) {
      await client.createCollection(this.collectionName, {
        vectors: {
          size: this.vectorSize,
          distance: "Cosine",
        },
      });
    }

    this.instance = await QdrantVectorStore.fromExistingCollection(this.embeddings, {
      client,
      collectionName: this.collectionName,
    });

    return this.instance;
  }
}

export default VectorStore;