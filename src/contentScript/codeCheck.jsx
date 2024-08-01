import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { AiOutlinePoweroff } from "react-icons/ai";
import { CiSettings } from "react-icons/ci";
import { FaMoon } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { IoSunnyOutline } from "react-icons/io5";

import SearchModal from "./components/SearchModal";
import SettingsModal from "./components/SettingsModal";
import { useAppContext } from "./contextApi/AppContext";

function contentScript() {
  const { selectedSymbol, setSelectedSymbol } = useAppContext();
  const draggableRef = useRef(null);
  const [darkMode, setDarkMode] = useState(true);
  const [containerVisible, setContainerVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragged, setDragged] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [categories, setCategories] = useState({
    category1: [],
    category2: [],
    category3: [],
    category4: [],
  });

  const [selectedCategory, setSelectedCategory] = useState("category1");

  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    chrome.storage.local.get(
      [
        "darkMode",
        "containerVisible",
        "position",
        "categories",
        "selectedCategory",
        "apiKey",
        "selectedSymbol",
      ],
      (result) => {
        if (result.darkMode !== undefined) {
          setDarkMode(result.darkMode);
        }
        if (result.containerVisible !== undefined) {
          setContainerVisible(result.containerVisible);
        }
        if (result.position !== undefined) {
          setPosition(result.position);
        }
        if (result.categories !== undefined) {
          setCategories(result.categories);
        }
        if (result.selectedCategory !== undefined) {
          setSelectedCategory(result.selectedCategory);
        }
        if (result.apiKey) {
          setApiKey(result.apiKey);
        }
        if (result.selectedSymbol) {
          setSelectedSymbol(result.selectedSymbol);
        }
      }
    );
  }, []);

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    chrome.storage.local.set({ apiKey: key }, () => {
      alert("API key saved successfully!");
    });
    chrome.runtime.sendMessage({
      type: "STATE_CHANGED",
      state: { apiKey: key },
    });
    setIsOpenSettings(false);
  };

  const handleSelectSymbol2 = (symbol) => {
    setSelectedSymbol(symbol);
    chrome.storage.local.set({ selectedSymbol: symbol });
    chrome.runtime.sendMessage({
      type: "STATE_CHANGED",
      state: { selectedSymbol: symbol },
    });
  };

  const updateDarkMode = (mode) => {
    setDarkMode(mode);
    chrome.storage.local.set({ darkMode: mode });
    chrome.runtime.sendMessage({
      type: "STATE_CHANGED",
      state: { darkMode: mode },
    });
  };

  const updateContainerVisible = (visible) => {
    setContainerVisible(visible);
    chrome.storage.local.set({ containerVisible: visible });
    chrome.runtime.sendMessage({
      type: "STATE_CHANGED",
      state: { containerVisible: visible },
    });
  };

  const updatePosition = (pos) => {
    setPosition(pos);
    chrome.storage.local.set({ position: pos });
    chrome.runtime.sendMessage({
      type: "STATE_CHANGED",
      state: { position: pos },
    });
  };

  const updateCategories = (cats) => {
    setCategories(cats);
    chrome.storage.local.set({ categories: cats });
    chrome.runtime.sendMessage({
      type: "STATE_CHANGED",
      state: { categories: cats },
    });
  };

  const updateSelectedCategory = (category) => {
    setSelectedCategory(category);
    chrome.storage.local.set({ selectedCategory: category });
    chrome.runtime.sendMessage({
      type: "STATE_CHANGED",
      state: { selectedCategory: category },
    });
  };

  useEffect(() => {
    const handleMessage = (message) => {
      if (message.type === "STATE_CHANGED") {
        if (message.state.darkMode !== undefined) {
          setDarkMode(message.state.darkMode);
        }
        if (message.state.containerVisible !== undefined) {
          setContainerVisible(message.state.containerVisible);
        }
        if (message.state.position !== undefined) {
          setPosition(message.state.position);
        }
        if (message.state.categories !== undefined) {
          setCategories(message.state.categories);
        }
        if (message.state.selectedCategory !== undefined) {
          setSelectedCategory(message.state.selectedCategory);
        }
        if (message.state.apiKey !== undefined) {
          setApiKey(message.state.apiKey);
        }
        if (message.state.selectedSymbol !== undefined) {
          setSelectedSymbol(message.state.selectedSymbol);
        }
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const handleMouseDown = (e) => {
    if (draggableRef.current) {
      const rect = draggableRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setIsDragging(true);
    setDragged(false);
    document.body.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newPos = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    };

    updatePosition(newPos);
    setDragged(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = "default";
  };

  const isContainerVisible = (e) => {
    if (dragged) {
      e.preventDefault();
      return;
    }

    const newVisibility = !containerVisible;
    updateContainerVisible(newVisibility);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset]);

  useEffect(() => {
    const container = document.getElementById("robin-root");
    if (container) {
      if (!containerVisible) {
        container.style.height = "4vh";
        container.style.width = "18rem";
      } else {
        container.style.height = "50vh";
        container.style.width = "18rem";
      }
    }
    return () => {};
  }, [containerVisible]);

  const divStyle = {
    position: "fixed",
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 999999,
    color: "white",
    fontWeight: "bold",
    borderRadius: "50%",
    width: containerVisible ? "17vw" : "unset",
    height: containerVisible ? "75vh" : "unset",
  };

  const handleSelectSymbol = (symbol, category) => {
    const newCategories = { ...categories };
    if (!newCategories[category].includes(symbol)) {
      newCategories[category] = [...newCategories[category], symbol];
    }

    handleSelectSymbol2(symbol);

    updateCategories(newCategories);
  };

  const handleRemoveSymbol = (symbol, category) => {
    const newCategories = { ...categories };
    newCategories[category] = newCategories[category].filter(
      (s) => s !== symbol
    );
    updateCategories(newCategories);
  };

  const handleCategoryChange = (category) => {
    updateSelectedCategory(category);
  };

  const getTextColor = (category) => {
    if (darkMode) {
      return selectedCategory === category ? "#e25f5b" : "white";
    } else {
      return selectedCategory === category ? "#e25f5b" : "black";
    }
  };

  return (
    <div ref={draggableRef} style={divStyle}>
      <div
        onMouseDown={handleMouseDown}
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "flex-start",
          fontSize: "1.5vw",
        }}
      >
        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid",
            borderColor: "#e2e8f0",
            padding: "1vh 1vw",
            marginRight: "auto",
            marginLeft: "0.1vw",
            borderRadius: "1.5vw",
            color: "#e25f5b",
            cursor: "pointer",
            backgroundColor: darkMode ? "#2d3748" : "#edf2f7",
            transition: "all 0.2s ease-in-out",
          }}
          onClick={isContainerVisible}
        >
          {containerVisible ? (
            <AiOutlinePoweroff size={24} />
          ) : (
            <FaSearch size={24} />
          )}
        </button>
        {darkMode ? (
          <IoSunnyOutline
            size={30}
            onClick={() => updateDarkMode(!darkMode)}
            style={{
              color: "white",
              cursor: "pointer",
              padding: "0.25vh 0.25vw",
              marginRight: "auto",
            }}
          />
        ) : (
          <FaMoon
            size={30}
            onClick={() => updateDarkMode(!darkMode)}
            style={{
              color: "#2d3748",
              cursor: "pointer",
              padding: "0.25vh 0.25vw",
              marginRight: "auto",
            }}
          />
        )}
        <div
          onClick={() => setIsOpenSettings(true)}
          style={{
            marginRight: "0.1vw",
            color: darkMode ? "white" : "black",
            cursor: "pointer",
            padding: "0.25vh 0.25vw",
          }}
        >
          <CiSettings size={30} />
        </div>
        <IoIosClose
          size={40}
          onClick={isContainerVisible}
          style={{
            color: darkMode ? "white" : "black",
            cursor: "pointer",
            padding: "0.25vh 0.25vw",
            marginRight: "0.1vw",
          }}
        />
      </div>
      {containerVisible && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "17vw",
            height: "75vh",
            padding: "1vh 1vw",
            backgroundColor: darkMode ? "#2d3748" : "white",
            borderRadius: "0.75vw",
            boxShadow: "0 0.5vw 1vw rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ display: "flex", marginBottom: "1vh" }}>
            {Object.keys(categories).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                style={{
                  color: getTextColor(category),
                  fontWeight: selectedCategory === category ? "bold" : "normal",
                  margin: "0 1vw",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {category}
              </button>
            ))}
          </div>
          <div
            style={{
              flex: 1,
              width: "100%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {categories[selectedCategory].map((symbol, index) => (
              <div
                key={symbol}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "0.5vh 0.5vw",
                  backgroundColor:
                    hoveredIndex === index
                      ? darkMode
                        ? "#4a5568"
                        : "#edf2f7"
                      : "transparent",
                  borderRadius: "0.5vw",
                  marginBottom: "0.5vh",
                  cursor: "pointer",
                }}
              >
                <div
                  onClick={() => handleRemoveSymbol(symbol, selectedCategory)}
                  style={{ marginRight: "1vw" }}
                >
                  {symbol}
                </div>
                <button
                  onClick={() => placeOrder(symbol)}
                  style={{
                    color: darkMode ? "white" : "black",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Kite
                </button>
              </div>
            ))}
          </div>
          <SearchModal
            handleSelectSymbol={(symbol) =>
              handleSelectSymbol(symbol, selectedCategory)
            }
          />
          <SettingsModal
            isOpen={isOpenSettings}
            onRequestClose={() => setIsOpenSettings(false)}
            apiKey={apiKey}
            handleSaveApiKey={handleSaveApiKey}
          />
        </div>
      )}
    </div>
  );
}

export default contentScript;
