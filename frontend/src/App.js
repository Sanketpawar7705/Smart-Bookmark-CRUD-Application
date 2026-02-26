import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookmarkForm from './components/BookmarkForm';
import BookmarkList from './components/BookmarkList';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.headers.post['Content-Type'] = 'application/json';

function App() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingBookmark, setEditingBookmark] = useState(null);

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/bookmarks`);
            setBookmarks(response.data.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            setError('Failed to connect to server. Make sure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const addBookmark = async (bookmarkData) => {
        try {
            console.log('Sending data:', bookmarkData); // Debug log
            
            const response = await axios.post(`${API_URL}/bookmarks`, bookmarkData);
            
            console.log('Response:', response.data); // Debug log
            
            if (response.data.success) {
                setBookmarks([response.data.data, ...bookmarks]);
                return { success: true };
            } else {
                return { 
                    success: false, 
                    error: response.data.error || 'Failed to add bookmark' 
                };
            }
        } catch (error) {
            console.error('Add bookmark error:', error);
            
            let errorMessage = 'Failed to add bookmark';
            
            if (error.response) {
                // Server responded with error
                console.log('Error response:', error.response.data);
                errorMessage = error.response.data.error || errorMessage;
            } else if (error.request) {
                // Request made but no response
                errorMessage = 'Cannot connect to server. Make sure backend is running.';
            } else {
                // Something else happened
                errorMessage = error.message;
            }
            
            return { 
                success: false, 
                error: errorMessage 
            };
        }
    };

    const updateBookmark = async (id, bookmarkData) => {
        try {
            const response = await axios.put(`${API_URL}/bookmarks/${id}`, bookmarkData);
            
            if (response.data.success) {
                setBookmarks(bookmarks.map(b => b._id === id ? response.data.data : b));
                setEditingBookmark(null);
                return { success: true };
            } else {
                return { 
                    success: false, 
                    error: response.data.error || 'Failed to update bookmark' 
                };
            }
        } catch (error) {
            console.error('Update error:', error);
            return { 
                success: false, 
                error: error.response?.data?.error || 'Failed to update bookmark' 
            };
        }
    };

    const deleteBookmark = async (id) => {
        if (window.confirm('Are you sure you want to delete this bookmark?')) {
            try {
                await axios.delete(`${API_URL}/bookmarks/${id}`);
                setBookmarks(bookmarks.filter(b => b._id !== id));
            } catch (error) {
                console.error('Delete error:', error);
                alert('Failed to delete bookmark');
            }
        }
    };

    return (
        <div className="app">
            <header className="header">
                <div className="container">
                    <h1>
                        <i className="fas fa-bookmark"></i>
                        Bookmark Manager
                    </h1>
                    <p>Save and organize your favorite websites</p>
                </div>
            </header>

            <main className="container">
                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                        {error}
                    </div>
                )}

                <BookmarkForm 
                    onSubmit={editingBookmark ? 
                        (data) => updateBookmark(editingBookmark._id, data) : 
                        addBookmark
                    }
                    initialData={editingBookmark}
                    onCancel={() => setEditingBookmark(null)}
                />

                {loading ? (
                    <div className="loading">
                        <i className="fas fa-spinner fa-spin"></i> Loading...
                    </div>
                ) : (
                    <BookmarkList 
                        bookmarks={bookmarks}
                        onDelete={deleteBookmark}
                        onEdit={setEditingBookmark}
                    />
                )}
            </main>
        </div>
    );
}

export default App;