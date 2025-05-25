# Gastrify

## Setup

1. Clone the repository

2. Copy the `.env.example` file to `.env.local` and set the environment variables

```bash
cp .env.example .env.local
```

3. Start the PostgreSQL database (development mode)

```bash
docker-compose up -d
```

This will start the PostgreSQL database service. The database connection URL is:

```
DATABASE_URL=postgresql://gastrify_user:gastrify_password@localhost:5432/gastrify
```

Make sure to add this to your `.env.local` file.

4. Install the dependencies

```bash
npm install
```

5. Start the development server

```bash
npm run dev
```
