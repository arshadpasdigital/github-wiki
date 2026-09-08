# Tooling

- Prefers Tailwind CSS and wants existing plain CSS converted to Tailwind classes ("convert the normal css to tailwind css"; "convert the entire frontend to Tailwind classes"). Confidence: 0.9
- Builds UI from shadcn/ui components (e.g., shadcn sidebar) and TanStack Table for data tables. Confidence: 0.8
- Standardizes on @tanstack/react-router for routing and axios (plain/basic setup) for API calls in the frontend. Confidence: 0.8
- Uses better-auth (e.g., GitHub login) on the frontend and stores session state in zustand with persistence. Confidence: 0.6
- Uses Qdrant as the vector database for RAG indexing and embedding storage. Confidence: 0.7
- Uses Inngest for background/durable job orchestration (e.g., the repo indexing pipeline). Confidence: 0.7
- Uses LangChain (@langchain/openai) with OpenAI's text-embedding-3-large for chunking and embeddings. Confidence: 0.7
- Uses Bun as the package manager/runtime (runs `bunx tsc --noEmit` for typechecking). Confidence: 0.6
- Uses Zod schemas for request/input validation in backend services (with `.strict()` and `.refine()`). Confidence: 0.6
