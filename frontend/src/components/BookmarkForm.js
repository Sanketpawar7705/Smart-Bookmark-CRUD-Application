import React, { useState, useEffect } from 'react';

const BookmarkForm = ({ onSubmit, initialData, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        url: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                url: initialData.url || ''
            });
        }
    }, [initialData]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.url.trim()) {
            newErrors.url = 'URL is required';
        } else {
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!urlPattern.test(formData.url)) {
                newErrors.url = 'Please enter a valid URL';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        const result = await onSubmit(formData);
        setSubmitting(false);

        if (result.success) {
            setFormData({ title: '', url: '' });
            setErrors({});
        } else {
            alert(result.error || 'An error occurred');
        }
    };

    return (
        <div className="form-container">
            <h2>
                <i className={`fas ${initialData ? 'fa-edit' : 'fa-plus-circle'}`}></i>
                {initialData ? 'Edit Bookmark' : 'Add New Bookmark'}
            </h2>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter bookmark title"
                        className={errors.title ? 'error' : ''}
                        disabled={submitting}
                    />
                    {errors.title && <span className="error-message">{errors.title}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="url">URL</label>
                    <input
                        type="url"
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        className={errors.url ? 'error' : ''}
                        disabled={submitting}
                    />
                    {errors.url && <span className="error-message">{errors.url}</span>}
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={submitting}
                    >
                        <i className={`fas ${submitting ? 'fa-spinner fa-spin' : (initialData ? 'fa-save' : 'fa-plus')}`}></i>
                        {submitting ? 'Saving...' : (initialData ? 'Update' : 'Add Bookmark')}
                    </button>
                    
                    {onCancel && (
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={submitting}
                        >
                            <i className="fas fa-times"></i>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default BookmarkForm;