// console.log("Hello World");

// IMPORT LIBRARY
require("dotenv").config(); //buat .env
const express = require("express"); //import library express
const app = express(); // inisialisasi object express ke variabel app
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser"); //library middleware untuk parsing body
const cors = require("cors"); // middleware CORS

// USE LIBRARY
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// pura-puranya database
let id = 0; //ini pura2nya  auto increment
const db = [];



app.post("/add", (req, res) => {
    const todo = {
      id: ++id,
      todo: req.body.todo,
      completed: false,
      created_at: new Date().toJSON(),
    };
    db.push(todo); //menambahkan todo ke array sebelumnya
    res.status(201).send({
      message: "Item successfully created",
      data: todo,
    });
  });
  
  app.get("/", (req, res) => {
    res.send(db);//mengembalikan semua todo yang ada
  });


  const getTodo = (req, res) => {
    const item = db.find((item) => item.id == req.params.id);
    if (item) {
      res.send(item);
    } else {
      res.status(404).send("Item not found");
    }
  };
  const updateTodo = (req, res) => {
    const item = db.find((item) => item.id == req.params.id);
    if (item) {
      item.completed = !item.completed;
      res.send(item);
    } else {
      res.status(404).send("Item not found");
    }
  };
  const deleteTodo = (req, res) => {
    const idx = db.findIndex((item) => item.id == req.params.id);
    if (idx !== -1) {
      db.splice(idx, 1);
      res.send(`Item ${idx} deleted`);
    } else {
      res.status(404).send("Item not found");
    }
  };

app.route("/:id").get(getTodo).put(updateTodo).delete(deleteTodo);


// ROUTING
// app.get("/", (req, res) => {
//     res.send("Hello world");
app.listen(port, () => console.log("Server listening on port:" + port));
//   });

