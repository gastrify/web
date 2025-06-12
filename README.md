# Gastrify

## Setup

1. Clone the repository

2. Copy the `.env.example` file to `.env.local` and set the environment variables

```bash
cp .env.example .env.local
```

3. Start the PostgreSQL database (development branch)

```bash
docker-compose up -d
```

This will start the PostgreSQL database service. The database connection URL is:

```
DATABASE_URL=postgres://neon:npg@localhost:5432/neondb
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
