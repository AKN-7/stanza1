"use client";

import { useState, useEffect } from 'react';

const DailyPrompt = () => {
  const [prompt, setPrompt] = useState("Write a poem about the beauty of nature.");
  const [stanzaType, setStanzaType] = useState("Couplet");
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [poems, setPoems] = useState([]);
  const [submittedPoems, setSubmittedPoems] = useState({});

  useEffect(() => {
    const storedPoems = JSON.parse(localStorage.getItem('poems')) || [];
    const storedSubmittedPoems = JSON.parse(localStorage.getItem('submittedPoems')) || {};
    setPoems(storedPoems);
    setSubmittedPoems(storedSubmittedPoems);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    const maxLines = getMaxLines(stanzaType);
    const lines = inputValue.split('\n').length;

    if (lines > maxLines) {
      setErrorMessage(`${stanzaType}s should have ${maxLines} lines`);
      setIsSubmitted(false);
      setTimeout(() => setErrorMessage(""), 4000);
    } else if (submittedPoems[today]?.includes(stanzaType)) {
      setErrorMessage(`You have already submitted a ${stanzaType} today.`);
      setIsSubmitted(false);
      setTimeout(() => setErrorMessage(""), 4000);
    } else {
      setErrorMessage("");
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 1000);

      const newPoem = { stanzaType, content: inputValue, date: new Date().toISOString() };
      const updatedPoems = [...poems, newPoem];
      const updatedSubmittedPoems = {
        ...submittedPoems,
        [today]: [...(submittedPoems[today] || []), stanzaType],
      };

      setPoems(updatedPoems);
      setSubmittedPoems(updatedSubmittedPoems);

      localStorage.setItem('poems', JSON.stringify(updatedPoems));
      localStorage.setItem('submittedPoems', JSON.stringify(updatedSubmittedPoems));

      setInputValue('');
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
            isSubmitted ? 'border-green-500 bg-green-500 text-white' : ''
          }`}
        >
          {isSubmitted ? '✔' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default DailyPrompt;
