import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from './bookModel.js';

const app = express();

app.use(express.json());

// Route for the root path
app.get('/', (request, response) => {
  return response.status(234).send('Welcome to the Book app');
});

// for creating
app.post('/books', async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.genre ||
      !request.body.publicationYear ||
      !request.body.isbn 
    ) {
      return response.status(400).send({
        message: 'Send all the required fields: title, author, publishYear',
      });
    }

    const newBook = {
      title: request.body.title,
      author: request.body.author,
      genre: request.body.genre,
      publishYear: request.body.publishYear,
      isbn : request.body.isbn,
    };

    const book = await Book.create(newBook);

    return response.status(201).send(`book has been successfully added, details: ${book}`);
  } catch (error) {
    console.log(error.message);
    response.status(404).send({ message: error.message });
  }
});

//to get all books 

app.get('/books', async(request, response) => {
  try{
    const books = await Book.find({});

    return response.status(200).json({
      count: books.length,
      data: books
    });
  }catch(error){

    console.log(error.message);
    response.status(404).send({message: error.message });
  }
});

//route to get one book by id
app.get('/books/:id', async(request, response) => {
  try{

    const { id } = request.params;
    const book = await Book.findById(id);

    return response.status(200).json(book);
  }catch(error){

    console.log(error.message);
    response.status(404).send({message: error.message });
  }
});

//for updating

app.put('/books/:id', async(request, response) => {
  try{
    if(
      !request.body.title||
      !request.body.author||
      !request.body.genre ||
      !request.body.publishYear ||
      !request.body.isbn
    ){
      return response.status(404).send({
        message: 'send all required fields: title, author,genre, publicationYear, isbn',
      });
    }

    const { id } = request.params;

    const result = await Book.findByIdAndUpdate(id, request.body);

    if(!result){
      return response.status(404).json({ message: 'Book not found'});
    }
    return response.status(200).send({ message: 'Book updated successfully' });
  }catch(error){
    console.log(error.message);
    response.status(404).send({ message: error.message });
  }
});
//for deleting

app.delete('/books/:id', async (request, response) => {
  try{
   const { id } = request.params;

   const result = await Book.findByIdAndDelete(id);

   if(!result){
    return response.status(404).json({ message: 'book not found'});
   }

   return response.status(200).send({ message: 'Book deleted successfully' });
  }catch(error){
    console.log(error.message);
    response.status(404).send({ message: error.message });
  }
});

// MongoDB connection
mongoose.connect(mongoDBURL
)
  .then(() => {
    console.log('App connected to database');
  })
  .catch((error) => {
    console.log(error);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`App is listening to Port: ${PORT}`);
});