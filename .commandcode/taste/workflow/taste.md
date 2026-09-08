# Workflow

- Prefers converting/refactoring the codebase one feature or page at a time (e.g., "convert one feature at a time and starting with landing page"; "Next feature can be the dashboard."). Confidence: 0.8
- When creating a new module or feature, prefers it to mirror the folder structure and conventions of an existing analogous module in the codebase (e.g., "follow the task folder structure create similar for user"; copying the repo feature layout for login/auth; "now do similar think for @server/src/services/session"). Confidence: 0.9
- Works feature-by-feature through a roadmap, explicitly sequencing which feature comes next. Confidence: 0.6
- Backend services follow a consistent layered structure: controllers/, services/, repositories/, routes/, dependencies/, and validation/ folders, each holding a single domain-named file (e.g., message.controller.ts), wired together via a DI container in dependencies/. Confidence: 0.7
- When something in the existing design looks off or duplicated, prefers to pause and ask for an analysis and recommendation before implementation (e.g., "can you analysis and tell me the design is correct or we need to update the design"). Confidence: 0.6
