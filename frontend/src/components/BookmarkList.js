import React from 'react';

const BookmarkList = ({ bookmarks, onDelete, onEdit }) => {
    if (bookmarks.length === 0) {
        return (
            <div className="bookmark-list">
                <div className="empty-state">
                    <i className="fas fa-bookmark"></i>
                    <h3>No Bookmarks Yet</h3>
                    <p>Start adding your favorite websites using the form above!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bookmark-list">
            <div className="bookmark-stats">
                <i className="fas fa-layer-group"></i>
                <span>{bookmarks.length} {bookmarks.length === 1 ? 'Bookmark' : 'Bookmarks'}</span>
            </div>
            
            <div className="bookmark-grid">
                {bookmarks.map((bookmark) => (
                    <div key={bookmark._id} className="bookmark-card">
                        <h3 className="bookmark-title">{bookmark.title}</h3>
                        
                        <div className="bookmark-url">
                            <a 
                                href={bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <i className="fas fa-external-link-alt"></i>
                                {bookmark.url.length > 40 
                                    ? bookmark.url.substring(0, 40) + '...' 
                                    : bookmark.url}
                            </a>
                        </div>
                        
                        <div className="bookmark-actions">
                            <button 
                                onClick={() => onEdit(bookmark)}
                                className="btn-icon edit"
                                title="Edit bookmark"
                            >
                                <i className="fas fa-edit"></i>
                            </button>
                            <button 
                                onClick={() => onDelete(bookmark._id)}
                                className="btn-icon delete"
                                title="Delete bookmark"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookmarkList;