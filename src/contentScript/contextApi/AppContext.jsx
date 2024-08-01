// src/AppContext.js

import Papa from "papaparse";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Create a context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const draggableRef = useRef(null);
  const [containerVisible, setContainerVisible] = useState(false);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [crossXScreen, setCrossXScreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({
    x: 0,
    y: 0,
  });
  const [rel, setRel] = useState(null);
  const [dragged, setDragged] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("category1");
  const [categories, setCategories] = useState({
    category1: [],
    category2: [],
    category3: [],
    category4: [],
  });

  const [filteredSymbols, setFilteredSymbols] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  // Function to fetch and parse CSV data
  const fetchCsvData = async () => {
    const url = chrome.runtime.getURL("EQUITY_L.csv");
    const response = await fetch(url); // Update the path to your CSV file
    const text = await response.text();
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }

  function searchSymbols(data, searchText) {
    if (!searchText || searchText.length < 2) return [];

    // const terms = searchText.split(/\s+/).filter(Boolean).map(term => RegExp.escape(term));
    const terms = searchText
      .split(/\s+/)
      .filter(Boolean)
      .map((term) => escapeRegExp(term));

    const pattern = new RegExp(`\\b(${terms.join("|")})`, "i");

    const results = data
      .map((item) => ({
        TradingSymbol: item.SYMBOL,
        matchCount: (item.SYMBOL.match(pattern) || []).length,
      }))
      .filter((item) => item.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 15)
      .map((item) => item.TradingSymbol);

    return results;
  }

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
      const box = e.target.getBoundingClientRect();
      setIsDragging(true);
      setRel({
        x: box.width - (e.pageX - box.left - 5),
        y: box.height - (e.pageY - box.top + 30),
      });
    }
    setIsDragging(true);
    setDragged(false); // Reset dragged state
    document.body.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const element = document.getElementById("draggable-element"); // Make sure to replace 'draggable-element' with the actual ID of your element
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    const width = window.innerWidth;
    const height = window.innerHeight;
    // setPosition({
    //   x: width - e.pageX - rel.x,
    //   y: height - e.pageY - rel.y,
    // });
    const newPos = {
      x: width - e.pageX - rel.x,
      y: height - e.pageY - rel.y,
    };

    // // Constrain newPos within the viewport boundaries
    if (newPos.x < 0) newPos.x = 0;
    if (newPos.y < 0) newPos.y = 0;

    if (newPos.x + elementWidth > width) {
      newPos.x = width - elementWidth;
    }
    if (newPos.y + elementHeight > height) {
      newPos.y = height - elementHeight;
    }

    updatePosition(newPos);
    setDragged(true);
  };

  const handleMouseMove2 = (e) => {
    if (!isDragging) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const element = document.getElementById("draggable-element"); // Make sure to replace 'draggable-element' with the actual ID of your element
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    const newPos = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    };

    console.log("---", newPos);

    // // Constrain newPos within the viewport boundaries
    // if (newPos.x < 0) newPos.x = 0;
    // if (newPos.y < 0) newPos.y = 0;

    // if (newPos.x + elementWidth > viewportWidth) {
    //   newPos.x = viewportWidth - elementWidth;
    // }
    // if (newPos.y + elementHeight > viewportHeight) {
    //   newPos.y = viewportHeight - elementHeight;
    // }

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
        container.style.height = "2vh";
        container.style.width = "2vw";
      } else {
        container.style.height = "2vh";
        container.style.width = "18vw";
      }
    }
    return () => {
      // Cleanup code if necessary
    };
  }, [containerVisible]);

  const divStyle = {
    position: "fixed",
    right: `${position.x}px`,
    bottom: `${position.y}px`,
    zIndex: 999999,
    color: "white",
    fontWeight: "bold",
    // width: containerVisible ? "18vw" : "4vw",
    // height: containerVisible ? "47vh" : "4vh",
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

  //--------------------------------------------

  useEffect(() => {
    fetchCsvData()
      .then((parsedData) => {
        setData(parsedData);
      })
      .catch((error) => {
        console.error("Error fetching CSV data:", error);
      });
  }, []);

  //filtered symbol
  useEffect(() => {
    if (data.length > 0) {
      setFilteredSymbols(searchSymbols(data, searchTerm));
    }
  }, [searchTerm, data]);

  const handleInputFocus = () => {
    setIsInputFocused(true);
    // setFilteredStocks(stockItems);
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsInputFocused(false), 200); // Delay to allow click on stock item
  };

  // const handleSymbolClick = (symbol) => {
  //     if (onSelectSymbol) {
  //         onSelectSymbol(symbol);
  //     }
  // };

  const handleSymbolClick = (symbol) => {
    const category = selectedCategory; // Example category
    if (handleSelectSymbol) {
      handleSelectSymbol(symbol, category);
    }
    // window.location.reload();
  };

  const handleSelectSymbol = (symbol, category) => {
    const newCategories = { ...categories };
    if (!newCategories[category].includes(symbol)) {
      newCategories[category] = [...newCategories[category], symbol];
    }

    handleSelectSymbol2(symbol);

    updateCategories(newCategories);
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        setDarkMode,
        setSelectedSymbol,
        selectedSymbol,
        fetchCsvData,
        searchSymbols,
        searchTerm,
        setSearchTerm,
        isInputFocused,
        filteredSymbols,
        handleSymbolClick,
        setIsInputFocused,
        selectedCategory,
        setSelectedCategory,
        handleSelectSymbol,
        categories,
        setCategories,
        draggableRef,
        divStyle,
        handleMouseDown,
        isContainerVisible,
        containerVisible,
        updateDarkMode,
        setHoveredIndex,
        apiKey,
        handleRemoveSymbol,
        handleCategoryChange,
        isOpenSettings,
        handleSaveApiKey,
        setIsOpenSettings,
        getTextColor,
        handleInputFocus,
        handleInputBlur,
        hoveredIndex,
        crossXScreen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
