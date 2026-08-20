import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const passwordRules = [
  { label: "8 characters minimum", test: (password: string) => password.length >= 8 },
  { label: "One uppercase letter", test: (password: string) => /[A-Z]/.test(password) },
  { label: "One number", test: (password: string) => /\d/.test(password) },
  { label: "One special character", test: (password: string) => /[^A-Za-z0-9]/.test(password) },
];
const demoEmail = "demo@connectify.app";
const demoPassword = "DemoPass1!";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState(false);

  const isStrongPassword = passwordRules.every((rule) => rule.test(password));
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = emailIsValid && isStrongPassword;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const isDemoAccount = email.toLowerCase() === demoEmail && password === demoPassword;
    setAuthError(canSubmit && !isDemoAccount);
    if (canSubmit && isDemoAccount) {
      localStorage.setItem("connectify-authenticated", "true");
      navigate({ to: "/" });
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f2] text-zinc-950 font-sans selection:bg-brand-soft">
      <div className="mx-auto grid min-h-screen max-w-[1480px] grid-cols-1 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative hidden overflow-hidden bg-[#153d35] p-10 text-[#f7f7f2] lg:flex lg:flex-col lg:justify-between lg:p-14 xl:p-20">
          <div className="absolute -right-24 -top-24 size-80 rounded-full border border-[#d8f2d1]/20" />
          <div className="absolute -bottom-36 -left-24 size-[28rem] rounded-full border border-[#d8f2d1]/15" />
          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-2" aria-label="Connectify home">
              <span className="grid size-9 place-items-center rounded-full bg-[#d8f2d1] text-[#153d35]">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <span className="font-serif text-2xl tracking-tight">connectify</span>
            </Link>
          </div>

          <div className="relative max-w-lg py-16">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#d8f2d1]/70">
              Find your people
            </p>
            <h1 className="font-serif text-6xl leading-[0.94] tracking-tight xl:text-7xl">
              More curious conversations. Less echo.
            </h1>
            <p className="mt-8 max-w-md text-base leading-7 text-[#d8f2d1]/75">
              Connectify helps you meet people who share your spark and people who expand your
              perspective.
            </p>
          </div>

          <div className="relative flex items-center gap-4 text-sm text-[#d8f2d1]/70">
            <div className="flex -space-x-2" aria-hidden="true">
              <span className="size-8 rounded-full border-2 border-[#153d35] bg-[#f3c9b3]" />
              <span className="size-8 rounded-full border-2 border-[#153d35] bg-[#b8d7e3]" />
              <span className="size-8 rounded-full border-2 border-[#153d35] bg-[#e9d58f]" />
            </div>
            <span>A quieter way to build a wider circle.</span>
          </div>
        </section>

        <section className="flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-16 xl:px-24">
          <div className="flex items-center justify-between lg:justify-end">
            <Link to="/" className="flex items-center gap-2 lg:hidden" aria-label="Connectify home">
              <span className="grid size-8 place-items-center rounded-full bg-brand text-white">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <span className="font-serif text-xl tracking-tight">connectify</span>
            </Link>
            <p className="text-sm text-zinc-500">
              New here? <Link to="/" className="font-semibold text-brand hover:underline">Browse as a guest</Link>
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-14">
            <div className="mb-10">
              <div className="mb-6 grid size-12 place-items-center rounded-2xl bg-[#e4f1df] text-brand">
                <LockKeyhole className="size-5" aria-hidden="true" />
              </div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                Welcome back
              </p>
              <h2 className="font-serif text-5xl leading-none tracking-tight">Sign in to your circle.</h2>
              <p className="mt-4 text-sm leading-6 text-zinc-500">
                Pick up where you left off and see who is waiting to meet you.
              </p>
              <div className="mt-5 rounded-xl border border-[#d8e8d3] bg-[#f0f7ec] px-4 py-3 text-xs leading-5 text-[#315b3a]">
                Demo access: <span className="font-semibold">{demoEmail}</span> with password{ " " }
                <span className="font-semibold">{demoPassword}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-zinc-800">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-13 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                  aria-invalid={submitted && !emailIsValid}
                />
                {submitted && !emailIsValid && (
                  <p className="mt-2 text-xs font-medium text-red-700">Enter a valid email address.</p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold text-zinc-800">
                    Password
                  </label>
                  <button type="button" className="text-xs font-semibold text-brand hover:underline">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    minLength={8}
                    pattern="(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}"
                    title="Use at least 8 characters, one uppercase letter, one number, and one special character."
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setAuthError(false);
                    }}
                    placeholder="Enter your password"
                    className="h-13 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-12 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                    aria-invalid={submitted && !isStrongPassword}
                    aria-describedby="password-requirements"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <div id="password-requirements" className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <div key={rule.label} className="flex items-center gap-2 text-xs text-zinc-500">
                        <span
                          className={`grid size-4 place-items-center rounded-full ${passed ? "bg-[#d8f2d1] text-brand" : "bg-zinc-100 text-zinc-300"}`}
                        >
                          <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
                        </span>
                        {rule.label}
                      </div>
                    );
                  })}
                </div>
                {submitted && !isStrongPassword && (
                  <p className="mt-3 text-xs font-medium text-red-700">Choose a password that meets all four requirements.</p>
                )}
                {authError && (
                  <p className="mt-3 text-xs font-medium text-red-700">
                    That email and password do not match our demo account.
                  </p>
                )}
              </div>

              <label className="flex cursor-pointer items-center gap-3 py-1 text-sm text-zinc-500">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="size-4 accent-brand"
                />
                Keep me signed in
              </label>

              <button
                type="submit"
                className="group flex h-13 w-full items-center justify-center gap-3 rounded-xl bg-[#153d35] text-sm font-semibold text-white shadow-lg shadow-[#153d35]/15 transition hover:bg-[#1c5247] active:scale-[0.99]"
              >
                Sign in
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </form>

            <p className="mt-8 text-center text-xs leading-5 text-zinc-400">
              By signing in, you agree to Connectify's terms and privacy policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}