import React, { useState, useEffect } from "react";
import { LogicApiDataSource } from "../../api/dataSource/LogicApiDataSource";

const CounterComponent: React.FC = () => {
  const [counter, setCounter] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [incrementing, setIncrementing] = useState<boolean>(false);

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
        console.log("updated succesfully") // Update only when backend returns new value
      }
    } catch (error) {
      console.error("Failed to increment counter:", error);
    }
    setIncrementing(false);
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
};

export default CounterComponent;
