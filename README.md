# Job Tracker

A personal job application tracker that scores and ranks opportunities based on your own preferences. Built with Next.js and runs entirely in the browser — no backend, no database, no account required.

## Features

- **Application log** — track job title, company, contact, application date, salary, and status
- **Scoring system** — each application is automatically scored across five dimensions:
  - **Title fit** — how well the role matches what you're looking for (0–100)
  - **Working policy** — remote/hybrid/office weighting, adjusted by commute distance
  - **Challenge** — how technically interesting the role is (0–100)
  - **Autonomy** — level of ownership and independence (0–100)
  - **Salary** — how the offered salary compares to your minimum and target
- **Configurable weights** — set your minimum/target salary and working policy preferences in Settings
- **Sort & compare** — sort the table by date, salary, status, or total score
- **Edit & delete** — update any application or remove stale entries
- **Persistent** — all data stored in `localStorage`; nothing leaves your browser

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Running Tests

```bash
npm test          # run once
npm run test:watch  # watch mode
```

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
├── components/
│   ├── jobs/                # Dashboard, table, add/edit modal, form steps
│   ├── layout/              # AppShell wrapper
│   └── settings/            # Settings form
├── hooks/
│   ├── useJobs.ts           # Job CRUD state
│   └── useSettings.ts       # Settings state
├── models/
│   ├── job.ts               # JobApplication, JobScoring, ApplicationStatus types
│   └── settings.ts          # UserSettings, WorkingPolicyWeights, SalarySettings types
└── services/
    ├── jobs.service.ts      # localStorage CRUD for job applications
    ├── scoring.service.ts   # Pure scoring functions
    └── settings.service.ts  # localStorage read/write for settings

tests/
└── unit/services/           # Unit tests for all three services
```

## Configuration

No environment variables are required. All user preferences are stored in `localStorage` under two keys:

| Key | Contents |
|---|---|
| `job-tracker:settings` | Working policy weights and salary settings |
| `job-tracker:jobs` | Array of job applications |

To reset everything, clear `localStorage` in your browser's dev tools.

## Scoring Details

The total score is the sum of five components (no weighting between them):

| Component | Range | Notes |
|---|---|---|
| Title fit | 0–100 | Manual score |
| Working policy | 0–100 | Configurable per-policy weight × distance modifier (1.0 / 0.75 / 0.5) |
| Challenge | 0–100 | Manual score |
| Autonomy | 0–100 | Manual score |
| Salary | 0–100+ | Linear scale from minimum → target; can exceed 100 above target |

Scores marked with `*` in the table use an estimated salary (the "Not Listed" path).
