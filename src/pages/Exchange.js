import React, { useState, useEffect } from "react";
import axios from "axios";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./Exchange.css";

function Exchange() {
  const [prices, setPrices] = useState([]);
  const [highlightedRows, setHighlightedRows] = useState({});


  const fetchPrices = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/prices");
      setPrices(response.data);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  useEffect(() => {
    fetchPrices();


    const socket = new SockJS("http://localhost:8080/crypto-updates");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("Connected to WebSocket");


      stompClient.subscribe("/topic/prices", (message) => {
        const updatedPrice = JSON.parse(message.body);
        console.log("Real-time update received:", updatedPrice);

        setPrices((prevPrices) => {
          const existingIndex = prevPrices.findIndex(
            (price) =>
              price.symbol === updatedPrice.symbol &&
              price.exchange === updatedPrice.exchange
          );

          if (existingIndex !== -1) {

            const updatedPrices = [...prevPrices];
            updatedPrices[existingIndex] = updatedPrice;


            setHighlightedRows((prev) => ({
              ...prev,
              [updatedPrice.symbol]: true,
            }));


            setTimeout(() => {
              setHighlightedRows((prev) => ({
                ...prev,
                [updatedPrice.symbol]: false,
              }));
            }, 1000);

            return updatedPrices;
          }

          return [...prevPrices, updatedPrice];
        });
      });
    });


    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, []);


  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toISOString().replace("T", " ").slice(0, -3);
  };

  return (
    <div className="exchange-container">
      <h1>Crypto Prices</h1>
      <table>
        <thead>
          <tr>
            <th>Exchange</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price, index) => (
            <tr
              key={index}
              className={highlightedRows[price.symbol] ? "highlight" : ""}
            >
              <td>{price.exchange}</td>
              <td>{price.symbol}</td>
              <td>${parseFloat(price.price).toFixed(2)}</td>
              <td>{formatTimestamp(price.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Exchange;
