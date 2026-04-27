'use client'

import { supabase } from "@/lib/supabaseClient";
import type { Session } from '@supabase/supabase-js';
import { FormEvent, useEffect, useState } from 'react';

type Task = {
  title: string;
  status: string;
  priority: string;
};

type DatabaseTask = {
  id: number;
  created_at: string;
  title: string;
  status: string;
  priority: string;
};

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [authMessage, setAuthMessage] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [databaseTasks, setDatabaseTasks] = useState<DatabaseTask[]>([]);
  const [databaseTasksError, setDatabaseTasksError] = useState('');
  const [isDatabaseTasksLoading, setIsDatabaseTasksLoading] = useState(true);

  const filteredTasks =
    statusFilter === 'All'
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  useEffect(() => {
    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setAuthError(error.message);
        return;
      }

      setSession(data.session);
    }

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function loadDatabaseTasks() {
      setIsDatabaseTasksLoading(true);
      setDatabaseTasksError('');

      const { data, error } = await supabase.from('tasks').select('*');

      if (error) {
        setDatabaseTasksError(error.message);
        setDatabaseTasks([]);
        setIsDatabaseTasksLoading(false);
        return;
      }

      setDatabaseTasks(data ?? []);
      setIsDatabaseTasksLoading(false);
    }

    void loadDatabaseTasks();
  }, []);

  function resetForm() {
    setTitle('');
    setStatus('To Do');
    setPriority('Medium');
    setEditIndex(null);
    setErrorMessage('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Please enter a task title before submitting.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 400));

    if (editIndex !== null) {
      setTasks((currentTasks) =>
        currentTasks.map((task, index) =>
          index === editIndex
            ? {
                title: trimmedTitle,
                status,
                priority,
              }
            : task,
        ),
      );
      setIsSubmitting(false);
      resetForm();
      return;
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        title: trimmedTitle,
        status,
        priority,
      },
    ]);
    setIsSubmitting(false);
    resetForm();
  }

  function handleEditTask(index: number) {
    const task = tasks[index];

    setTitle(task.title);
    setStatus(task.status);
    setPriority(task.priority);
    setEditIndex(index);
  }

  function handleDeleteTask(indexToDelete: number) {
    setTasks((currentTasks) =>
      currentTasks.filter((_, index) => index !== indexToDelete),
    );

    if (editIndex === indexToDelete) {
      resetForm();
      return;
    }

    if (editIndex !== null && indexToDelete < editIndex) {
      setEditIndex(editIndex - 1);
    }
  }

  function handleCancelEdit() {
    resetForm();
  }

  async function handleAuth(mode: 'signup' | 'login') {
    setAuthMessage('');
    setAuthError('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setAuthError('Please enter both an email and password.');
      return;
    }

    setIsAuthLoading(true);

    const { error } =
      mode === 'signup'
        ? await supabase.auth.signUp({
            email: trimmedEmail,
            password,
          })
        : await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password,
          });

    setIsAuthLoading(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    setAuthMessage(
      mode === 'signup'
        ? 'Sign-up successful. Check your email for the confirmation link if Supabase email confirmation is enabled.'
        : 'Logged in successfully.',
    );
  }

  async function handleLogout() {
    setAuthMessage('');
    setAuthError('');
    setIsAuthLoading(true);

    const { error } = await supabase.auth.signOut();

    setIsAuthLoading(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    setSession(null);
    setAuthMessage('Logged out successfully.');
  }

  return (
    <div className="bg-zinc-50 px-4 py-10 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50 sm:px-6 sm:py-14 lg:py-16">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:px-12 lg:py-14">
            <div className="max-w-3xl lg:flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
                Day 17 deployment practice
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Building my full-stack skills with Next.js, GitHub, VS Code,
                and AI tools.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:mt-6 sm:text-lg sm:leading-8">
                This landing page is part of my hands-on learning journey. I am
                practicing how to turn a starter project into something that
                feels clear, modern, and real one step at a time.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 sm:w-auto"
                  href="https://nextjs.org/learn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Continue the Next.js journey
                </a>
                <a
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-zinc-50 sm:w-auto"
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Track progress on GitHub
                </a>
              </div>
            </div>

            <div className="grid gap-4 rounded-3xl bg-zinc-50 p-5 dark:bg-zinc-900 sm:p-6 lg:max-w-sm lg:self-stretch">
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Current focus
                </p>
                <p className="mt-2 text-base leading-7 text-zinc-700 dark:text-zinc-200">
                  Turning a simple homepage into a polished landing page without
                  adding extra complexity.
                </p>
              </div>
              <div className="grid gap-3 text-sm text-zinc-600 dark:text-zinc-300 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    Stack
                  </p>
                  <p className="mt-2">Next.js + Tailwind</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    Workflow
                  </p>
                  <p className="mt-2">Plan, build, refine</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-200 bg-white px-5 py-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:px-8 sm:py-10 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                Supabase auth practice
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Try a simple email login flow
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                This small form lets me practice the basics of signing up and
                logging in with Supabase before connecting auth to the rest of
                the app.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
              <div className="grid gap-4">
                {session ? (
                  <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      Logged in as
                    </p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                      {session.user.email}
                    </p>
                  </div>
                ) : null}

                <div>
                  <label
                    className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
                    htmlFor="authEmail"
                  >
                    Email
                  </label>
                  <input
                    className="mt-2 h-11 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400"
                    id="authEmail"
                    name="authEmail"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                  />
                </div>

                <div>
                  <label
                    className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
                    htmlFor="authPassword"
                  >
                    Password
                  </label>
                  <input
                    className="mt-2 h-11 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400"
                    id="authPassword"
                    name="authPassword"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                  />
                </div>

                {authError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
                    {authError}
                  </div>
                ) : null}

                {authMessage ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {authMessage}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                    disabled={isAuthLoading}
                    onClick={() => void handleAuth('signup')}
                    type="button"
                  >
                    {isAuthLoading ? 'Working...' : 'Sign up'}
                  </button>
                  <button
                    className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-zinc-50"
                    disabled={isAuthLoading}
                    onClick={() => void handleAuth('login')}
                    type="button"
                  >
                    {isAuthLoading ? 'Working...' : 'Log in'}
                  </button>
                </div>

                {session ? (
                  <button
                    className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-zinc-50"
                    disabled={isAuthLoading}
                    onClick={() => void handleLogout()}
                    type="button"
                  >
                    {isAuthLoading ? 'Working...' : 'Log out'}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-200 bg-white px-5 py-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Features
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              A learning workflow built around steady progress.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
              Each section of this project reflects how I am approaching
              full-stack development: learning by doing, using tools
              thoughtfully, and keeping visible progress as I go.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-3">
            <article className="flex h-full flex-col rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Learn by Building
              </p>
              <h3 className="mt-4 text-xl font-semibold">Small projects, real practice</h3>
              <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                I am learning faster by turning each roadmap day into something
                tangible, from starter pages to more complete UI sections.
              </p>
            </article>

            <article className="flex h-full flex-col rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                AI-Assisted Workflow
              </p>
              <h3 className="mt-4 text-xl font-semibold">Plan first, then build with support</h3>
              <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                I use AI coding tools to clarify steps, speed up iteration, and
                stay focused while still understanding what I am building.
              </p>
            </article>

            <article className="flex h-full flex-col rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                GitHub Progress
              </p>
              <h3 className="mt-4 text-xl font-semibold">Visible improvement over time</h3>
              <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                Each commit helps document what I learned, what changed, and how
                this full-stack journey is growing week by week.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-[2rem] bg-zinc-900 px-5 py-8 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600">
                Keep going
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                One polished page at a time is still real progress.
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-300 dark:text-zinc-700">
                The goal is not to build everything at once. The goal is to keep
                shipping small improvements and keep moving forward through the
                roadmap.
              </p>
            </div>

            <div className="w-full lg:w-auto">
              <a
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-700 sm:w-auto"
                href="https://vercel.com/docs/frameworks/nextjs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the Next.js deployment guide
              </a>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-200 bg-white px-5 py-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Day 27 front-end review
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Simple task app with local state
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
              This practice section brings together create, read, update,
              delete, filtering, and basic UI states in one small front-end
              task app.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <form
              className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
              onSubmit={handleSubmit}
            >
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Task Form
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  Add a new task or update an existing one with the same form.
                </p>
              </div>

              <div className="grid gap-5">
                <div>
                  <label
                    className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    className="mt-2 h-11 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400"
                    id="title"
                    name="title"
                    onChange={(event) => {
                      const nextTitle = event.target.value;

                      setTitle(nextTitle);

                      if (nextTitle.trim()) {
                        setErrorMessage('');
                      }
                    }}
                    placeholder="Enter a task title"
                    required
                    value={title}
                  />
                </div>

                {errorMessage ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
                    {errorMessage}
                  </div>
                ) : null}

                <div>
                  <label
                    className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
                    htmlFor="status"
                  >
                    Status
                  </label>
                  <select
                    className="mt-2 h-11 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-400"
                    id="status"
                    name="status"
                    onChange={(event) => setStatus(event.target.value)}
                    value={status}
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>

                <div>
                  <label
                    className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
                    htmlFor="priority"
                  >
                    Priority
                  </label>
                  <select
                    className="mt-2 h-11 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-400"
                    id="priority"
                    name="priority"
                    onChange={(event) => setPriority(event.target.value)}
                    value={priority}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <button
                  className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting
                    ? editIndex !== null
                      ? 'Saving...'
                      : 'Adding...'
                    : editIndex !== null
                      ? 'Save Changes'
                      : 'Add Task'}
                </button>

                {editIndex !== null ? (
                  <button
                    className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-zinc-50"
                    onClick={handleCancelEdit}
                    type="button"
                  >
                    Cancel Edit
                  </button>
                ) : null}
              </div>
            </form>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Task List
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Review tasks, filter by status, or choose an action for a
                specific task.
              </p>

              <div className="mt-4">
                <label
                  className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
                  htmlFor="statusFilter"
                >
                  Filter by status
                </label>
                <select
                  className="mt-2 h-11 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-400"
                  id="statusFilter"
                  name="statusFilter"
                  onChange={(event) => setStatusFilter(event.target.value)}
                  value={statusFilter}
                >
                  <option>All</option>
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {tasks.length === 0
                      ? 'No tasks added yet'
                      : 'No matching tasks found'}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    {tasks.length === 0
                      ? 'Add your first task with the form to see it appear here.'
                      : 'Try a different status filter to see more tasks.'}
                  </p>
                </div>
              ) : (
                <div className="mt-4">
                  <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-3 border-b border-zinc-200 px-1 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                    <p>Title</p>
                    <p>Status</p>
                    <p>Priority</p>
                    <p>Actions</p>
                  </div>

                  <ul className="mt-3 grid gap-3">
                  {filteredTasks.map((task, index) => (
                    <li
                      key={`${task.title}-${index}`}
                      className="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 sm:hidden">
                          Title
                        </p>
                        <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50 sm:mt-0">
                          {task.title}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 sm:hidden">
                          Status
                        </p>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 sm:mt-0">
                          {task.status}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 sm:hidden">
                          Priority
                        </p>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 sm:mt-0">
                          {task.priority}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 sm:hidden">
                          Actions
                        </p>
                        <div className="mt-2 flex gap-2 sm:mt-0 sm:justify-start">
                          <button
                            className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-zinc-50"
                            onClick={() => handleEditTask(tasks.indexOf(task))}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                            onClick={() => handleDeleteTask(tasks.indexOf(task))}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-200 bg-white px-5 py-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Day 30 Supabase read practice
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Tasks loaded from the database
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
              This section reads the current tasks table from Supabase on page
              load while keeping the local task app unchanged for now.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            {isDatabaseTasksLoading ? (
              <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Loading database tasks...
                </p>
              </div>
            ) : null}

            {databaseTasksError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
                {databaseTasksError}
              </div>
            ) : null}

            {!isDatabaseTasksLoading && !databaseTasksError ? (
              databaseTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    No database tasks found
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    Add rows in Supabase later when you are ready to test writes.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-1 gap-3 border-b border-zinc-200 px-1 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
                    <p>Title</p>
                    <p>Status</p>
                    <p>Priority</p>
                  </div>

                  <ul className="mt-3 grid gap-3">
                    {databaseTasks.map((task) => (
                      <li
                        key={task.id}
                        className="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-center"
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 sm:hidden">
                            Title
                          </p>
                          <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50 sm:mt-0">
                            {task.title}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 sm:hidden">
                            Status
                          </p>
                          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 sm:mt-0">
                            {task.status}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 sm:hidden">
                            Priority
                          </p>
                          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 sm:mt-0">
                            {task.priority}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ) : null}
          </div>
        </section>

        <footer className="px-4 pb-2 pt-1 text-center text-sm leading-6 text-zinc-500 dark:text-zinc-400 sm:px-6">
          <p>Day 19 Diff Review Practice</p>
          <p className="text-zinc-400 dark:text-zinc-500">
            Full-Stack Roadmap Project
          </p>
        </footer>
      </main>
    </div>
  );
}
