"use client";

import { useState, useEffect } from 'react';

const adminPassword = "diesel"; // Admin password

const PoemsList = () => {
  const [poems, setPoems] = useState([]);
  const [likes, setLikes] = useState({});
  const [password, setPassword] = useState(""); // State to manage the password

  useEffect(() => {
    // Load poems and likes from local storage on component mount
    const storedPoems = JSON.parse(localStorage.getItem('poems')) || [];
    const storedLikes = JSON.parse(localStorage.getItem('likes')) || {};
    setPoems(storedPoems);
    setLikes(storedLikes);
  }, []);

  const handleClearStorage = () => {
    if (password === adminPassword) {
      localStorage.removeItem('poems');
      localStorage.removeItem('submittedPoems'); // Clear submitted poems tracking
      setPoems([]);
      alert("Poems cleared successfully.");
    } else {
      alert("Incorrect password.");
    }
  };

  const handleLike = (index) => {
    const poemId = poems[index].date; // Unique identifier for the poem
    const userLikes = JSON.parse(localStorage.getItem('userLikes')) || {};

    if (!userLikes[poemId]) {
      const updatedLikes = { ...likes, [poemId]: (likes[poemId] || 0) + 1 };
      setLikes(updatedLikes);
      localStorage.setItem('likes', JSON.stringify(updatedLikes));

      userLikes[poemId] = true;
      localStorage.setItem('userLikes', JSON.stringify(userLikes));
    } else {
      alert("You have already liked this poem.");
    }
  };

  // Sort poems by likes, and then by date (most recent first)
  const sortedPoems = poems.sort((a, b) => {
    const likeDifference = (likes[b.date] || 0) - (likes[a.date] || 0);
    if (likeDifference !== 0) return likeDifference;
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="p-4 md:p-8 lg:p-12 relative">
      <h1 className="text-2xl md:text-4xl lg:text-3xl font-bold text-black mb-4 text-center">Submitted Poems</h1>
      {sortedPoems.length === 0 ? (
        <p className="text-center">No poems submitted yet.</p>
      ) : (
        sortedPoems.map((poem, index) => (
          <div key={index} className="border p-4 mb-4 rounded relative overflow-hidden">
            <h2 className="text-xl font-bold">{poem.stanzaType}</h2>
            <p className="whitespace-pre-wrap break-words">{poem.content}</p>
            <p className="text-sm text-gray-500">{new Date(poem.date).toLocaleString()}</p>
            <button
              onClick={() => handleLike(index)}
              className="absolute top-2 right-2 flex items-center"
            >
              <span className="mr-1">{likes[poem.date] || 0}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          </div>
        ))
      )}
      <div className="fixed bottom-4 right-4 p-2 border rounded bg-white">
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2 p-1 border rounded"
        />
        <button
          onClick={handleClearStorage}
          className="border border-black bg-white text-black p-1 rounded"
        >
          Clear Poems
        </button>
      </div>
    </div>
  );
};

export default PoemsList;
