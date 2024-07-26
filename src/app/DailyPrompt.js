"use client";

import { useState } from 'react';
import axios from 'axios';

const DailyPrompt = () => {
  const [prompt, setPrompt] = useState("Write a poem about the beauty of nature.");
  const [stanzaType, setStanzaType] = useState("Couplet");
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stanza1.vercel.app/api';

  const handleInputChange = (e) => {
    const value = e.target.value;
    const maxLines = getMaxLines(stanzaType);
    const lines = value.split('\n').length;

    if (lines <= maxLines) {
      setInputValue(value);
    }
  };

  const handleSubmit = async () => {
    const maxLines = getMaxLines(stanzaType);
    const lines = inputValue.split('\n').length;

    if (lines > maxLines) {
      setErrorMessage(`${stanzaType}s should have ${maxLines} lines`);
      setIsSubmitted(false);
      setTimeout(() => setErrorMessage(""), 4000);
    } else {
      setErrorMessage("");
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 1000);

      try {
        const response = await axios.post(`${API_URL}/poems`, {
          stanzaType,
          content: inputValue,
        });
        console.log('Poem submitted:', response.data);
        setInputValue('');
      } catch (error) {
        console.error('Error submitting poem:', error);
        setErrorMessage('Error submitting poem. Please try again.');
        setTimeout(() => setErrorMessage(''), 4000);
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
      <h1 className="text-2xl md:text-4xl lg:text-3xl font-bold text-black mb-4 text-center">{prompt}</h1>
      <div className="flex justify-center mb-4">
        <select
          value={stanzaType}
          onChange={(e) => setStanzaType(e.target.value)}
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
        onChange={handleInputChange}
        className="w-full p-2 border text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        rows={getMaxLines(stanzaType)}
        placeholder={`Write your ${stanzaType.toLowerCase()} here...`}
        style={{ resize: 'none' }}
      />
      {errorMessage && (
        <p className="text-red-500 mt-2">{errorMessage}</p>
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
