import React from "react";
import { FaSearch } from "react-icons/fa";
import { useAppContext } from "../contextApi/AppContext";

// import { NseIndia } from "stock-nse-india";

// RegExp.escape = function (string) {
//   return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// };

const SearchModal = ({
  // darkMode,
  // onSelectSymbol,
  noOfSymbol,
  // selectedCategory,
}) => {
  const {
    searchSymbols,
    fetchCsvData,
    darkMode,
    handleInputFocus,
    handleInputBlur,
    // onSelectSymbol,
    // noOfSymbol,
    selectedCategory,
    searchTerm,
    setSearchTerm,
    isInputFocused,
    filteredSymbols,
    handleSymbolClick,
    setIsInputFocused,
  } = useAppContext();

  return (
    <div className="">
      {/* top part  */}
      <div
        style={{
          borderBottomWidth: "3px",
          borderColor: `${darkMode ? "#232325" : "#f3f4f6"}`,
          width: "100%",
          padding: "0px 8px",
          paddingTop: "4px",
          paddingBottom: "4px",
        }}
        // className="searchbar w-full py-1"
      >
        <div
          style={{
            display: "flex",
            fontSize: "0.9vw",
            alignItems: "center",
            color: "#616161",
            padding: "0.8vh 0.6vh 0.6vh 0.6vh",
            gap: "0.8vw",
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
              fontSize: "1vw",
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
              fontSize: "0.8vw",
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
              width: "95%",
              maxHeight: "200px",
              overflowY: "auto",
              paddingLeft: "10px",
              zIndex: 9999,
              position: "absolute",
              marginTop: "4px",
            }}
            // className="  bg-[#181818] z-50 shadow-lg rounded-md mt-1 absolute my-zindex"
          >
            {/* //symbol list  */}
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
