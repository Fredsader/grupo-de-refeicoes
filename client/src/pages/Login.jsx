import React, { useState } from "react";

const API_URL = "http://localhost:5000/api/auth";

export default function Login({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        // LOGIN
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data || "Erro ao logar");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ name, email }));
        onAuth && onAuth({ email, token: data.token });
      } else {
        // CADASTRO
        const res = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data || "Erro ao cadastrar");
        // Após cadastro, faz login automático
        const loginRes = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData || "Erro ao logar");
        localStorage.setItem("token", loginData.token);
        localStorage.setItem("user", JSON.stringify({ name, email }));
        onAuth && onAuth({ email, token: loginData.token });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-yellow-200 animate-gradient-x">
      <div className="bg-white/90 p-10 rounded-3xl shadow-2xl w-full max-w-sm border border-yellow-100">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-yellow-500 tracking-tight drop-shadow">{isLogin ? "Entrar" : "Criar Conta"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {!isLogin && (
            <input
              className="border-2 border-yellow-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg transition-all shadow-sm"
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            className="border-2 border-yellow-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg transition-all shadow-sm"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border-2 border-yellow-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg transition-all shadow-sm"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-xl text-lg shadow-md transition-all duration-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>
        <button
          className="mt-6 text-sm text-gray-500 hover:underline w-full transition-all"
          onClick={() => { setIsLogin((v) => !v); setError(""); }}
        >
          {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
} 