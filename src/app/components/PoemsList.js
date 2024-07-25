"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

const adminPassword = "diesel"; // Admin password

const PoemsList = () => {
  const [poems, setPoems] = useState([]);
  const [likes, setLikes] = useState({});
  const [password, setPassword] = useState(""); // State to manage the password

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/poems');
        setPoems(response.data);
      } catch (error) {
        console.error('Error fetching poems:', error);
      }
    };
    fetchPoems();
  }, []);

  const handleClearStorage = async () => {
    if (password === adminPassword) {
      // You might want to add an endpoint to clear all poems from the database
      // For now, we just clear local state for simplicity
      setPoems([]);
      alert("Poems cleared successfully.");
    } else {
      alert("Incorrect password.");
    }
  };

  const handleLike = async (index) => {
    const poemId = poems[index]._id; // Unique identifier for the poem
    try {
      const response = await axios.post(`http://localhost:5000/poems/${poemId}/like`);
      const updatedPoem = response.data;
      setPoems(poems.map((poem) => (poem._id === poemId ? updatedPoem : poem)));
    } catch (error) {
      console.error('Error liking poem:', error);
    }
  };

  // Sort poems by likes, and then by date (most recent first)
  const sortedPoems = poems.sort((a, b) => {
    const likeDifference = b.likes - a.likes;
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
            <span className="mr-1">{likes[poem._id] || 0}</span>
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
