import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import PostMeal from "./pages/PostMeal";
import Profile from "./pages/Profile";
import NavBar from "./components/NavBar";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {user && <NavBar />}
        <Routes>
          {!user ? (
            <Route path="*" element={<Login onAuth={setUser} />} />
          ) : (
            <>
              <Route path="/feed" element={<Feed />} />
              <Route path="/post" element={<PostMeal />} />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="*" element={<Navigate to="/feed" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
