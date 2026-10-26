# Team conventions

- TypeScript strict mode, no `any`
- Errors return `{ code, message }`: throw `AppError` from `src/errors.ts`, never `res.json({ error })`
- Every endpoint ships with a test in `tests/<router>.test.ts` (Vitest + supertest, call `resetStore()` in `beforeEach`)
- Never log NIC or phone numbers, and never put them in error messages

## Project facts

- Express API for bus seat booking. Routers live in `src/routes/`, input validation in `src/validation/`.
- Data is in memory (`src/store.ts`). Add store functions there instead of touching arrays from routes.
- Run `npm test` and `npm run typecheck` before you say a change is done.
