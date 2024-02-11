const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "local_devprojdb",
  charset: "utf8mb4",
});

dbConnection.connect((err) => {
  if (err) {
    console.error("Error connecting to local database: " + err.stack);
    return;
  }
  console.log("Connected to local database");
});

app.get("/health", (req, res) => {
  res.send("Up & Running");
});

app.get("/create_table", (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS example_table (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `;
  dbConnection.query(createTableQuery, (error) => {
    if (error) throw error;
    res.send("Table created successfully");
  });
});

app.post("/insert_record", (req, res) => {
  const name = req.body.name;
  const insertQuery = "INSERT INTO example_table (name) VALUES (?)";
  dbConnection.query(insertQuery, [name], (error) => {
    if (error) throw error;
    res.send("Record inserted successfully");
  });
});

app.get("/data", (req, res) => {
  const selectQuery = "SELECT * FROM example_table";
  dbConnection.query(selectQuery, (error, result) => {
    if (error) throw error;
    res.json(result);
  });
});

// UI route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
