# AI Document Production Tool

AI Document Production Tool is a simple BNH governance drafting app. Users choose a document type, enter a subject, provide 5 to 10 bullet points, add optional constraints, and generate an executive-ready first draft using the OpenAI API. Generated documents are saved to PostgreSQL and can be reviewed later from the document history page.

## Tech Stack

- Next.js 16 App Router for UI, pages, and API routes
- React 19
- Shadcn UI components
- Tailwind CSS
- Prisma 7
- PostgreSQL
- OpenAI API

## Architecture

- Next.js handles the UI and the `/api/generate` API route.
- Prisma stores generated documents in PostgreSQL.
- PostgreSQL is the database for document history and generated output.
- OpenAI API generates the governance document from the submitted inputs.
- The reusable BNH system prompt controls the writing style, structure, tone, and drafting constraints.

## Environment Variables

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
OPENAI_API_KEY="sk-..."
```

Optional:

```bash
OPENAI_MODEL="gpt-4o"
```

### DATABASE_URL

Use a PostgreSQL connection string. For a local database, it usually looks like:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_dpt"
```

Replace `postgres`, `postgres`, `localhost`, `5432`, and `ai_dpt` with your actual database user, password, host, port, and database name.

### OPENAI_API_KEY

Set `OPENAI_API_KEY` to a valid OpenAI API key:

```bash
OPENAI_API_KEY="sk-your-api-key"
```

The app uses a real OpenAI API call. Document generation will fail if this key is missing or invalid.

## Run Locally

Install dependencies:

```bash
npm install
```

Run Prisma migration:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Generate Documents

1. Go to `/generate`.
2. Select a document type: Role Mandate, Subsidiary Brief, or Board Note.
3. Enter a subject.
4. Add bullet points. Five to ten points are recommended.
5. Add optional instructions or constraints.
6. Submit the form.
7. The app calls the OpenAI API, saves the generated document to PostgreSQL, and redirects to `/documents/[id]`.

## View Documents

- Document history: `/documents`
- Document detail page: `/documents/[id]`
- System prompt page: `/system-prompt`

The `/system-prompt` page displays the exact reusable BNH system prompt used by the application.

## Create the Three Required Sample Outputs

1. Go to `/generate`.
2. Click `Load Role Mandate Sample`.
3. Submit the form to generate and save the Role Mandate output.
4. Return to `/generate`.
5. Click `Load Subsidiary Brief Sample`.
6. Submit the form to generate and save the Subsidiary Brief output.
7. Return to `/generate`.
8. Click `Load Board Note Sample`.
9. Submit the form to generate and save the Board Note output.
10. View all three generated documents from `/documents`.

The sample buttons only fill input fields. They do not create fake outputs; each submission still uses the live OpenAI API.
