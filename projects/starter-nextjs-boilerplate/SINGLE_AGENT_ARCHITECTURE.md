# Single-Agent Architecture

## What a Single Agent Means

A single-agent architecture is one focused AI agent designed to complete one clear workflow.

It is different from a general chatbot because it has a defined job, defined inputs, defined tools, safety rules, and a clear output.

A good first agent should be small, useful, and safe.

## Proposed Agent

### Agent Name

Task Suggestion Agent

### Main Job

Read uploaded file content and suggest task items that the user can review and approve.

## Why This Agent Fits TaskFlow

TaskFlow already has the foundation for this workflow:

- User authentication
- Database task CRUD
- File upload with Supabase Storage
- A clear task structure with title, status, and priority

The next AI step is not to let AI control the app fully. The safer next step is to let AI suggest useful tasks from uploaded content.

## Input

The agent receives:

- Extracted text from an uploaded file
- Optional user instruction, such as “Find action items”
- Existing task structure or allowed task fields

## Tools the Agent Could Use Later

The agent may eventually use tools such as:

- Read uploaded file text
- Read existing tasks
- Suggest new tasks
- Create approved tasks in Supabase

For the first safe version, the agent should only suggest tasks. It should not write directly to the database without user approval.

## Safe Workflow

1. User uploads a file.
2. App stores the file in Supabase Storage.
3. App extracts text from the file.
4. Agent reviews the extracted text.
5. Agent suggests possible tasks.
6. User reviews the suggestions.
7. User approves selected tasks.
8. App creates only approved tasks in Supabase.

## Safety Rule

The agent should not automatically create, update, or delete tasks without user approval.

Safe principle:

AI suggests → user reviews → user approves → app acts.

## Example

Uploaded file text:

“Prepare the landing page, follow up with the designer, check Meta Ads performance, and send the weekly report.”

Agent suggested tasks:

1. Prepare the landing page.
2. Follow up with the designer.
3. Check Meta Ads performance.
4. Send the weekly report.

User can approve all, edit some, or reject them.

## Why This Is a Good First Agent

This is a good first agent because:

- The workflow is clear.
- The risk is controlled.
- The output is useful.
- The user remains in control.
- It builds on the existing TaskFlow app.
- It can later become part of a larger clinic growth or productivity system.

## Future Clinic SaaS Version

The same architecture could later become a clinic workflow agent.

Example:

Clinic Lead Follow-Up Agent

It could:

- Read new leads
- Classify intent
- Detect urgent or high-value leads
- Suggest WhatsApp replies
- Flag weak follow-up
- Prepare manager summaries

But even in that future version, risky actions should still require human review first.