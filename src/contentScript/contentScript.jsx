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
import { FaMoon } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { IoSunnyOutline } from "react-icons/io5";

import SearchModal from "./components/SearchModal";
import SettingsModal from "./components/SettingsModal";
import { useAppContext } from "./contextApi/AppContext";

function contentScript() {
  const {
    selectedSymbol,
    setSelectedSymbol,
    darkMode,
    setDarkMode,
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
    hoveredIndex,
    crossXScreen,
  } = useAppContext();

  return (
    <div ref={draggableRef} style={divStyle} id="draggable-element">
      <div
        style={{
          display: "block",
          position: "absolute",
          bottom: "-5vh",
          right: "-5px",
          fontSize: "1.5vw",
          zIndex: 99999999,
        }}
      >
        <button
          onMouseDown={handleMouseDown}
          style={{
            display: "flex",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid",
            borderColor: "#e2e8f0",
            padding: " 0.3vw",
            borderRadius: "50%",
            backgroundColor: "#48bb78",
            fontSize: "1.5vw",
            // border: "6px solid red",
          }}
          onClick={isContainerVisible}
        >
          <AiOutlinePoweroff />
        </button>
      </div>

      {containerVisible && (
        <div
          id="robin-root-div"
          style={{
            position: "relative",
            top: "1px",
            right: "1px",
            backgroundColor: darkMode ? "#181818" : "#fff",
            width: "100%",
            fontSize: "1.7vw",
            borderRadius: "10px",
            border: "1px solid #36454F",
          }}
          className="    "
        >
          <div
            className=""
            style={{
              fontSize: "1vh",
              color: darkMode ? "white" : "black",
              height: "4vh",
              padding: "0px 1vw",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontSize: "0.8vw" }}>Kite Watchlist</h3>
            {/* <span style={{ border: "1px solid red ", fontSize: "20px" }}>
              <kite-button
                href="#"
                data-kite="your_api_key"
                data-exchange="NSE"
                data-tradingsymbol="SBIN"
                data-transaction_type="BUY"
                data-quantity="1"
                data-order_type="MARKET"
              >
                Buy SBI stock
              </kite-button>
            </span> */}
            <span
              onClick={() => updateDarkMode(!darkMode)}
              className=""
              style={{
                fontWeight: "700",
                cursor: "pointer",
                padding: "4px",
                fontSize: "0.8vw",
              }}
            >
              {darkMode ? <FaMoon /> : <IoSunnyOutline />}
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
              padding: "0px 8px",
            }}
            className="all-symbols "
          >
            <div>
              <table
                style={{
                  fontSize: "1.5vh",
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
                    categories[selectedCategory].map((symbol, index) => {
                      const newSymbol = symbol;
                      const BuyOrSellButton = ({
                        apiKey,
                        symbol,
                        orderType,
                      }) => {
                        const button = (
                          <a
                            href="#"
                            style={{
                              color: "white",
                              backgroundColor: `${
                                orderType === "BUY" ? "#4987ee" : "#d4603b"
                              }`,
                              padding: "0.3vh 1.1vh",
                            }}
                            id={`buy-button-${symbol}`}
                            data-kite={apiKey ? apiKey : "enter api key"}
                            data-exchange="NSE"
                            data-tradingsymbol={symbol}
                            data-transaction_type={orderType}
                            data-quantity="1"
                            data-order_type="MARKET"
                          >
                            {orderType === "BUY" ? "B" : "S"}
                          </a>
                        );

                        return button;
                      };

                      return (
                        <tr
                          key={symbol + index}
                          style={{
                            fontSize: "1.5vh",
                            lineHeight: "1.5vh",
                            // color: symbol ? "#5b9a5d" : "#e25f5b",
                            // borderBottom: `2px solid ${
                            //   darkMode ? "#232325" : "#f3f4f6"
                            // }`,
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
                            style={{
                              padding: "0.2vw 0.4vh",
                              color: "#5b9a5d",
                            }}
                            className=" "
                          >
                            {symbol}
                          </td>

                          <td style={{ padding: "0.2vw 0.4vh" }}></td>
                          <td style={{ padding: "0.2vw 0.4vh" }}></td>
                          <td style={{ padding: "0.2vw 0.4vh" }}></td>
                          <td style={{ padding: "0.2vw 0.4vh" }}></td>
                          <td style={{ padding: "0.2vw 0.4vh" }}></td>
                          {/* <td style={{ padding: "4px 8px" }}></td> */}
                          {/* <td style={{ padding: "4px 8px" }}></td> */}

                          {/* {hoveredIndex === index && ( */}
                          <td
                            style={{
                              // display: `${
                              //   hoveredIndex === index ? "flex" : "none"
                              // }`,
                              display: "flex",
                              cursor: "pointer",
                              border: "1px solid re",
                              // position: "absolute",
                              // right: "0.4vh",
                              gap: "0.6vh",
                              color: "white",
                              justifyContent: "flex-end",
                              alignItems: "end",
                            }}
                          >
                            <BuyOrSellButton
                              apiKey={apiKey}
                              symbol={symbol}
                              orderType={"BUY"}
                            />
                            <BuyOrSellButton
                              apiKey={apiKey}
                              symbol={symbol}
                              orderType={"SELL"}
                            />

                            {/* <a
                              href="#"
                              style={{
                                color: "white",
                                backgroundColor: "#4987ee",
                                padding: "0.3vh 1.1vh",

                                // borderRadius: "3px",
                              }}
                              id={`buy-button-${symbol}`}
                              data-kite={apiKey ? apiKey : "enter api key"}
                              data-exchange="NSE"
                              data-tradingsymbol={symbol}
                              data-transaction_type="BUY"
                              data-quantity="1"
                              data-order_type="MARKET"
                            >
                              B
                            </a> */}
                            {/* <a
                              href="#"
                              style={{
                                color: "white",
                                backgroundColor: "#d4603b",
                                padding: "0.3vh 1.1vh",
                                // borderRadius: "3px",
                              }}
                              id={`sell-button-${symbol}`}
                              data-kite={apiKey ? apiKey : "enter api key"}
                              data-exchange="NSE"
                              data-tradingsymbol={symbol}
                              data-transaction_type="SELL"
                              data-quantity="1"
                              data-order_type="MARKET"
                            >
                              S
                            </a> */}
                            <span
                              style={{
                                padding: "0.3vh 0.3vh",
                                marginLeft: "0.1vh",
                                border: "1px solid re",
                                fontSize: "2vh",
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

                          {/* )} */}
                        </tr>
                      );
                    })
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
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                cursor: "pointer",
                color: darkMode ? "#9ca3af" : "#4a5568",
                fontSize: "1.7vh",
                fontWeight: "200",
                // margin: "5px 0px",
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
                  padding: "4px 8px",
                  borderWidth: "0px",
                  borderColor: ` ${darkMode ? "#9ca3af" : "#4a5568"}`,
                  borderStyle: "solid",
                  borderRightWidth: "1px",
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
                  padding: "4px 8px",
                  borderWidth: "0px",
                  borderColor: ` ${darkMode ? "#9ca3af" : "#4a5568"}`,
                  borderStyle: "solid",
                  borderRightWidth: "1px",
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
                  padding: "4px 8px",
                  borderWidth: "0px",
                  borderColor: ` ${darkMode ? "#9ca3af" : "#4a5568"}`,
                  borderStyle: "solid",
                  borderRightWidth: "1px",
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
                  padding: "4px 8px",
                  borderWidth: "0px",
                  borderColor: ` ${darkMode ? "#9ca3af" : "#4a5568"}`,
                  borderStyle: "solid",
                  borderRightWidth: "1px",
                }}
              >
                4
              </div>
              <div
                style={{
                  color: darkMode ? "white" : "black",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px 8px",
                }}
                onClick={() => setIsOpenSettings(true)}
              >
                <CiSettings />
              </div>
            </div>

            {isOpenSettings && (
              <SettingsModal
                darkMode={darkMode}
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
