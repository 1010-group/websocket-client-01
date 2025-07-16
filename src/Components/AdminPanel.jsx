import React, { useState } from "react";
import socket from "./socket";

const AdminPanel = () => {
  const [userId, setUserId] = useState("");
  const [coins, setCoins] = useState(0);
  const [result, setResult] = useState("");

  // Добавить коин
  const handleAddCoins = () => {
    socket.emit("add_coins", { userId, amount: Number(coins) });

    socket.once("coin_result", (data) => {
      if (data.success) {
        setResult(`✅ Coins updated: ${data.coin}`);
      } else {
        setResult(`❌ Error: ${data.message}`);
      }
    });
  };

  // Подтвердить аккаунт
  const handleVerifyAccount = () => {
    socket.emit("verify_account", { userId });

    socket.once("verify_result", (data) => {
      if (data.success) {
        setResult("✅ User verified successfully!");
      } else {
        setResult(`❌ Error: ${data.message}`);
      }
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔑 Admin Panel</h2>

      <label>User ID:</label>
      <input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="User ID"
        style={{ marginRight: "10px" }}
      />

      <div style={{ margin: "10px 0" }}>
        <label>Coins to Add:</label>
        <input
          type="number"
          value={coins}
          onChange={(e) => setCoins(e.target.value)}
          placeholder="Coins"
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleAddCoins}>Add Coins</button>
      </div>

      <div style={{ margin: "10px 0" }}>
        <button onClick={handleVerifyAccount}>Verify Account</button>
      </div>

      {result && (
        <div style={{ marginTop: "20px", color: "blue" }}>
          <strong>{result}</strong>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
