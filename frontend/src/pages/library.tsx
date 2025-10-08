import React, { useState } from 'react';
import { FaBook, FaPlus, FaSearch, FaEdit, FaTrash, FaBookOpen, FaBookReader } from 'react-icons/fa';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  status: 'available' | 'borrowed' | 'unavailable';
}

const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Mock data
  const books: Book[] = [
    {
      id: '1',
      title: 'Introduction to Computer Science',
      author: 'John Smith',
      isbn: '978-1234567890',
      category: 'Computer Science',
      totalCopies: 10,
      availableCopies: 7,
      status: 'available'
    },
    {
      id: '2',
      title: 'Mathematics for Engineers',
      author: 'Jane Doe',
      isbn: '978-0987654321',
      category: 'Mathematics',
      totalCopies: 8,
      availableCopies: 0,
      status: 'borrowed'
    },
    {
      id: '3',
      title: 'World History',
      author: 'Robert Brown',
      isbn: '978-1122334455',
      category: 'History',
      totalCopies: 12,
      availableCopies: 10,
      status: 'available'
    }
  ];

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    const matchesCategory = !filterCategory || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (book: Book) => {
    if (book.availableCopies === 0) {
      return <span className="badge bg-danger">Not Available</span>;
    } else if (book.availableCopies < 3) {
      return <span className="badge bg-warning">Limited</span>;
    } else {
      return <span className="badge bg-success">Available</span>;
    }
  };

  return (
    <div className="library-management">
      <div className="page-header mb-4">
        <div>
          <h2 className="d-flex align-items-center mb-2">
            <FaBook className="me-2" />
            Library Management
          </h2>
          <p className="text-muted mb-0">Manage books and library inventory</p>
        </div>
        <button className="btn btn-primary">
          <FaPlus className="me-1" />
          Add New Book
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title, author, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="History">History</option>
                <option value="Science">Science</option>
                <option value="Literature">Literature</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">
              <FaBook />
            </div>
            <div className="stat-details">
              <div className="stat-value">1,250</div>
              <div className="stat-label">Total Books</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card stat-card-success">
            <div className="stat-icon">
              <FaBookOpen />
            </div>
            <div className="stat-details">
              <div className="stat-value">890</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card stat-card-warning">
            <div className="stat-icon">
              <FaBookReader />
            </div>
            <div className="stat-details">
              <div className="stat-value">360</div>
              <div className="stat-label">Borrowed</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card stat-card-info">
            <div className="stat-icon">📚</div>
            <div className="stat-details">
              <div className="stat-value">45</div>
              <div className="stat-label">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Category</th>
                  <th>Total Copies</th>
                  <th>Available</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">
                      No books found
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => (
                    <tr key={book.id}>
                      <td className="fw-bold">{book.title}</td>
                      <td>{book.author}</td>
                      <td>
                        <code className="text-muted">{book.isbn}</code>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{book.category}</span>
                      </td>
                      <td>{book.totalCopies}</td>
                      <td>
                        <span className={book.availableCopies === 0 ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                          {book.availableCopies}
                        </span>
                      </td>
                      <td>{getStatusBadge(book)}</td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <button className="btn btn-outline-primary btn-sm">
                            <FaEdit />
                          </button>
                          <button className="btn btn-outline-danger btn-sm">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .stat-card {
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .stat-card-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .stat-card-success {
          background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
          color: #1a202c;
        }

        .stat-card-warning {
          background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);
          color: #1a202c;
        }

        .stat-card-info {
          background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
          color: #1a202c;
        }

        .stat-icon {
          font-size: 2.5rem;
          opacity: 0.9;
        }

        .stat-details {
          flex: 1;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default Library;

