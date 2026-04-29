# AI Agent Workflow for TaskFlow

## Purpose

This document explains how AI coding assistants should work with the TaskFlow project safely.

TaskFlow is a portfolio-ready full-stack task management app built with:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Database
- Supabase Storage
- Vercel
- GitHub

The goal is to keep the app stable while using AI assistants for learning, documentation, code review, and small improvements.

## Current Project State

TaskFlow currently supports:

- Supabase email sign-up and login
- Email confirmation
- Session display
- Logout
- Real Supabase database CRUD for tasks
- Task filtering and clearer task UX
- Supabase Storage file upload
- Clean upload feedback
- Live Vercel deployment
- Project case study documentation

## AI Tools Used

### Codex

Use Codex as the main implementation assistant.

Best for:

- Guided coding steps
- Controlled feature implementation
- Explaining code changes
- Refactoring with approval
- Roadmap-based development

### Gemini CLI

Use Gemini as a second opinion and review assistant.

Best for:

- Code review
- Architecture feedback
- Small improvement suggestions
- Comparing approaches
- Documentation review

Recommended command:

```bash
npx -y @google/gemini-cli