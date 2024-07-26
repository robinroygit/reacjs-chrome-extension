import React, { useState, ChangeEvent, FocusEvent } from "react";
import { FaSearch } from "react-icons/fa";
import Papa from "papaparse";

const stockItems: string[] = [
  "INFY BSE",
  "NIFTY FUT",
  "INDEX FUND",
  "RELIANCE",
  "TATA MOTORS",
  "HDFC BANK",
  "ICICI BANK",
  // Add more stock items as needed
];

// Define the data type for parsed CSV data
interface SymbolData {
  SYMBOL: string;
}

interface SearchBarProps {
  darkMode: boolean;
}

// Function to fetch and parse CSV data
const fetchCsvData = async (): Promise<SymbolData[]> => {
  const response = await fetch("/EQUITY_L.csv"); // Update the path to your CSV file
  const text = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results: { data: SymbolData[] }) => {
        resolve(results.data as SymbolData[]);
      },
      error: (error: any) => {
        reject(error);
      },
    });
  });
};

const SearchModal: React.FC<SearchBarProps> = ({ darkMode }) => {
  console.log("djflsdjflsf", darkMode);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredStocks, setFilteredStocks] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const filtered = stockItems.filter((stock) =>
        stock.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStocks(filtered);
    } else {
      setFilteredStocks([]);
    }
  };

  const handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsInputFocused(true);
    setFilteredStocks(stockItems);
  };

  const handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    setTimeout(() => setIsInputFocused(false), 200); // Delay to allow click on stock item
  };

  return (
    <div>
      <div
        style={{
          borderBottom: `1px solid ${darkMode ? "#232325" : "#f3f4f6"}`,
        }}
        className="searchbar w-full py-1"
      >
        <div className="flex text-[14px] items-center text-[#616161] px-2 py-1 gap-2">
          <span>
            <FaSearch />
          </span>
          <input
            style={{
              width: "100%",
              backgroundColor: "transparent",
              outline: "none",
              border: "none",
            }}
            type="search"
            className="placeholder-style"
            placeholder="Search eg:infy bse,nifty fut, index fund etc"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <span
            style={{
              fontSize: "0.75rem",
              color: darkMode ? "#d1d5db" : "#6b7280",
            }}
          >
            20/100
          </span>
        </div>
      </div>
      {isInputFocused && (
        <div
          className="stock-list z-20 bg-white shadow-lg rounded-md mt-2 "
          style={{
            position: "absolute",
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 10000,
            color: "black",
            fontSize: "12px",
          }}
        >
          {filteredStocks.map((stock, index) => (
            <div
              key={index}
              className="stock-item p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                setSearchTerm(stock);
                setIsInputFocused(false);
              }}
            >
              {stock}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchModal;
