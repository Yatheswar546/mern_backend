const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const model = require('./model');
dotenv.config({ path: './.env' });

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8080;
const DB = process.env.MONGODB || 'mongodb://127.0.0.1:27017';

app.get('/todo', async (req, res) => {
  const todos = await model.find();
  res.json(todos);
});

app.post('/todo', (req, res) => {
  const todo = new model({
    text: req.body.text,
  });
  todo.save();
  res.json(todo);
});

app.delete('/todo/:id', async (req, res) => { 
  
  const result = await model.findByIdAndDelete(req.params.id);

  res.json({ result });
});

app.get('/todo/:id', async (req, res) => {
  const todo = await model.findById(req.params.id);

  todo.complete = !todo.complete;

  todo.save();

  res.json(todo);
});

app.put('/todo/:id', async (req, res) => {

  const todo = await model.findById(req.params.id);
   console.log('todo',todo)
  todo.text = req.body.text;
 
  todo.save();

  res.json(todo);
});

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`listening at ${port}`);
    });
  });
