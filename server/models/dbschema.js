const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const transactionSchema = new Schema({
    TransactionDate: {
        type: String
    },
    StatementDescription: {
        type: String
    },
    DebitAmount: {
        type: Number
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    CategoryName: {
        type: String
    }
});

const categorySchema = new Schema({
    Category: {
        CategoryName: {
            type: String,
            required: true
        },
        Amount: {
            type: Number,
            required: true
        }
    }
});

module.exports.TransactionModel = mongoose.model('TransactionModel', transactionSchema);
module.exports.CategoryModel = mongoose.model('CategoryModel', categorySchema);
