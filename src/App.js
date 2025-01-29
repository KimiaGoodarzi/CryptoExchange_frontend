import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function App() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    // Fetch initial prices from the backend
    const fetchPrices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/prices');
        setPrices(response.data);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };
    fetchPrices();

    // Connect to WebSocket for real-time updates
    const socket = new SockJS('http://localhost:8080/crypto-updates');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log('Connected to WebSocket');
      stompClient.subscribe('/topic/prices', (message) => {
        const updatedPrice = JSON.parse(message.body);
        console.log('Real-time update:', updatedPrice);

        // Update the price list in state
        setPrices((prevPrices) => {
          const existingIndex = prevPrices.findIndex(
            (price) => price.symbol === updatedPrice.symbol && price.exchange === updatedPrice.exchange
          );
          if (existingIndex !== -1) {
            const updatedPrices = [...prevPrices];
            updatedPrices[existingIndex] = updatedPrice;
            return updatedPrices;
          }
          return [...prevPrices, updatedPrice];
        });
      });
    });

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, []);

  return (
    <div className="container mt-5">
    <div className="card">
    <div className="card-header text-center">
      <h1>Crypto Prices</h1>
      </div>
      <div className="card-body">
      <table className="table table-striped table-hover">
        <thead className="thead-dark">

          <tr>
            <th>Exchange</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price, index) => (
            <tr key={index} className={price.exchange === "Binance" ? "table-success" : "table-info"}>
              <td>{price.exchange}</td>
              <td>{price.symbol}</td>
              <td>${parseFloat(price.price).toFixed(2)}</td>
               <td>{new Date(price.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
    </div>
  );
}

export default App;
