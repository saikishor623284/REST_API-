// server.js

// Import the express module
const express = require('express');
// Create an instance of the express application
const app = express();
// Define the port the server will listen on
const PORT = 3000;

// Middleware to parse JSON bodies from incoming requests
// This is essential for handling POST and PUT requests with JSON payloads
app.use(express.json());

// In-memory array to store book objects
// In a real-world application, this would be replaced by a database
let books = [
    { id: '1', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
    { id: '2', title: 'Pride and Prejudice', author: 'Jane Austen' },
    { id: '3', title: '1984', author: 'George Orwell' }
];

// Helper function to generate a unique ID for new books
// In a production environment, a more robust ID generation strategy would be used (e.g., UUID)
const generateId = () => {
    // Get the highest existing ID, or 0 if no books exist
    const maxId = books.length > 0
        ? Math.max(...books.map(book => parseInt(book.id)))
        : 0;
    // Increment the highest ID to create a new unique ID
    return (maxId + 1).toString();
};

// --- API Endpoints ---

// GET /books: Retrieve all books
// Returns a JSON array of all book objects currently in memory.
app.get('/books', (req, res) => {
    console.log('GET /books request received');
    res.status(200).json(books);
});

// GET /books/:id: Retrieve a single book by ID
// Finds and returns a specific book based on the ID provided in the URL parameter.
// Returns 404 if the book is not found.
app.get('/books/:id', (req, res) => {
    const { id } = req.params; // Extract ID from URL parameters
    console.log(`GET /books/${id} request received`);
    const book = books.find(b => b.id === id); // Find the book in the array

    if (book) {
        res.status(200).json(book); // Send the book if found
    } else {
        res.status(404).json({ message: 'Book not found' }); // Send 404 if not found
    }
});

// POST /books: Add a new book
// Creates a new book object using data from the request body (title and author).
// Assigns a unique ID to the new book and adds it to the in-memory array.
// Returns the newly created book object with status 201 (Created).
// Requires 'title' and 'author' in the request body.
app.post('/books', (req, res) => {
    const { title, author } = req.body; // Extract title and author from request body
    console.log('POST /books request received', req.body);

    // Basic validation for required fields
    if (!title || !author) {
        return res.status(400).json({ message: 'Title and author are required' });
    }

    const newBook = {
        id: generateId(), // Generate a unique ID for the new book
        title,
        author
    };

    books.push(newBook); // Add the new book to the array
    res.status(201).json(newBook); // Respond with the created book and 201 status
});

// PUT /books/:id: Update an existing book by ID
// Locates a book by its ID and updates its title and/or author based on the request body.
// Returns the updated book object.
// Returns 404 if the book is not found.
// Returns 400 if no update data is provided.
app.put('/books/:id', (req, res) => {
    const { id } = req.params; // Extract ID from URL parameters
    const { title, author } = req.body; // Extract update data from request body
    console.log(`PUT /books/${id} request received`, req.body);

    const bookIndex = books.findIndex(b => b.id === id); // Find the index of the book

    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Book not found' }); // Book not found
    }

    // Ensure at least one field (title or author) is provided for update
    if (!title && !author) {
        return res.status(400).json({ message: 'At least one field (title or author) must be provided for update.' });
    }

    // Update the book properties if provided in the request body
    if (title) {
        books[bookIndex].title = title;
    }
    if (author) {
        books[bookIndex].author = author;
    }

    res.status(200).json(books[bookIndex]); // Respond with the updated book
});

// DELETE /books/:id: Remove a book by ID
// Deletes a book from the in-memory array based on the ID provided in the URL parameter.
// Returns a success message.
// Returns 404 if the book is not found.
app.delete('/books/:id', (req, res) => {
    const { id } = req.params; // Extract ID from URL parameters
    console.log(`DELETE /books/${id} request received`);

    const initialLength = books.length;
    // Filter out the book to be deleted from the array
    books = books.filter(book => book.id !== id);

    if (books.length < initialLength) {
        res.status(200).json({ message: `Book with ID ${id} deleted successfully` }); // Book deleted
    } else {
        res.status(404).json({ message: 'Book not found' }); // Book not found
    }
});

// Start the Express server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Use Postman or curl to test the endpoints:');
    console.log(`  GET all books: GET http://localhost:${PORT}/books`);
    console.log(`  GET book by ID: GET http://localhost:${PORT}/books/1`);
    console.log(`  POST new book: POST http://localhost:${PORT}/books`);
    console.log(`    Body: {"title": "New Book", "author": "New Author"}`);
    console.log(`  PUT update book: PUT http://localhost:${PORT}/books/1`);
    console.log(`    Body: {"title": "Updated Title"}`);
    console.log(`  DELETE book by ID: DELETE http://localhost:${PORT}/books/1`);
});
