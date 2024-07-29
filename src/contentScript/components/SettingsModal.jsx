import React, { useState } from "react";

const SettingsModal = ({ apiKey, onSave, onClose }) => {
  const [inputApiKey, setInputApiKey] = useState("");

  const handleSaveClick = () => {
    if (!inputApiKey.trim()) {
      alert("API key cannot be empty");
      return;
    }
    onSave(inputApiKey);
    setInputApiKey("");
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
        <h2>Settings</h2>
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

// Styles for modal
const modalStyle = {
  display: "block",
  position: "absolute",
  zIndex: 99999,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  overflow: "auto",
  backgroundColor: "rgba(0,0,0,0.4)",
};

const modalContentStyle = {
  backgroundColor: "#fefefe",
  margin: "10% auto",
  padding: "20px",
  border: "1px solid #888",
  width: "80%",
};

const closeButtonStyle = {
  color: "#aaa",
  float: "right",
  fontSize: "28px",
  fontWeight: "bold",
  cursor: "pointer",
};

const inputStyle = {
  width: "100%",
  padding: "12px 20px",
  margin: "8px 0",
  boxSizing: "border-box",
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "15px 20px",
  border: "none",
  cursor: "pointer",
};

export default SettingsModal;
