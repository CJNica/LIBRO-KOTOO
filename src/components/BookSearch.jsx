import React, { useState } from 'react';
import axios from 'axios';
import '../index.css'; 

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const apiKey = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books"
        />
        <button type="submit">Search</button>
      </form>

      {books.length > 0 && (
        <>
          <table className="book-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Authors</th>
              </tr>
            </thead>
            <tbody>
              {books.slice(0, 10).map((book) => (
                <tr key={book.id}>
                  <td>{book.volumeInfo.title || 'No Title'}</td>
                  <td>{book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page}</span>
            <button onClick={() => handlePageChange(page + 1)}>Next</button>
          </div>
        </>
      )}

      {/* Upload and Download CODS */}
      <h2>Upload an Image</h2>
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
