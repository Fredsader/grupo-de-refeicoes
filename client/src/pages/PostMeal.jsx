import React, { useState } from "react";

const API_URL = "http://localhost:5000/api/meals";

export default function PostMeal() {
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function uploadImage(file) {
    return Promise.resolve("https://placehold.co/200x200?text=Foto");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImage(image);
      }
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image_url: imageUrl, description: desc }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data || "Erro ao postar refeição");
      setSuccess(true);
      setDesc("");
      setImage(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-200 to-red-200 flex items-center justify-center py-12 px-2">
      <div className="bg-white/90 p-10 rounded-2xl shadow-2xl border-2 border-yellow-300 max-w-md w-full">
        <h1 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-400 drop-shadow text-center flex items-center justify-center gap-2">🍳 Postar Refeição</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 transition-all"
          />
          <textarea
            className="border-2 border-yellow-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-300 text-lg transition-all shadow-sm min-h-[80px] resize-none"
            placeholder="Descrição da refeição"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">Refeição postada com sucesso!</div>}
          <button
            type="submit"
            className="bg-gradient-to-r from-yellow-400 to-red-400 hover:from-red-400 hover:to-yellow-400 text-white font-bold py-3 rounded-xl text-lg shadow-md transition-all duration-200 disabled:opacity-60 border-2 border-yellow-200"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Postar"}
          </button>
        </form>
      </div>
    </div>
  );
} 