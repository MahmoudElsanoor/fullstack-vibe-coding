# TaskFlow — Full-Stack Task Management App Case Study

## Project Overview

TaskFlow is a portfolio-ready full-stack task management app built as part of my AI Coding Journey. The project started as a front-end learning exercise and gradually evolved into a deployed full-stack application with authentication, live database CRUD, file upload, and production cleanup.

The goal was not only to build a working app, but to understand how a modern web application is structured, developed, reviewed, deployed, and improved using AI-assisted coding tools.

## Problem

Many beginner coding projects stop at static pages or local front-end state. They may look good, but they do not prove how real applications work with users, sessions, databases, storage, deployment, and safe development workflows.

I wanted to build a practical learning project that could demonstrate the full journey from a simple interface to a working full-stack app.

The main challenge was to build the app step by step without breaking the working parts, while using AI coding assistants safely and staying in control of the code.

## Goals

The main goals of this project were:

- Build a real task management app using Next.js.
- Add user authentication with Supabase Auth.
- Connect the app to a real Supabase database.
- Support create, read, update, and delete operations.
- Add a basic file upload flow using Supabase Storage.
- Deploy the full-stack app to Vercel.
- Improve the app experience so it feels more coherent and portfolio-ready.
- Practice safe AI-assisted development using inspect-first prompts, diff review, commits, and deployment checks.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Database
- Supabase Storage
- Vercel
- GitHub
- Codex
- Gemini CLI
- GitHub Copilot CLI

## Key Features

### Authentication

The app supports a basic Supabase email authentication flow:

- Sign up
- Email confirmation
- Login
- Session display
- Logout

The auth section was later cleaned up so logged-in users see a clear signed-in state instead of still seeing the login form.

### Database Task Management

The app connects to a real Supabase `tasks` table and supports:

- Reading database tasks
- Creating new tasks
- Updating task title, status, and priority
- Deleting tasks
- Filtering tasks by status
- Showing task counts and clearer empty states

### File Upload

The app includes a beginner-friendly Supabase Storage upload flow:

- Select one file
- Show selected file details
- Upload to the `task-files` bucket
- Show a clean success message
- Open the uploaded file link

For now, uploaded files are not attached to specific tasks. This is a future improvement.

### Deployment

The app is deployed on Vercel and connected to GitHub. The production version was tested end to end after environment variables were added to Vercel.

Live app:
https://fullstack-vibe-starter.vercel.app/

Repository:
https://github.com/MahmoudElsanoor/fullstack-vibe-coding

## Development Process

The project was built in controlled stages:

1. Started with GitHub, VS Code, Node.js, and a clean Next.js starter.
2. Built and polished a landing page.
3. Added a local-state task app to understand CRUD.
4. Connected Supabase Auth.
5. Connected the app to a real Supabase database.
6. Completed live database CRUD.
7. Added Supabase Storage file upload.
8. Deployed the full-stack app to Vercel.
9. Improved production clarity and portfolio presentation.
10. Used Gemini CLI and GitHub Copilot CLI to compare second-opinion AI coding workflows.

## Important Decisions

### Build in small steps

Instead of trying to build everything at once, each feature was added separately. This made the project easier to understand and safer to test.

### Protect working logic

During cleanup days, I avoided changing working Supabase auth, database CRUD, storage policies, or environment variables. The focus was on improving clarity without breaking the app.

### Use AI carefully

AI tools were used with clear rules:

- Inspect first
- Do not edit until approved
- Keep changes small
- Review diffs before commit
- Test locally
- Push only after verification

### Compare AI tools

Codex was used as the main implementation assistant. Gemini CLI was used for second-opinion code review and small safe improvement suggestions. GitHub Copilot CLI was evaluated as an optional terminal/project helper.

## Challenges and Fixes

### Vercel environment variables

The deployed app initially needed the correct Supabase environment variables inside Vercel. After adding them, the production app connected successfully to Supabase.

### Supabase Storage policies

The first storage upload attempt failed due to row-level security. The issue was solved by adding the correct Storage object policies for the `task-files` bucket.

### Tool setup

Gemini CLI installation through Homebrew was slow and problematic on the Mac setup, so it was successfully launched through `npx` instead.

## Outcome

TaskFlow became a working full-stack portfolio project with:

- Real authentication
- Real database CRUD
- Real file upload
- Live deployment
- Cleaner production UI
- Safer AI-assisted workflow habits

The project helped me move from front-end learning into real full-stack app thinking.

## What I Learned

I learned how modern apps are built in layers:

- Front-end interface
- User authentication
- Database connection
- CRUD logic
- File storage
- Deployment
- Production verification
- Safe Git and AI-assisted workflows

I also learned that a live app is not complete just because it builds. It must be tested end to end in production.

## Future Improvements

Possible future improvements include:

- Connect tasks to specific logged-in users.
- Enable proper Row Level Security policies.
- Attach uploaded files to specific tasks.
- Add better task due dates and categories.
- Add dashboard analytics.
- Improve mobile UI.
- Create a dedicated portfolio page for the project.