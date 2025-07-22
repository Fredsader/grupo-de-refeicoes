import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/meals";
const COMMENTS_URL = "http://localhost:5000/api/comments/meal";
const RATINGS_URL = "http://localhost:5000/api/ratings";

function StarRating({ mealId }) {
  const [avg, setAvg] = useState(null);
  const [votes, setVotes] = useState(0);
  const [myRating, setMyRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hover, setHover] = useState(null);

  const fetchRating = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${RATINGS_URL}/meals/${mealId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data || "Erro ao buscar avaliação");
      setAvg(Number(data[0]?.average_rating || 0));
      setVotes(Number(data[0]?.total_votes || 0));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRating();
  }, [mealId]);

  const handleRate = async (stars) => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      setMyRating(stars);
      const res = await fetch(`${RATINGS_URL}/${mealId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stars }),
      });
      if (!res.ok) throw new Error("Erro ao avaliar");
      fetchRating();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-2xl transition-all duration-200 ${star <= (hover ?? myRating ?? 0) ? "text-yellow-400 drop-shadow-[0_1px_4px_rgba(255,0,0,0.5)] scale-110" : "text-yellow-200 hover:text-red-400"}`}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            onClick={() => handleRate(star)}
            aria-label={`Avaliar com ${star} estrela${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm text-red-500 font-bold">
          {loading ? "..." : avg?.toFixed(2) || "-"} <span className="text-xs text-gray-500">({votes})</span>
        </span>
      </div>
      {error && <div className="text-red-500 text-xs">{error}</div>}
    </div>
  );
}

function Comments({ mealId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${COMMENTS_URL}/${mealId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data || "Erro ao buscar comentários");
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [mealId]);

  const handleComment = async (e) => {
    e.preventDefault();
    setPosting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${COMMENTS_URL}/${mealId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment_text: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data || "Erro ao comentar");
      setText("");
      fetchComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="mt-2">
      <div className="font-semibold text-sm mb-1 text-red-500 flex items-center gap-1">💬 Comentários</div>
      {loading && <div className="text-gray-400 text-sm">Carregando...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <ul className="mb-2 flex flex-col gap-2">
        {comments.map((c) => (
          <li key={c.comment_id || c.id} className="text-sm text-gray-800 bg-yellow-100 border border-red-200 rounded-2xl px-3 py-2 shadow-sm flex items-center gap-2 animate-fade-in">
            <span className="text-red-400">🍟</span> {c.comment_text}
          </li>
        ))}
        {comments.length === 0 && !loading && <li className="text-gray-400 text-xs">Nenhum comentário ainda.</li>}
      </ul>
      <form onSubmit={handleComment} className="flex gap-2 mt-1">
        <input
          className="border-2 border-yellow-300 rounded-xl px-3 py-1 flex-1 text-sm focus:ring-2 focus:ring-red-300 transition-all"
          type="text"
          placeholder="Comente algo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          disabled={posting}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-yellow-400 to-red-400 hover:from-red-400 hover:to-yellow-400 text-white font-bold px-4 py-1 rounded-xl text-sm shadow-md transition-all duration-200 disabled:opacity-60 border-2 border-yellow-200"
          disabled={posting || !text.trim()}
        >
          {posting ? "..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}

function UserAvatar({ name }) {
  const initial = name ? name[0].toUpperCase() : "U";
  // Avatar alterna cor entre amarelo e vermelho
  const bg = initial.charCodeAt(0) % 2 === 0 ? "bg-yellow-400" : "bg-red-400";
  const text = initial.charCodeAt(0) % 2 === 0 ? "text-red-700" : "text-yellow-100";
  return (
    <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center font-bold text-lg shadow-inner border-2 border-yellow-200 mr-2 ${text}`}>
      {initial}
    </div>
  );
}

export default function Feed() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data || "Erro ao buscar refeições");
        setMeals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-200 to-red-200 py-8 px-2">
      <h1 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-400 drop-shadow text-center flex items-center justify-center gap-2">🍳 Feed de Refeições</h1>
      {loading && <div className="text-red-400 text-center font-bold">Carregando...</div>}
      {error && <div className="text-red-500 text-center font-bold">{error}</div>}
      {!loading && !error && meals.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-400 border-2 border-yellow-300">
          Nenhuma refeição postada ainda.
        </div>
      )}
      <div className="flex flex-col gap-10">
        {meals.map((meal) => (
          <div key={meal.meal_id} className="bg-white rounded-2xl shadow-xl p-6 flex gap-6 items-start border-2 border-yellow-300 transition-all hover:shadow-2xl hover:border-red-400 animate-fade-in">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-200 to-red-200 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-yellow-300 shadow-md">
              {meal.image_url ? (
                <img src={meal.image_url} alt="Refeição" className="object-cover w-full h-full" />
              ) : (
                <span className="text-red-300 text-3xl">🍔</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <UserAvatar name={meal.author_name || "Usuário"} />
                <span className="font-semibold text-gray-700 text-lg flex items-center gap-2">{meal.description} <span className="text-xl">🥗</span></span>
              </div>
              <div className="text-sm text-red-400 mb-2 font-bold">por usuário {meal.user_id}</div>
              <StarRating mealId={meal.meal_id} />
              <Comments mealId={meal.meal_id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 