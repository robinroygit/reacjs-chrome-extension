import React, { useState } from "react";

const SettingsModal = ({ apiKey, onSave, onClose, darkMode }) => {
  const [inputApiKey, setInputApiKey] = useState("");

  const handleSaveClick = () => {
    if (!inputApiKey.trim()) {
      alert("API key cannot be empty");
      return;
    }
    onSave(inputApiKey);
    setInputApiKey("");
  };

  // Styles for modal
  const modalStyle = {
    display: "flex",
    justifyItem: "center",
    alignItem: "center",
    position: "absolute",
    zIndex: 99999,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    fontSize: "1vw",

    // backgroundColor: "rgba(0,0,0,0.4)",
  };

  const modalContentStyle = {
    backgroundColor: `${darkMode ? "gray" : "#fefefe"}`,
    color: `${darkMode ? "white" : "#36454F"}`,
    margin: "10% auto",
    padding: "1.2vw",
    border: "1px solid #888",
    width: "90%",
  };

  const closeButtonStyle = {
    color: `${darkMode ? "white" : "#36454F"}`,
    float: "right",
    fontSize: "1.1vw",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const inputStyle = {
    // backgroundColor: `${darkMode ? "gray" : "#fefefe"}`,
    // color: `${darkMode ? "white" : "#36454F"}`,
    width: "100%",
    padding: "0.7vw 0.9vw",
    margin: "8px 0",
    boxSizing: "border-box",
    fontSize: "1vw",
    border: "1px solid gray",
  };

  const buttonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "0.8vw 1.3vw",
    border: "none",
    cursor: "pointer",
    fontSize: "1vw",
  };

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content" style={modalContentStyle}>
        <span
          className="close-button"
          onClick={onClose}
          style={closeButtonStyle}
        >
          &times;
        </span>
        <label htmlFor="api-key-input">API Key:</label>
        <input
          type="text"
          required
          autoComplete="off"
          id="api-key-input"
          value={inputApiKey}
          onChange={(e) => setInputApiKey(e.target.value)}
          placeholder="Enter your API key"
          style={inputStyle}
        />
        <button onClick={handleSaveClick} style={buttonStyle}>
          Save
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
