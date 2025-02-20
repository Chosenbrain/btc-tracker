import React, { useState, useEffect } from 'react';

const BTCTracker = () => {
  const [address, setAddress] = useState('');
  const [tracking, setTracking] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const ws = new WebSocket('ws://localhost:3001'); // Connect to backend WebSocket

  useEffect(() => {
    ws.onmessage = (event) => {
      const newTx = JSON.parse(event.data);
      setTransactions((prevTxs) => [newTx, ...prevTxs]);
    };
  }, []);

  const startTracking = () => {
    if (address) {
      ws.send(JSON.stringify({ action: 'track', address }));
      setTracking(true);
    }
  };

  const stopTracking = () => {
    ws.send(JSON.stringify({ action: 'untrack', address }));
    setTracking(false);
    setTransactions([]);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">BTC Wallet Tracker</h1>
      <input
        type="text"
        className="p-2 border border-gray-400 rounded mb-4 text-black"
        placeholder="Enter BTC Wallet Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        disabled={tracking}
      />
      <div className="flex gap-4">
        <button
          className="p-2 bg-green-500 rounded disabled:bg-gray-500"
          onClick={startTracking}
          disabled={tracking}
        >
          Start Tracking
        </button>
        <button
          className="p-2 bg-red-500 rounded"
          onClick={stopTracking}
          disabled={!tracking}
        >
          Stop Tracking
        </button>
      </div>
      <div className="mt-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-3">Live Transactions:</h2>
        <div className="overflow-y-auto max-h-80">
          {transactions.map((tx, index) => (
            <div key={index} className="p-4 mb-2 border border-gray-700 rounded">
              <p><strong>TXID:</strong> <a href={`https://mempool.space/tx/${tx.txid}`} target="_blank" className="text-blue-400">{tx.txid}</a></p>
              <p><strong>Sender:</strong> {tx.sender}</p>
              <p><strong>Amount:</strong> {tx.amount} BTC</p>
              <p><strong>Time:</strong> {new Date(tx.time).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BTCTracker;
