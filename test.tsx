// chrome.runtime.sendMessage('I am loading content script', (response) => {
//     console.log(response);
//     console.log('I am content script')

// })

// window.onload = (event) => {
//     console.log('page is fully loaded');
// };

import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { AiOutlinePoweroff } from "react-icons/ai";
import { CiSettings } from "react-icons/ci";
import { FaSun, FaMoon } from "react-icons/fa";
import SearchModal from "./components/searchModal";

// Define the type for the data items
interface DataItem {
  symbol: string;
  change: string;
  percent: string;
  up: boolean;
  price: string;
}

const data: DataItem[] = [
  {
    symbol: "AAPL",
    change: "+1.23",
    percent: "0.56%",
    up: true,
    price: "150.00",
  },
  {
    symbol: "GOOGL",
    change: "-0.67",
    percent: "0.23%",
    up: false,
    price: "2800.00",
  },
  {
    symbol: "AMZN",
    change: "+3.12",
    percent: "1.05%",
    up: true,
    price: "3400.00",
  },
  {
    symbol: "MSFT",
    change: "-0.45",
    percent: "0.15%",
    up: false,
    price: "299.00",
  },
  {
    symbol: "TSLA",
    change: "+5.67",
    percent: "2.45%",
    up: true,
    price: "700.00",
  },
  {
    symbol: "FB",
    change: "-1.23",
    percent: "0.75%",
    up: false,
    price: "360.00",
  },
  {
    symbol: "NFLX",
    change: "+2.34",
    percent: "1.34%",
    up: true,
    price: "540.00",
  },
  {
    symbol: "NVDA",
    change: "-0.89",
    percent: "0.42%",
    up: false,
    price: "195.00",
  },
  {
    symbol: "INTC",
    change: "+0.56",
    percent: "0.29%",
    up: true,
    price: "56.00",
  },
  {
    symbol: "AMD",
    change: "-1.78",
    percent: "0.94%",
    up: false,
    price: "102.00",
  },
  {
    symbol: "BABA",
    change: "+2.45",
    percent: "1.25%",
    up: true,
    price: "225.00",
  },
  {
    symbol: "DIS",
    change: "-0.34",
    percent: "0.16%",
    up: false,
    price: "178.00",
  },
  {
    symbol: "PYPL",
    change: "+1.89",
    percent: "1.03%",
    up: true,
    price: "290.00",
  },
  {
    symbol: "ADBE",
    change: "-0.67",
    percent: "0.27%",
    up: false,
    price: "575.00",
  },
  {
    symbol: "CSCO",
    change: "+0.98",
    percent: "0.45%",
    up: true,
    price: "54.00",
  },
  {
    symbol: "ORCL",
    change: "-1.23",
    percent: "0.53%",
    up: false,
    price: "88.00",
  },
  {
    symbol: "SAP",
    change: "+0.76",
    percent: "0.32%",
    up: true,
    price: "141.00",
  },
  {
    symbol: "CRM",
    change: "-0.89",
    percent: "0.38%",
    up: false,
    price: "245.00",
  },
  {
    symbol: "IBM",
    change: "+1.45",
    percent: "0.65%",
    up: true,
    price: "143.00",
  },
  {
    symbol: "TXN",
    change: "-0.56",
    percent: "0.28%",
    up: false,
    price: "195.00",
  },
];

