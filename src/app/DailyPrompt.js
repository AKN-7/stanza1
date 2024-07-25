"use client";

import { useState } from 'react';
import axios from 'axios';

const DailyPrompt = () => {
  const [prompt, setPrompt] = useState("Write a poem about the beauty of nature."); // Set a default prompt
  const [stanzaType, setStanzaType] = useState("Couplet"); // Default stanza type
  const [inputValue, setInputValue] = useState(""); // State to manage the input value
  const [errorMessage, setErrorMessage] = useState(""); // State to manage error messages
  const [isSubmitted, setIsSubmitted] = useState(false); // State to manage submit button animation

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleInputChange = (e) => {
    const value = e.target.value;
    const maxLines = getMaxLines(stanzaType);
    const lines = value.split('\n').length;

    if (lines <= maxLines) {
      setInputValue(value); // Update the input value as long as it's within the limit
    }
  };

  const handleSubmit = async () => {
    const maxLines = getMaxLines(stanzaType);
    const lines = inputValue.split('\n').length;

    if (lines > maxLines) {
      setErrorMessage(`${stanzaType}s should have ${maxLines} lines`);
      setIsSubmitted(false);
      setTimeout(() => setErrorMessage(""), 4000); // Hide error message after 4 seconds
    } else {
      setErrorMessage(""); // Clear error message if input is valid
      setIsSubmitted(true); // Trigger button animation
      setTimeout(() => setIsSubmitted(false), 1000); // Reset animation state after 1 second

      // Add logic to handle valid submission, e.g., save the poem
      try {
        const response = await axios.post(`${API_URL}/poems`, {
          stanzaType,
          content: inputValue,
        });
        console.log('Poem submitted:', response.data);
      } catch (error) {
        console.error('Error submitting poem:', error);
      }
    }
  };

  const getMaxLines = (type) => {
    switch (type) {
      case "Couplet":
        return 2;
      case "Tercet":
        return 3;
      case "Quatrain":
        return 4;
      case "Quintain":
        return 5;
      default:
        return 5;
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <h1 className="text-2xl md:text-4xl lg:text-3xl font-bold text-black mb-4 text-center">{prompt}</h1> {/* Display the daily prompt */}
      <div className="flex justify-center mb-4">
        <select
          value={stanzaType}
          onChange={(e) => setStanzaType(e.target.value)} // Update stanza type based on user selection
          className="p-2 text-black border rounded"
        >
          <option value="Couplet">Couplet</option>
          <option value="Tercet">Tercet</option>
          <option value="Quatrain">Quatrain</option>
          <option value="Quintain">Quintain</option>
        </select>
      </div>
      <textarea
        value={inputValue}
        onChange={handleInputChange} // Handle input changes
        className="w-full p-2 border text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        rows={getMaxLines(stanzaType)} // Set the rows based on stanza type
        placeholder={`Write your ${stanzaType.toLowerCase()} here...`} // Dynamic placeholder based on stanza type
        style={{ resize: 'none' }} // Prevent resizing
      />
      {errorMessage && (
        <p className="text-red-500 mt-2">{errorMessage}</p> // Display error message if any
      )}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          className={`border border-black bg-white text-black p-2 rounded transition-all duration-500 ${
            isSubmitted ? 'border-green-500' : ''
          } hover:bg-green-500`}
        >
          {isSubmitted ? '✔' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default DailyPrompt;
