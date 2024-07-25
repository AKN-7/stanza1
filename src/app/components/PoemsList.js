"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

const adminPassword = "diesel"; // Admin password

const PoemsList = () => {
  const [poems, setPoems] = useState([]);
  const [password, setPassword] = useState(""); // State to manage the password

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Load poems and likes from the server on component mount
    const fetchData = async () => {
      const response = await axios.get(`${API_URL}/poems`);
      setPoems(response.data);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [API_URL]);

  const handleClearStorage = async () => {
    if (password === adminPassword) {
      try {
        await axios.delete(`${API_URL}/poems`); // Ensure this matches the backend route
        setPoems([]);
        localStorage.removeItem('likedPoems'); // Clear liked poems
      } catch (error) {
        console.error('Error clearing poems:', error);
      }
    } else {
      alert("Incorrect password.");
    }
  };

  const handleLike = async (index) => {
    const poem = poems[index];
    const likedPoems = JSON.parse(localStorage.getItem('likedPoems')) || {};

    if (!likedPoems[poem._id]) {
      const response = await axios.post(`${API_URL}/poems/${poem._id}/like`);
      const updatedPoem = response.data;
      setPoems(poems.map((p, i) => (i === index ? updatedPoem : p)));

      likedPoems[poem._id] = true; // Mark poem as liked
      localStorage.setItem('likedPoems', JSON.stringify(likedPoems));
    } else {
      alert("You have already liked this poem.");
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 relative">
      <h1 className="text-2xl md:text-4xl lg:text-3xl font-bold text-black mb-4 text-center">Submitted Poems</h1>
      {poems.length === 0 ? (
        <p className="text-center">No poems submitted yet.</p>
      ) : (
        poems.map((poem, index) => (
          <div key={poem._id} className="border p-4 mb-4 rounded relative overflow-hidden">
            <h2 className="text-xl font-bold">{poem.stanzaType}</h2>
            <p className="whitespace-pre-wrap break-words">{poem.content}</p>
            <p className="text-sm text-gray-500">{new Date(poem.date).toLocaleString()}</p>
            <button
              onClick={() => handleLike(index)}
              className="absolute top-2 right-2 flex items-center"
            >
              <span className="mr-1">{poem.likes}</span>
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
      <div className="fixed bottom-4 right-4 p-2 bg-white border rounded">
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2 p-1"
        />
        <button
          onClick={handleClearStorage}
          className="bg-white text-black p-1 rounded"
        >
          Clear Poems
        </button>
      </div>
    </div>
  );
};

export default PoemsList;