const contentScript: React.FC = () => {
  //draggable component function
  const draggableRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragged, setDragged] = useState(false);

  const handleMouseDown = (e: MouseEvent) => {
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

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
    setDragged(true); // Set dragged state
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = "default";
  };

  const isContainerVisible = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (dragged) {
      e.preventDefault(); // Prevent click if dragged
      return;
    }
    // Handle button click logic here
    setContainerVisible((prev) => !prev);
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

  //-------------------------

  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [containerVisible, setContainerVisible] = useState<boolean>(false);
  const [ClickBuyOrSell, setClickBuyOrSell] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const endIndex = currentPage * itemsPerPage;
  const startIndex = endIndex - itemsPerPage;

  const displayedData = data.length > 0 ? data.slice(startIndex, endIndex) : [];
  const totalPages =
    data.length > 0 ? Math.ceil(data.length / itemsPerPage) : 0;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  //   const isContainerVisible = () => {

  //     setContainerVisible((prev) => !prev);
  //   };

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

  // buy and sell action

  const handleAction = (index, actionType) => {
    setClickBuyOrSell(() => ({
      [index]: {
        ...displayedData[index],
        action: actionType,
      },
    }));
  };

  console.log(ClickBuyOrSell);

  const divStyle: React.CSSProperties = {
    position: "fixed",
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: "2000000",
    color: "white",
    fontWeight: "bold",
    borderRadius: "8px",
    width: containerVisible ? "300px" : "unset",
    height: containerVisible ? "75vh" : "unset",
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
        className="flex items-start justify-start"
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
            backgroundColor: darkMode ? "#181818" : "#fff",
            width: "100%",
          }}
          className="    "
        >
          <div
            style={{
              fontSize: "10px",
              color: darkMode ? "white" : "black",
              height: "40px",
              padding: "0px 16px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
            onClick={() => setDarkMode((prev) => !prev)}
          >
            <span style={{ fontWeight: "700", cursor: "pointer" }}>
              {darkMode ? <FaMoon /> : <FaSun />}
            </span>
          </div>
          <div
            style={{
              fontSize: "12.5px",
              textAlign: "center",
              color: darkMode ? "#d1d5db" : "#4a5568",
            }}
          >
            <h1 className=" font-bold ">Kite Watchlist</h1>
            <p style={{ fontSize: "8" }}>Track your stocks here!</p>
          </div>

          <SearchModal darkMode={darkMode} />

          {/* 
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
                // onFocus={(e) => {
                //     e.target.style.outline = 'none';
                //     e.target.style.border = 'none';
                //   }}
                style={{
                  width: "100%",
                  backgroundColor: "transparent",
                  outline: "none",
                  border: "none",
                }}
                type="search"
                className="placeholder-style "
                placeholder="Search eg:infy bse,nifty fut, index fund etc"
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
          </div> */}

          <div
            style={{
              position: "relative",
              height: "50vh",
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
                  {displayedData.length < 0 ? (
                    displayedData.map((item, index) => (
                      <tr
                        key={index}
                        style={{
                          fontSize: "12px",
                          lineHeight: "20px",
                          color: item.up ? "#5b9a5d" : "#e25f5b",
                          borderBottom: `1px solid ${
                            darkMode ? "#232325" : "#f3f4f6"
                          }`,
                        }}
                        className={`   ${
                          darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                        } `}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <td style={{ padding: "4px 8px" }} className=" ">
                          {item.symbol}
                        </td>
                        <td style={{ padding: "4px 8px" }}></td>
                        <td style={{ padding: "4px 8px" }}></td>
                        <td style={{ padding: "4px 8px" }}></td>
                        <td style={{ padding: "4px 8px" }}>{item.change}</td>
                        <td style={{ padding: "4px 8px" }}>{item.percent}</td>
                        <td style={{ padding: "4px 8px" }}>
                          {item.up ? "u" : "d"}
                        </td>
                        <td style={{ padding: "4px 8px" }}>{item.price}</td>

                        {hoveredIndex === index && (
                          <td
                            style={{
                              position: "absolute",
                              right: "10px",
                              gap: "4px",
                              color: "white",
                              display: "flex",
                            }}
                          >
                            <span
                              onClick={() => handleAction(index, "Buy")}
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
                              onClick={() => handleAction(index, "Sell")}
                              style={{
                                color: "white",
                                backgroundColor: "#d4603b",
                                padding: "1px 16px",
                                borderRadius: "3px",
                              }}
                            >
                              S
                            </span>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center py-4">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

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
            }}
            className=""
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className=" hover:text-red-500 dark:hover:bg-gray-800 hover:bg-gray-200 "
            >
              1
            </div>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="hover:text-red-500 dark:hover:bg-gray-800 hover:bg-gray-200 "
            >
              2
            </div>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className=" hover:text-red-500 dark:hover:bg-gray-800 hover:bg-gray-200 "
            >
              3
            </div>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className=" hover:text-red-500 dark:hover:bg-gray-800 hover:bg-gray-200  "
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
              className=" hover:text-red-500 dark:hover:bg-gray-800 hover:bg-gray-200  "
            >
              5
            </div>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className=" hover:text-red-500 dark:hover:bg-gray-800 hover:bg-gray-200  "
            >
              6
            </div>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className=" hover:text-red-500 dark:hover:bg-gray-800 hover:bg-gray-200 "
            >
              7
            </div>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className={`hover:text-red-500   ${
                darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              } `}
            >
              <CiSettings />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default contentScript;

// style={{ position:"fixed",top:"10px",left:"20px", backgroundColor:'red',zIndex:"10000000"}}
