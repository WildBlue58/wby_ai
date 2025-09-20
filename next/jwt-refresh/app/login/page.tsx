"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { emailRegex, passwordRegex } from "@/lib/regexp";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isEmailValid = emailRegex.test(email || "");
  const isPasswordValid = passwordRegex.test(password || "");
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "登录失败，请稍后再试");
        return;
      }
      // 登录成功，展示提示并跳转
      setSuccess("登录成功");
      setPassword("");
      setTimeout(() => {
        setSuccess(null);
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      setError("网络错误，请检查网络后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-0px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white shadow-xl ring-1 ring-slate-900/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            {success && (
              <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2">
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
                  {success}
                </div>
              </div>
            )}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                登录
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                使用您的邮箱与密码登录账户
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  邮箱
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  placeholder="you@example.com"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-600 outline-none transition focus:ring-2 ${
                    email.length === 0
                      ? "border-slate-300 focus:ring-slate-300"
                      : isEmailValid
                      ? "border-emerald-300 focus:ring-emerald-300"
                      : "border-red-300 focus:ring-red-300"
                  }`}
                />
                {email.length > 0 && !isEmailValid && (
                  <p className="mt-1 text-xs text-red-600">
                    请输入有效的邮箱地址
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6-18位，且不能全为数字"
                    className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-600 outline-none transition focus:ring-2 ${
                      password.length === 0
                        ? "border-slate-300 focus:ring-slate-300"
                        : isPasswordValid
                        ? "border-emerald-300 focus:ring-emerald-300"
                        : "border-red-300 focus:ring-red-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-2 my-auto rounded px-2 text-xs text-slate-500 hover:text-slate-700"
                    aria-label={showPassword ? "隐藏密码" : "显示密码"}
                  >
                    {showPassword ? "隐藏" : "显示"}
                  </button>
                </div>
                {password.length > 0 && !isPasswordValid && (
                  <p className="mt-1 text-xs text-red-600">
                    密码需6-18位，且不能全为数字
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid || loading}
                className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  !isFormValid || loading
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-slate-900 hover:bg-slate-800 focus:ring-slate-900"
                }`}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    正在登录...
                  </span>
                ) : (
                  "登录"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              还没有账户？请先注册。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
