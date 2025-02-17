import React from "react";
function Home() {

return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-700 text-white text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Crypto Tracker</h1>
      <p className="text-lg max-w-lg">
        Track real-time cryptocurrency prices and stay updated with market trends.
      </p>
      <a href="/exchange" className="mt-6 bg-blue-500 px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition">
        View Live Prices
      </a>
    </div>
  );
}


export default Home;
