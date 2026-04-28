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
  const [databaseStatusFilter, setDatabaseStatusFilter] = useState('All');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [databaseTasks, setDatabaseTasks] = useState<DatabaseTask[]>([]);
  const [databaseTasksError, setDatabaseTasksError] = useState('');
  const [isDatabaseTasksLoading, setIsDatabaseTasksLoading] = useState(true);
  const [databaseTaskMessage, setDatabaseTaskMessage] = useState('');
  const [editingDatabaseTaskId, setEditingDatabaseTaskId] = useState<number | null>(null);
  const [databaseEditTitle, setDatabaseEditTitle] = useState('');
  const [databaseEditStatus, setDatabaseEditStatus] = useState('To Do');
  const [databaseEditPriority, setDatabaseEditPriority] = useState('Medium');
  const [databaseTaskActionId, setDatabaseTaskActionId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [fileUploadError, setFileUploadError] = useState('');
  const [fileUploadMessage, setFileUploadMessage] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');

  const filteredTasks =
    statusFilter === 'All'
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  const filteredDatabaseTasks =
    databaseStatusFilter === 'All'
      ? databaseTasks
      : databaseTasks.filter((task) => task.status === databaseStatusFilter);

  function formatFileSize(fileSizeInBytes: number) {
    const fileSizeInKb = fileSizeInBytes / 1024;

    if (fileSizeInKb < 1024) {
      return `${fileSizeInKb.toFixed(1)} KB`;
    }

    return `${(fileSizeInKb / 1024).toFixed(2)} MB`;
  }

  async function loadDatabaseTasks(showLoadingState = true) {
    if (showLoadingState) {
      setIsDatabaseTasksLoading(true);
      setDatabaseTasksError('');
    }

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
    async function loadInitialDatabaseTasks() {
      await loadDatabaseTasks(false);
    }

    void loadInitialDatabaseTasks();
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

    const { error } = await supabase.from('tasks').insert({
      title: trimmedTitle,
      status,
      priority,
    });

    if (error) {
      setErrorMessage(`Could not save task to Supabase: ${error.message}`);
      setIsSubmitting(false);
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

    await loadDatabaseTasks();
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

  function handleStartDatabaseTaskEdit(task: DatabaseTask) {
    setDatabaseTaskMessage('');
    setDatabaseTasksError('');
    setEditingDatabaseTaskId(task.id);
    setDatabaseEditTitle(task.title);
    setDatabaseEditStatus(task.status);
    setDatabaseEditPriority(task.priority);
  }

  function handleCancelDatabaseTaskEdit() {
    setEditingDatabaseTaskId(null);
    setDatabaseEditTitle('');
    setDatabaseEditStatus('To Do');
    setDatabaseEditPriority('Medium');
    setDatabaseTasksError('');
  }

  async function handleUpdateDatabaseTask(taskId: number) {
    const trimmedTitle = databaseEditTitle.trim();

    if (!trimmedTitle) {
      setDatabaseTaskMessage('');
      setDatabaseTasksError('Please enter a task title before saving changes.');
      return;
    }

    setDatabaseTaskActionId(taskId);
    setDatabaseTaskMessage('');
    setDatabaseTasksError('');

    const { error } = await supabase
      .from('tasks')
      .update({
        title: trimmedTitle,
        status: databaseEditStatus,
        priority: databaseEditPriority,
      })
      .eq('id', taskId);

    if (error) {
      setDatabaseTasksError(`Could not update task in Supabase: ${error.message}`);
      setDatabaseTaskActionId(null);
      return;
    }

    await loadDatabaseTasks();
    setDatabaseTaskMessage('Database task updated successfully.');
    setDatabaseTaskActionId(null);
    handleCancelDatabaseTaskEdit();
  }

  async function handleDeleteDatabaseTask(taskId: number) {
    setDatabaseTaskActionId(taskId);
    setDatabaseTaskMessage('');
    setDatabaseTasksError('');

    const { error } = await supabase.from('tasks').delete().eq('id', taskId);

    if (error) {
      setDatabaseTasksError(`Could not delete task from Supabase: ${error.message}`);
      setDatabaseTaskActionId(null);
      return;
    }

    await loadDatabaseTasks();
    setDatabaseTaskMessage('Database task deleted successfully.');
    setDatabaseTaskActionId(null);

    if (editingDatabaseTaskId === taskId) {
      handleCancelDatabaseTaskEdit();
    }
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

  async function handleFileUpload() {
    if (!selectedFile) {
      setFileUploadMessage('');
      setUploadedFileName('');
      setUploadedFileUrl('');
      setFileUploadError('Please choose a file before uploading.');
      return;
    }

    setIsFileUploading(true);
    setFileUploadError('');
    setFileUploadMessage('');
    setUploadedFileName('');
    setUploadedFileUrl('');

    const filePath = `${Date.now()}-${selectedFile.name.replace(/\s+/g, '-')}`;

    const { error } = await supabase.storage
      .from('task-files')
      .upload(filePath, selectedFile);

    if (error) {
      setFileUploadError(`Could not upload file: ${error.message}`);
      setIsFileUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('task-files').getPublicUrl(filePath);

    setUploadedFileName(selectedFile.name);
    setUploadedFileUrl(publicUrl);
    setFileUploadMessage('File uploaded successfully.');
    setSelectedFile(null);
    setIsFileUploading(false);
  }

  return (
    <div className="bg-zinc-50 px-4 py-10 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50 sm:px-6 sm:py-14 lg:py-16">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:px-12 lg:py-14">
            <div className="max-w-3xl lg:flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
                Deployed portfolio app
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                A task management app built with Next.js and Supabase.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:mt-6 sm:text-lg sm:leading-8">
                This deployed project brings together Supabase Auth, Database,
                and Storage in one small full-stack app designed to feel clear,
                practical, and portfolio-ready.
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
                  Polishing the production experience while keeping the working
                  Supabase foundations stable.
                </p>
              </div>
              <div className="grid gap-3 text-sm text-zinc-600 dark:text-zinc-300 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    Stack
                  </p>
                  <p className="mt-2">Next.js + Supabase</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    Features
                  </p>
                  <p className="mt-2">Auth, tasks, uploads</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-200 bg-white px-5 py-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:px-8 sm:py-10 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                Account access
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Sign in to manage your task workspace
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                Use your email account to sign up, log in, and continue working
                with your tasks and uploads in one place.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
              <div className="grid gap-4">
                {session ? (
                  <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 dark:border-zinc-700 dark:bg-zinc-950">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      You are logged in
                    </p>
                    <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                      {session.user.email}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                      You can now manage tasks and upload files.
                    </p>
                  </div>
                ) : (
                  <>
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
                  </>
                )}

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

                {!session ? (
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
                ) : null}

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
              App overview
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              One app, powered by the core Supabase building blocks.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
              The goal of this project is to show a coherent task management
              flow with authentication, live database tasks, and file uploads
              working together in a single deployed experience.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-3">
            <article className="flex h-full flex-col rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Auth
              </p>
              <h3 className="mt-4 text-xl font-semibold">Secure account access</h3>
              <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                Users can sign up, log in, and log out with Supabase Auth so
                the app has a real account flow instead of a static demo.
              </p>
            </article>

            <article className="flex h-full flex-col rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Database
              </p>
              <h3 className="mt-4 text-xl font-semibold">Live task management</h3>
              <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                Tasks are created, updated, filtered, and deleted through
                Supabase Database so the main workflow stays connected to live
                data.
              </p>
            </article>

            <article className="flex h-full flex-col rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Storage
              </p>
              <h3 className="mt-4 text-xl font-semibold">Simple file uploads</h3>
              <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                Files can be uploaded to the <code>task-files</code> bucket in
                Supabase Storage, giving the app a practical upload workflow.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-200 bg-white px-5 py-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Task workspace
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Manage your live Supabase tasks
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
              This is the main task area for the app. Review live tasks from
              Supabase, filter by status, and update or delete items without
              leaving the page.
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

            {databaseTaskMessage ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
                {databaseTaskMessage}
              </div>
            ) : null}

            {!isDatabaseTasksLoading && !databaseTasksError ? (
              databaseTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    No tasks yet. Create your first task.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    Add a task with the form above to see it appear here.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:flex-row sm:items-end sm:justify-between">
                    <div className="w-full sm:max-w-xs">
                      <label
                        className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
                        htmlFor="databaseStatusFilter"
                      >
                        Filter live tasks by status
                      </label>
                      <select
                        className="mt-2 h-11 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-400"
                        id="databaseStatusFilter"
                        name="databaseStatusFilter"
                        onChange={(event) => setDatabaseStatusFilter(event.target.value)}
                        value={databaseStatusFilter}
                      >
                        <option>All</option>
                        <option>To Do</option>
                        <option>In Progress</option>
                        <option>Done</option>
                      </select>
                    </div>

                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      {filteredDatabaseTasks.length > 0
                        ? `${filteredDatabaseTasks.length} tasks shown`
                        : 'No tasks shown'}
                    </p>
                  </div>

                  {filteredDatabaseTasks.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        No tasks match this filter.
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                        Try a different status to see more live tasks.
                      </p>
                    </div>
                  ) : (
                    <div>
                  <div className="grid grid-cols-1 gap-3 border-b border-zinc-200 px-1 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
                    <p>Title</p>
                    <p>Status</p>
                    <p>Priority</p>
                    <p>Actions</p>
                  </div>

                  <ul className="mt-3 grid gap-3">
                    {filteredDatabaseTasks.map((task) => (
                      <li
                        key={task.id}
                        className="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center"
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 sm:hidden">
                            Title
                          </p>
                          {editingDatabaseTaskId === task.id ? (
                            <input
                              className="mt-2 h-11 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-400 sm:mt-0"
                              onChange={(event) => setDatabaseEditTitle(event.target.value)}
                              value={databaseEditTitle}
                            />
                          ) : (
                            <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50 sm:mt-0">
                              {task.title}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 sm:hidden">
                            Status
                          </p>
                          {editingDatabaseTaskId === task.id ? (
                            <select
                              className="mt-2 h-11 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-400 sm:mt-0"
                              onChange={(event) => setDatabaseEditStatus(event.target.value)}
                              value={databaseEditStatus}
                            >
                              <option>To Do</option>
                              <option>In Progress</option>
                              <option>Done</option>
                            </select>
                          ) : (
                            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 sm:mt-0">
                              {task.status}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 sm:hidden">
                            Priority
                          </p>
                          {editingDatabaseTaskId === task.id ? (
                            <select
                              className="mt-2 h-11 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-400 sm:mt-0"
                              onChange={(event) => setDatabaseEditPriority(event.target.value)}
                              value={databaseEditPriority}
                            >
                              <option>Low</option>
                              <option>Medium</option>
                              <option>High</option>
                            </select>
                          ) : (
                            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 sm:mt-0">
                              {task.priority}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 sm:hidden">
                            Actions
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2 sm:mt-0">
                            {editingDatabaseTaskId === task.id ? (
                              <>
                                <button
                                  className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                                  disabled={databaseTaskActionId === task.id}
                                  onClick={() => void handleUpdateDatabaseTask(task.id)}
                                  type="button"
                                >
                                  {databaseTaskActionId === task.id ? 'Saving...' : 'Save task changes'}
                                </button>
                                <button
                                  className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-zinc-50"
                                  disabled={databaseTaskActionId === task.id}
                                  onClick={handleCancelDatabaseTaskEdit}
                                  type="button"
                                >
                                  Cancel editing
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-zinc-50"
                                  disabled={databaseTaskActionId === task.id}
                                  onClick={() => handleStartDatabaseTaskEdit(task)}
                                  type="button"
                                >
                                  Edit
                                </button>
                                <button
                                  className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                                  disabled={databaseTaskActionId === task.id}
                                  onClick={() => void handleDeleteDatabaseTask(task.id)}
                                  type="button"
                                >
                                  {databaseTaskActionId === task.id ? 'Deleting...' : 'Delete'}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                  )}
                </div>
              )
            ) : null}
                  </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-200 bg-white px-5 py-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                File uploads
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Upload a file to Supabase Storage
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                This upload area lets you send a single file to Supabase
                Storage and confirm that the hosted file is available after the
                upload completes.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
              <div className="grid gap-4">
                <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm leading-6 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                  <p>One file can be selected at a time.</p>
                  <p className="mt-2">
                    The file uploads to the Supabase Storage bucket named <code>task-files</code>.
                  </p>
                  <p className="mt-2">
                    For now, uploaded files are not attached to a specific task yet.
                  </p>
                </div>

                <div>
                  <label
                    className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
                    htmlFor="taskFile"
                  >
                    Choose or replace your file
                  </label>
                  <input
                    className="mt-2 block w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:file:bg-zinc-100 dark:file:text-zinc-900"
                    id="taskFile"
                    name="taskFile"
                    onChange={(event) => {
                      const nextFile = event.target.files?.[0] ?? null;

                      setSelectedFile(nextFile);
                      setFileUploadError('');
                      setFileUploadMessage('');
                      setUploadedFileName('');
                      setUploadedFileUrl('');
                    }}
                    type="file"
                  />

                  {selectedFile ? (
                    <div className="mt-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        Selected file
                      </p>
                      <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
                        {selectedFile.name}
                      </p>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                        Size: {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                      No file selected yet. Choose a file to upload or replace your current selection.
                    </p>
                  )}
                </div>

                {fileUploadError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
                    {fileUploadError}
                  </div>
                ) : null}

                {fileUploadMessage ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <p>{fileUploadMessage}</p>
                    <p className="mt-2">
                      Uploaded file: <span className="font-semibold">{uploadedFileName}</span>
                    </p>
                    {uploadedFileUrl ? (
                      <a
                        className="mt-3 inline-flex text-sm font-semibold text-emerald-700 underline underline-offset-4 dark:text-emerald-300"
                        href={uploadedFileUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Open uploaded file
                      </a>
                    ) : null}
                  </div>
                ) : null}

                <button
                  className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                  disabled={isFileUploading}
                  onClick={() => void handleFileUpload()}
                  type="button"
                >
                  {isFileUploading ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-200 bg-white px-5 py-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              UI sandbox
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Supporting front-end patterns used while building the app
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
              This supporting section keeps a small local-state task interface
              on the page as part of the development journey, while the live
              Supabase task workspace above remains the main product flow.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <form
              className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
              onSubmit={handleSubmit}
            >
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Local Task Form
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  Add a new local task or update an existing one using the same form.
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
                Local Task List
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Review local tasks, filter by status, or choose an action for a specific task.
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

        <section className="rounded-[2rem] bg-zinc-900 px-5 py-8 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600">
                Project direction
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                A small full-stack app can still show clear product thinking.
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-300 dark:text-zinc-700">
                This project focuses on making a simple task management app feel
                more coherent, usable, and presentation-ready without adding
                unnecessary complexity.
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

        <footer className="px-4 pb-2 pt-1 text-center text-sm leading-6 text-zinc-500 dark:text-zinc-400 sm:px-6">
          <p>Deployed task management app</p>
          <p className="text-zinc-400 dark:text-zinc-500">
            Next.js + Supabase portfolio project
          </p>
        </footer>
      </main>
    </div>
  );
}
