import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePoweroff } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import SearchModal from "./components/SearchModal";

function contentScript() {
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

  // Load states from chrome.storage.local
  useEffect(() => {
    chrome.storage.local.get(
      ["darkMode", "containerVisible", "position", "categories"],
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
      }
    );
  }, []);

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
    // Handle button click logic here
    updateContainerVisible((prev) => !prev);
    console.log("Button clicked!");
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
    setSelectedCategory(category);
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
                  fontWeight: "200",
                  color: darkMode ? "white" : "black",
                  width: "100%",
                  tableLayout: "fixed",
                }}
                className=""
              >
                <tbody>
                  {categories[selectedCategory].length ? (
                    categories[selectedCategory].map((symbol, index) => (
                      <tr
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="hover:bg-slate-700"
                        style={{ cursor: "pointer" }}
                      >
                        <td
                          style={{
                            padding: "4px 8px",
                            color:
                              hoveredIndex === index
                                ? "black"
                                : darkMode
                                ? "white"
                                : "black",
                            backgroundColor:
                              hoveredIndex === index
                                ? "#e2e8f0"
                                : "transparent",
                            borderRadius:
                              hoveredIndex === index ? "6px" : "9a5d",
                          }}
                          className=" "
                        >
                          {symbol}
                        </td>
                        <td style={{ padding: "4px 8px" }}></td>
                        <td style={{ padding: "4px 8px" }}></td>
                        <td style={{ padding: "4px 8px" }}></td>
                        <td style={{ padding: "4px 8px" }}></td>
                        <td style={{ padding: "4px 8px" }}></td>
                        {hoveredIndex === index && (
                          <td
                            style={{
                              cursor: "pointer",
                              border: "1px solid re",
                              position: "absolute",
                              right: "10px",
                              gap: "6px",
                              color: "white",
                              display: "flex",
                              justifyItems: "center",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                color: "white",
                                backgroundColor: "#4987ee",
                                padding: "1px 16px",
                                borderRadius: "3px",
                              }}
                            >
                              B
                            </span>
                            <span
                              style={{
                                color: "white",
                                backgroundColor: "#d4603b",
                                padding: "1px 16px",
                                borderRadius: "3px",
                              }}
                            >
                              S
                            </span>
                            <span
                              style={{
                                padding: "1px 1px",
                                marginLeft: "1px",
                                border: "1px solid re",
                                fontSize: "20px",
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default contentScript;
