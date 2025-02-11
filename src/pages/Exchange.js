import React, { useState, useEffect } from "react";
import axios from "axios";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./Exchange.css";

function Exchange() {
  const [prices, setPrices] = useState([]);

  // Function to fetch prices from the API on page load
  const fetchPrices = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/prices");
      setPrices(response.data);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  useEffect(() => {
    fetchPrices(); // Fetch prices initially

    // Set up WebSocket connection
    const socket = new SockJS("http://localhost:8080/crypto-updates");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("Connected to WebSocket");

      // Subscribe to the topic for real-time price updates
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
            // If the price exists, update it
            const updatedPrices = [...prevPrices];
            updatedPrices[existingIndex] = updatedPrice;
            return updatedPrices;
          }
          return [...prevPrices, updatedPrice]; // Add new price
        });
      });
    });

    // Cleanup WebSocket when component unmounts
    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, []);

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
            <tr key={index}>
              <td>{price.exchange}</td>
              <td>{price.symbol}</td>
              <td>${parseFloat(price.price).toFixed(2)}</td>
              <td>{price.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Exchange;
