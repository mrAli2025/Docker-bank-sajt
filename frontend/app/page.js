import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <nav className="flex w-full gap-6 p-4 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/" className="font-medium text-black dark:text-zinc-50">
          Hem
        </Link>
        <Link href="/login" className="font-medium text-black dark:text-zinc-50">
          Logga in
        </Link>
        <Link href="/register" className="font-medium text-black dark:text-zinc-50">
          Skapa användare
        </Link>
      </nav>

      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-6 py-32 px-16 text-center">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Välkommen till Banken
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Ett säkert och enkelt sätt att hantera dina pengar.
        </p>
        <Link href="/register">
          <button className="rounded-full bg-foreground px-6 py-3 text-background font-medium transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]">
            Skapa användare
          </button>
        </Link>
      </main>
    </div>
  );
}