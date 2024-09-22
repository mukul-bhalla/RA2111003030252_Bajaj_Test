import React, { useState } from "react";
import axios from "axios";
import Select from 'react-select';
import './index.css';

const options = [
  { value: 'Numbers', label: 'Numbers' },
  { value: 'Alphabets', label: 'Alphabets' },
  { value: 'HighestLowercaseAlphabet', label: 'Highest Lowercase Alphabet' },
];

const App = () => {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);


  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        const base64 = await convertFileToBase64(selectedFile);
        setFile(base64);
      } catch (error) {
        alert("File reading error: " + error.message);
      }
    }
  };


  const handleSubmit = async () => {
    try {
      setError(null);
      const jsonData = JSON.parse(input);
      const payload = {
        data: jsonData.data,
        file_b64: file || ""
      };

      const res = await axios.post("https://bajaj-test-9541.onrender.com/bfhl", payload);
      setResponse(res.data);
   
      alert('Submission successful!');
    } catch (err) {
      setError("Invalid JSON or server error");
      alert('Submission failed: ' + err.message);
    }
  };
  const handleFilterChange = (selectedOptions) => {
    setSelectedFilters(selectedOptions.map(option => option.value));
  };


  const renderResponse = () => {
    if (!response) return null;

    let formattedResponse = '';

    if (selectedFilters.includes('Numbers') && response.numbers) {
      formattedResponse += `Numbers: ${response.numbers.join(', ') || "None"}\n`;
    }

    if (selectedFilters.includes('Alphabets') && response.alphabets) {
      formattedResponse += `Alphabets: ${response.alphabets.join(', ') || "None"}\n`;
    }

    if (selectedFilters.includes('HighestLowercaseAlphabet') && response.highest_lowercase_alphabet) {
      formattedResponse += `Highest Lowercase Alphabet: ${response.highest_lowercase_alphabet.join(', ') || "None"}\n`;
    }

    return <pre>{formattedResponse.trim()}</pre>;
  };

  return (
    <div className="container">
      <h1>Enter The Data</h1>


      <textarea
        className="form-control"
        placeholder="Enter valid JSON"
        style={{ height: '100px' }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <br />


      <div>
        <label htmlFor="fileInput">Choose a file:</label>
        <input type="file" id="fileInput" onChange={handleFileChange} />
      </div>
      <br />
      <br />
      <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
      <br />
      <br />

      {error && <p className="error">{error}</p>}

      {response && (
        <div className="dropdown-container">
          <Select
            isMulti
            options={options}
            onChange={handleFilterChange}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>
      )}

      <div>{renderResponse()}</div>
    </div>
  );
};

export default App;
