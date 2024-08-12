const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Task 7 - Register a user based on practice project - Returning 409 for conflict if user exists already.
  const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(409).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
   res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Task 2: ISBN is the index of the array
  
  const isbn = req.params.isbn;
  if(typeof books[isbn] == 'undefined')
    res.status(404).json({message: "This ISBN could not be found."});
  else
    res.send(books[isbn]);
    
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Task 3: Do a fuzzy search for near match of author else return 404
  const author = req.params.author;
  if(author != "")
  for(const field in books)
    if(books[field].author.toLowerCase().includes(author.toLowerCase()))
        return res.send(books[field]);

  return res.status(404).json({message: "This author could not be found."});
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Task 4: Do a fuzzy search for near match of title else return 404
  const title = req.params.title;
  if(title != "")
  for(const field in books)
    if(books[field].title.toLowerCase().includes(title.toLowerCase()))
        return res.send(books[field]);

  return res.status(404).json({message: "This book could not be found."});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Task 5: Do a search for ISBN to retrieve reviews else return 404

    const isbn = req.params.isbn;

    if(typeof books[isbn] != undefined && typeof books[isbn].reviews != undefined)
        return res.send(books[isbn].reviews);
    
    return res.status(404).json({message: "The ISBN you are looking for could not be found."});
});

module.exports.general = public_users;
