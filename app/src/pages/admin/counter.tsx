import React, { useState, useEffect } from "react";
import { LogicApiDataSource } from "../../api/dataSource/LogicApiDataSource";

// Assuming Player is defined like this
interface Player {
  id: string;
  name: string;
  // Add any other properties that a Player object might have
}

interface GetAllPlayersResponse {
  players: Player[];
}

const CounterComponent: React.FC = () => {
  const [counter, setCounter] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [incrementing, setIncrementing] = useState<boolean>(false);
  const [players, setPlayers] = useState<Player[]>([]); // State for players
  const [lottery, setLottery] = useState<string | null>(null); // State for lottery result

  // Fetch counter value on mount
  useEffect(() => {
    fetchCounter();
  }, []);

  const fetchCounter = async () => {
    setLoading(true);
    try {
      const response = await new LogicApiDataSource().getCounterValue();
      if (response?.data) {
        setCounter(response.data.value); // Assuming API returns { value: number }
      }
    } catch (error) {
      console.error("Failed to fetch counter:", error);
    }
    setLoading(false);
  };

  const incrementCounter = async () => {
    setIncrementing(true);
    try {
      const response = await new LogicApiDataSource().incrementCounter();
      if (response?.data) {
        console.log("Updated successfully"); // Update only when backend returns new value
      }
    } catch (error) {
      console.error("Failed to increment counter:", error);
    }
    setIncrementing(false);
  };

  const fetchAllPlayers = async () => {
    setLoading(true);
    try {
      const response = await new LogicApiDataSource().getAllPlayers();
      console.log(response.data, "new ");
      if (response?.data) {
        setPlayers(response.data.players); // Assuming API returns { players: Player[] }
      }
    } catch (error) {
      console.error("Failed to fetch players:", error);
    }
    setLoading(false);
  };

  const getLottery = async () => {
    setLoading(true);
    try {
      const response = await new LogicApiDataSource().getLottery();
      if (response?.data) {
        console.log(response.data)
       
      }
    } catch (error) {
      console.error("Failed to fetch lottery:", error);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <p style={styles.counterText}>
        {loading ? "Fetching..." : counter !== null ? `Counter: ${counter}` : "Counter not available"}
      </p>
      <button style={styles.button} onClick={incrementCounter} disabled={incrementing}>
        {incrementing ? "Incrementing..." : "Increment Counter"}
      </button>
      <button
        style={{ ...styles.button, background: "white", color: "#333", border: "1px solid #333" }}
        onClick={fetchCounter}
        disabled={loading}
      >
        {loading ? "Fetching..." : "Show Counter"}
      </button>
      <button
        style={{ ...styles.button, background: "#28a745" }}
        onClick={fetchAllPlayers}
        disabled={loading}
      >
        {loading ? "Fetching..." : "Show All Players"}
      </button>
      <button
        style={{ ...styles.button, background: "#ffc107", color: "#333" }}
        onClick={getLottery}
        disabled={loading}
      >
        {loading ? "Fetching..." : "Get Lottery"}
      </button>
      {players.length > 0 && (
        <div style={styles.playersList}>
          <h3>Players:</h3>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player.name}</li> // Display player's name
            ))}
          </ul>
        </div>
      )}
      {lottery && (
        <div style={styles.lotteryResult}>
          <h3>Lottery Result:</h3>
          <p>{lottery}</p>
        </div>
      )}
    </div>
  );
};

// Inline CSS styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "12px",
    background: "#f8f9fa",
    width: "300px",
    margin: "auto",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  counterText: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
    margin: "0",
  },
  button: {
    padding: "10px 15px",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "8px",
    border: "none",
    background: "#007bff",
    color: "white",
    transition: "0.3s",
    width: "200px",
    textAlign: "center",
  },
  playersList: {
    marginTop: "1rem",
    padding: "1rem",
    background: "#e9ecef",
    borderRadius: "8px",
    width: "100%",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  lotteryResult: {
    marginTop: "1rem",
    padding: "1rem",
    background: "#ffeeba",
    borderRadius: "8px",
    width: "100%",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
};

export default CounterComponent;
