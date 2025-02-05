const express = require("express");
const encryptionRoutes = require("./routes/encryptionRoutes");

const app = express();
const cors = require("cors");

app.use(cors());

// Middleware to parse JSON
app.use(express.json());


// Routes
app.use("/api", encryptionRoutes);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
