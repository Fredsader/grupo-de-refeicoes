import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function UserAvatar({ name }) {
  const initial = name ? name[0].toUpperCase() : "U";
  const bg = initial.charCodeAt(0) % 2 === 0 ? "bg-yellow-400" : "bg-red-400";
  const text = initial.charCodeAt(0) % 2 === 0 ? "text-red-700" : "text-yellow-100";
  return (
    <div className={`w-16 h-16 rounded-full ${bg} flex items-center justify-center font-bold text-2xl shadow-inner border-4 border-yellow-200 mr-2 ${text}`}>
      {initial}
    </div>
  );
}

export default function Profile({ user }) {
  const [meals, setMeals] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const usersRes = await fetch(`${API_URL}/api/users`);
        const users = await usersRes.json();
        const thisUser = users.find((u) => u.name === user.email || u.email === user.email);
        const userId = thisUser?.user_id || users[0]?.user_id;
        const mealsRes = await fetch(`${API_URL}/api/users/${userId}/meals`);
        const mealsData = await mealsRes.json();
        setMeals(mealsData);
        const ratingRes = await fetch(`${API_URL}/api/ratings/users/${userId}`);
        const ratingData = await ratingRes.json();
        setAvgRating(ratingData[0]?.overall_average_rating || "0.00");
      } catch (err) {
        setError("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const userName = JSON.parse(localStorage.getItem("user"))?.name || "Usuário";

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-200 to-red-200 py-12 px-2 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-400 drop-shadow text-center flex items-center justify-center gap-2">👤 Meu Perfil</h1>
      {loading && <div className="text-red-400 text-center font-bold">Carregando...</div>}
      {error && <div className="text-red-500 text-center font-bold">{error}</div>}
      {!loading && !error && (
        <>
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 flex items-center gap-6 border-4 border-yellow-300 animate-fade-in">
            <UserAvatar name={userName} />
            <div>
              <div className="font-bold text-2xl text-gray-700 mb-1">{userName}</div>
              <div className="font-semibold text-md text-red-400">Média das avaliações recebidas:</div>
              <div className="text-4xl text-yellow-500 font-extrabold drop-shadow">{avgRating ?? '-'}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-yellow-300 w-full max-w-xl animate-fade-in">
            <div className="font-semibold mb-4 text-gray-700 text-lg flex items-center gap-2">🍽️ Minhas refeições:</div>
            {meals.length === 0 ? (
              <div className="text-gray-400 text-center">Nenhuma refeição postada ainda.</div>
            ) : (
              <ul className="flex flex-col gap-4">
                {meals.map((meal) => (
                  <li key={meal.meal_id} className="flex gap-3 items-center bg-gradient-to-r from-yellow-100 to-red-100 rounded-xl px-4 py-3 shadow-sm border-2 border-yellow-200">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border-2 border-yellow-200">
                      {meal.image_url ? (
                        <img src={meal.image_url} alt="Refeição" className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-red-300 text-2xl">🍟</span>
                      )}
                    </div>
                    <span className="text-gray-700 font-medium flex items-center gap-2">{meal.description} <span className="text-lg">🥗</span></span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
} 