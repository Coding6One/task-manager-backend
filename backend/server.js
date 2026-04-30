const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes"); 

const app = express();

app.use(cors());
app.use(express.json()); 

app.use("/api/auth", authRoutes); 

app.get("/", (req, res) => {
  res.send("API is running...");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 0;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${server.address().port}`);
});

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);