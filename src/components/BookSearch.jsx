import React, { useState } from 'react';
import axios from 'axios';
import '../index.css';

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [library, setLibrary] = useState([]); 
  const apiKey = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;

  //  Search for books
  const searchBooks = async (query, page) => {
    try {
      const startIndex = (page - 1) * 10;
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=10&key=${apiKey}`
      );
      setBooks(response.data.items || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(query, page);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    searchBooks(query, newPage);
  };

  // Manage Library
  const addToLibrary = (book) => {
    if (!library.some((b) => b.id === book.id)) {
      setLibrary([...library, book]);
    }
  };

  const removeFromLibrary = (bookId) => {
    setLibrary(library.filter((book) => book.id !== bookId));
  };

  // Image Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container">
      
      {/*  Search  */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books"
        />
        <button type="submit">Search</button>
      </form>

      {/* Results Container */}
      <div className="results-container">
        {books.length > 0 ? (
          <table className="result-table">
            <thead>
              <tr>
                <th>Book Image</th>
                <th>Title</th>
                <th>Authors</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>
                    {book.volumeInfo.imageLinks ? (
                      <img
                        src={book.volumeInfo.imageLinks.thumbnail}
                        alt={book.volumeInfo.title}
                        className="book-cover"
                      />
                    ) : (
                      <p>No Image Available</p>
                    )}
                  </td>
                  <td>{book.volumeInfo.title || "No Title"}</td>
                  <td>{book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown Author"}</td>
                  <td>
                    <button onClick={() => addToLibrary(book)}>Add to Library</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No books found.</p>
        )}
      </div>

      {/* My Book Library  */}
      <h2>My Book Library</h2>
      {library.length > 0 ? (
        <table className="library-table">
          <thead>
            <tr>
              <th>Book Image</th>
              <th>Title</th>
              <th>Authors</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {library.map((book) => (
              <tr key={book.id}>
                <td>
                  {book.volumeInfo.imageLinks ? (
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt={book.volumeInfo.title}
                      className="book-cover"
                    />
                  ) : (
                    <p>No Image Available</p>
                  )}
                </td>
                <td>{book.volumeInfo.title || "No Title"}</td>
                <td>{book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown Author"}</td>
                <td>
                  <button onClick={() => removeFromLibrary(book.id)}>Remove from Library</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No books added yet.</p>
      )}

      {/* Image Upload */}
      <h2>Image Upload</h2>
      <div className="button-container">
        <input type="file" onChange={handleFileUpload} className="browse-button" />
      </div>

      {uploadedFile && (
        <>
          <div className="image-container">
            <img src={imagePreview} alt="Uploaded preview" />
          </div>
          <p className="image-name">{uploadedFile.name}</p>
          <div className="button-container">
            <a href={URL.createObjectURL(uploadedFile)} download={uploadedFile.name} className="download-button">
              Download {uploadedFile.name}
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default BookSearch;
