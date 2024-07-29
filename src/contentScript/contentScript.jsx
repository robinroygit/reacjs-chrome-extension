// chrome.runtime.sendMessage('I am loading content script', (response) => {
//     console.log(response);
//     console.log('I am content script')

// })

// window.onload = (event) => {
//     console.log('page is fully loaded');
// };

console.log("robin  --");

import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { AiOutlinePoweroff } from "react-icons/ai";
import { CiSettings } from "react-icons/ci";
import { FaSun, FaMoon } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import SearchModal from "./components/SearchModal";
import SettingsModal from "./components/SettingsModal";

function contentScript() {
  const draggableRef = useRef(null);
  const [darkMode, setDarkMode] = useState(true);
  const [containerVisible, setContainerVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragged, setDragged] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState("");

  const [categories, setCategories] = useState({
    category1: [],
    category2: [],
    category3: [],
    category4: [],
  });

  const [selectedCategory, setSelectedCategory] = useState("category1");

  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");

  // Load states from chrome.storage.local
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

  // Update darkMode state in chrome.storage.local and broadcast change
  const updateDarkMode = (mode) => {
    setDarkMode(mode);
    chrome.storage.local.set({ darkMode: mode });
    chrome.runtime.sendMessage({
      type: "STATE_CHANGED",
      state: { darkMode: mode },
    });
  };

  // Update containerVisible state in chrome.storage.local and broadcast change
  const updateContainerVisible = (visible) => {
    setContainerVisible(visible);
    chrome.storage.local.set({ containerVisible: visible });
    chrome.runtime.sendMessage({
      type: "STATE_CHANGED",
      state: { containerVisible: visible },
    });
  };

  // Update position state in chrome.storage.local and broadcast change
  const updatePosition = (pos) => {
    setPosition(pos);
    chrome.storage.local.set({ position: pos });
    chrome.runtime.sendMessage({
      type: "STATE_CHANGED",
      state: { position: pos },
    });
  };

  // Update categories state in chrome.storage.local and broadcast change
  const updateCategories = (cats) => {
    setCategories(cats);
    chrome.storage.local.set({ categories: cats });
    chrome.runtime.sendMessage({
      type: "STATE_CHANGED",
      state: { categories: cats },
    });
  };

  // Update selectedCategory state in chrome.storage.local and broadcast change
  const updateSelectedCategory = (category) => {
    setSelectedCategory(category);
    chrome.storage.local.set({ selectedCategory: category });
    chrome.runtime.sendMessage({
      type: "STATE_CHANGED",
      state: { selectedCategory: category },
    });
  };

  // Listen for state changes from other tabs
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
          setApiKey(message.state.setApiKey);
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
    setDragged(false); // Reset dragged state
    document.body.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newPos = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    };

    updatePosition(newPos);
    setDragged(true); // Set dragged state
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = "default";
  };

  const isContainerVisible = (e) => {
    if (dragged) {
      e.preventDefault(); // Prevent click if dragged
      return;
    }

    // Toggle container visibility
    const newVisibility = !containerVisible;
    updateContainerVisible(newVisibility);

    // console.log("Button clicked, containerVisible:", newVisibility);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset]);

  //-------------------------

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
    return () => {
      // Cleanup code if necessary
    };
  }, [containerVisible]);

  const divStyle = {
    position: "fixed",
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 999999,
    color: "white",
    fontWeight: "bold",
    borderRadius: "8px",
    width: containerVisible ? "30vh" : "unset",
    height: containerVisible ? "75vh" : "unset",
  };

  const handleSelectSymbol = (symbol, category) => {
    const newCategories = { ...categories };
    if (!newCategories[category].includes(symbol)) {
      newCategories[category] = [...newCategories[category], symbol];
    }
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
        }}
        className="flex items-start justify-start "
      >
        <button
          style={{
            border: "1px solid",
            borderColor: "#e2e8f0",
            padding: "2px 8px",
            borderRadius: "0.375rem",
            backgroundColor: "#48bb78",
            fontSize: "20px",
          }}
          onClick={isContainerVisible}
        >
          <AiOutlinePoweroff />
        </button>
      </div>

      {containerVisible && (
        <div
          style={{
            position: "relative",
            backgroundColor: darkMode ? "#181818" : "#fff",
            width: "100%",
          }}
          className="    "
        >
          <div
            className=""
            style={{
              fontSize: "10px",
              color: darkMode ? "white" : "black",
              height: "40px",
              padding: "0px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontSize: "12px" }}>Kite Watchlist</h3>
            <span
              onClick={() => updateDarkMode(!darkMode)}
              className=""
              style={{ fontWeight: "700", cursor: "pointer", padding: "4px" }}
            >
              {darkMode ? <FaMoon /> : <FaSun />}
            </span>
          </div>

          {/* TESING  */}
          {/* <kite-button
            href="#"
            data-kite=""
            data-exchange="NSE"
            data-tradingsymbol="SBIN"
            data-transaction_type="BUY"
            data-quantity="1"
            data-order_type="MARKET"
          >
            Buy SBI stock
          </kite-button>
          <div>{apiKey}</div> */}

          {/* search bar ☻🎾 */}
          <SearchModal
            darkMode={darkMode}
            selectedCategory={selectedCategory}
            onSelectSymbol={handleSelectSymbol}
            noOfSymbol={categories[selectedCategory].length}
          />

          <div
            style={{
              position: "relative",
              height: "30vh",
              overflow: "scroll",
              zIndex: 10,
              scrollbarWidth: "none",
            }}
            className="all-symbols "
          >
            <div>
              <table
                style={{
                  fontSize: "14px",
                  width: "100%",
                  textAlign: "left",
                  color: darkMode ? "#9ca3af" : "#6b7280",
                }}
              >
                <thead className="">
                  <tr>
                    <th className="px-2 py-1"></th>
                    <th className="px-2 py-1 dark:text-gray-500 text-gray-400"></th>
                    <th className="px-2 py-1 dark:text-gray-500 text-gray-400"></th>
                    <th className="px-2 py-1"></th>
                    <th className="px-2 py-1"></th>
                    <th className="px-2 py-1"></th>
                    <th className="px-2 py-1"></th>
                  </tr>
                </thead>
                <tbody style={{ cursor: "default" }}>
                  {categories[selectedCategory].length > 0 ? (
                    categories[selectedCategory].map((symbol, index) => (
                      <tr
                        key={index}
                        style={{
                          fontSize: "12px",
                          lineHeight: "20px",
                          // color: symbol ? "#5b9a5d" : "#e25f5b",
                          borderBottom: `1px solid ${
                            darkMode ? "#232325" : "#f3f4f6"
                          }`,
                        }}
                        onMouseEnter={() => {
                          setHoveredIndex(index);
                          // handleSelectSymbol2(symbol);
                        }}
                        onMouseLeave={() => {
                          setHoveredIndex(null);
                          // handleSelectSymbol2(null);
                        }}
                      >
                        <td
                          style={{ padding: "4px 8px", color: "#5b9a5d" }}
                          className=" "
                        >
                          {symbol}
                        </td>
                        <td style={{ padding: "4px 8px" }}></td>
                        <td style={{ padding: "4px 8px" }}></td>
                        <td style={{ padding: "4px 8px" }}></td>
                        {/* <td style={{ padding: "4px 8px" }}></td> */}
                        {/* <td style={{ padding: "4px 8px" }}></td> */}

                        {/* {hoveredIndex === index && ( */}
                        {true && (
                          <td
                            style={{
                              cursor: "pointer",
                              border: "1px solid re",
                              // position:  "absolute",
                              // right: "10px",
                              gap: "3px",
                              color: "red",
                              display: `${
                                hoveredIndex === index ? "flex" : "none"
                              }`,
                              justifyItems: "center",
                              alignItems: "center",
                            }}
                          >
                            <button
                              style={{
                                color: "red",
                                backgroundColor: "#4987ee",
                                padding: "1px 10px",
                                borderRadius: "3px",
                              }}
                              id="#buy-button"
                              data-kite={apiKey}
                              data-exchange="NSE"
                              data-tradingsymbol={symbol}
                              data-transaction_type="BUY"
                              data-quantity="1"
                              data-order_type="MARKET"
                            >
                              B
                            </button>
                            <button
                              style={{
                                color: "white",
                                backgroundColor: "#d4603b",
                                padding: "1px 10px",
                                borderRadius: "3px",
                              }}
                              data-kite={apiKey}
                              data-exchange="NSE"
                              data-tradingsymbol={symbol}
                              data-transaction_type="SELL"
                              data-quantity="1"
                              data-order_type="MARKET"
                            >
                              S
                            </button>
                            <span
                              style={{
                                padding: "1px 1px",
                                marginLeft: "1px",
                                border: "1px solid re",
                                fontSize: "20px",
                                color: darkMode ? "white" : "black",
                              }}
                            >
                              <IoIosClose
                                onClick={() =>
                                  handleRemoveSymbol(symbol, selectedCategory)
                                }
                              />
                            </span>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr className="">
                        <td colSpan={20} className="text-center ">
                          <span style={{ fontSize: "14px" }}>Nothing here</span>
                        </td>
                      </tr>
                      <tr className="">
                        <td colSpan={20} className="text-center   ">
                          <span style={{ fontSize: "10px" }}>
                            Use the search bar to add symbols.
                          </span>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ borderTop: "1px solid gray" }}>
            <div
              style={{
                borderColor: ` ${darkMode ? "#232325" : "#f3f4f6"}`,
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly",
                borderWidth: "1px",
                alignItems: "center",
                cursor: "pointer",
                color: darkMode ? "#9ca3af" : "#4a5568",
                borderLeftWidth: "1px",
                borderRightWidth: "1px",
                fontSize: "16px",
                fontWeight: "200",
              }}
              className=""
            >
              <div
                onClick={() => handleCategoryChange("category1")}
                style={{
                  color: getTextColor("category1"),
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                1
              </div>

              <div
                onClick={() => handleCategoryChange("category2")}
                style={{
                  color: getTextColor("category2"),
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                2
              </div>

              <div
                onClick={() => handleCategoryChange("category3")}
                style={{
                  color: getTextColor("category3"),
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                3
              </div>

              <div
                onClick={() => handleCategoryChange("category4")}
                style={{
                  color: getTextColor("category4"),
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                4
              </div>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setIsOpenSettings(true)}
              >
                <CiSettings />
              </div>
            </div>

            {isOpenSettings && (
              <SettingsModal
                apiKey={apiKey}
                onSave={handleSaveApiKey}
                onClose={() => setIsOpenSettings(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default contentScript;
