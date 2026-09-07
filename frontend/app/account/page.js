"use client";

import { useState, useEffect } from "react";

export default function Account() {
  const [amount, setAmount] = useState(null);
  const [deposit, setDeposit] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://127.0.0.1:3001/me/accounts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error("Kunde inte hämta saldo");
        }

        const data = await response.json();
        setAmount(data.amount);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBalance();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:3001/me/accounts/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, amount: Number(deposit) }),
      });

      if (!response.ok) {
        throw new Error("Kunde inte sätta in pengar");
      }

      const data = await response.json();
      setAmount(data.amount);
      setDeposit("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black px-4">
      <div className="flex flex-col gap-6 w-full max-w-sm bg-white dark:bg-zinc-900 p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-center">Mitt konto</h1>

        <p className="text-center text-xl">
          Saldo: {amount !== null ? `${amount} kr` : "Laddar..."}
        </p>

        <form onSubmit={handleDeposit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="deposit">Belopp</label>
            <input
              id="deposit"
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              className="border rounded px-3 py-2"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="rounded-full bg-foreground px-6 py-3 text-background font-medium transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Sätt in pengar
          </button>
        </form>
      </div>
    </div>
  );
}