const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    url: {
        type: String,
        required: [true, 'Please add a URL'],
        trim: true,
        match: [
            /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
            'Please add a valid URL'
        ]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);