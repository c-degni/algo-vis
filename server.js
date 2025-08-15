const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(morgan("combined"));
app.use(cors({
    // origin: process.env.NODE_ENV === "production" 
    //     ? ['https://rando-undecided-domain.com"] 
    //     : ["http://localhost:3000'""]
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"]
}));
app.use(express.json({ limit: "10mb" }));

app.use("/dist", express.static(path.join(__dirname, "dist")));
app.use(express.static(__dirname)); // so /index.html (and any other root assets) are served

// If this is a SPA and you want the root to load index.html explicitly:
app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

const apiRoutes = require("./src/services/visualization_mapping/api/routes/index.js");
app.use("/api", apiRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({ 
        status: "healthy",
        timestamp: new Date().toISOString(), // yr-m-d hr:min:sec:msec
        version: '1.0.0'
    });
});''

app.listen(PORT, () => {
    console.log(`Server:    http://localhost:${PORT}`);
    console.log(`API:       http://localhost:${PORT}/api`);
    console.log(`Health:    http://localhost:${PORT}/health`);
});