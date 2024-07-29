import React, { useCallback, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Papa from "papaparse";

// import { NseIndia } from "stock-nse-india";

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

// RegExp.escape = function (string) {
//   return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// };

const SearchModal = ({
  darkMode,
  onSelectSymbol,
  noOfSymbol,
  selectedCategory,
}) => {
  const [filteredSymbols, setFilteredSymbols] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

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
    if (onSelectSymbol) {
      onSelectSymbol(symbol, category);
    }
  };

  return (
    <div className="">
      {/* top part  */}
      <div
        style={{
          borderBottomWidth: "3px",
          borderColor: `${darkMode ? "#232325" : "#f3f4f6"}`,
          width: "100%",
          paddingTop: "4px",
          paddingBottom: "4px",
        }}
        // className="searchbar w-full py-1"
      >
        <div
          style={{
            display: "flex",
            fontSize: "14px",
            alignItems: "center",
            color: "#616161",
            padding: "8px 4px 8px 4px",
            gap: "8px",
          }}
          // className="flex text-[14px] items-center text-[#616161] px-2 py-1 gap-2"
        >
          <span>
            <FaSearch />
          </span>
          <input
            style={{
              width: "100%",
              backgroundColor: "transparent",
              outline: "none",
              border: "none",
              fontSize: "0.75rem",
              color: darkMode ? "#d1d5db" : "#6b7280",
              zIndex: 9999,
            }}
            type="text"
            className="placeholder-style"
            placeholder="Search eg:infy bse,nifty fut, index fund etc"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <span
            style={{
              fontSize: "0.75rem",
              color: darkMode ? "#d1d5db" : "#6b7280",
              zIndex: 10000,
            }}
          >
            {noOfSymbol}/10
          </span>
        </div>
      </div>

      {/* bottom part  */}

      {isInputFocused && (
        <div>
          <ul
            style={{
              backgroundColor: `${darkMode ? "#181818" : "white"}`,
              color: `${darkMode ? "white" : "#181818"}`,
              width: "100%",
              maxHeight: "200px",
              overflowY: "auto",
              paddingLeft: "10px",
              zIndex: 9999,
              position: "absolute",
              marginTop: "4px",
            }}
            // className="  bg-[#181818] z-50 shadow-lg rounded-md mt-1 absolute my-zindex"
          >
            {filteredSymbols.map((symbol, index) => (
              <li
                key={index}
                style={{ fontSize: "12px", lineHeight: "20px" }}
                onClick={() => {
                  setSearchTerm("");
                  handleSymbolClick(symbol);
                  setIsInputFocused(false);
                }}
              >
                {symbol}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchModal;
