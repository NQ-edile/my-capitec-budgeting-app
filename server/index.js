const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const fs = require('fs');
const multer = require('multer');
const csv = require('csv-parser');
const { TransactionModel, CategoryModel } = require('./models/dbschema');
const transactionRoute = require('./routes/transactions');
const { json } = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
const upload = multer({ dest: 'uploads/' });
app.use('/file-upload', transactionRoute);
app.use(cors());


const PORT = process.env.PORT || 5500;
// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECT)
    .then(() => console.log("Database Connected"))
    .catch(err => console.log(err));

app.get('/file-upload', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/transactions', async (req, res) => {
    try {
        const update = {}
        const allTransations = await TransactionModel.find({});
        res.status(200).json(allTransations);
    } catch(err) {
        res.json("An Error Occured!");
    }
});

app.get('/categories', async (req, res) => {
    try {
        const allCategories = await CategoryModel.find({});
        res.status(200).json(allCategories);
    } catch(err) {
        res.json("An Error Occured!");
    }
});

app.put('/select-category/:transactionId/update-category/:categoryId', async (req, res) => {
    try {
        const categoryId  = req.params.categoryId;
        
        const transaction = await TransactionModel.findById(req.params.transactionId);
        const oldCategoryId = transaction.category;

        if (oldCategoryId && oldCategoryId.toString() !== categoryId.toString()) {
            const oldCategory = await CategoryModel.findById(oldCategoryId);
            oldCategory.Category.Amount += transaction.DebitAmount;
            await oldCategory.save();
        }

        const newCategory = await CategoryModel.findById(categoryId);
        newCategory.Category.Amount -= transaction.DebitAmount;
        await newCategory.save();

        transaction.category = categoryId;
        transaction.CategoryName = newCategory.Category.CategoryName;
        await transaction.save();

        res.status(200).json('Category Updated Successfully!');
    } catch(err) {
        res.json("An Error Occured!");
    }
});

app.delete('/delete-category/:id', async (req, res) => {
    try {
        const deleteCategory = await CategoryModel.findByIdAndDelete(req.params.id);
        res.status(200).json('Category Deleted Successfully!');
    } catch(err) {
        res.json("An Error Occured!");
    }
});



app.post('/add-category', async (req, res) => {
    try {
        const newCategory = new CategoryModel({
            Category: {
                CategoryName: req.body.categoryName,
                Amount: req.body.amount
            }
        });
        await newCategory.save();
        res.status(200).json('Category Added Successfully!');
    } catch(err) {
        res.json("An Error Occured!");
    }
});

app.post('/file-upload', upload.single('file'), async (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv({ skipLines: 1 }))
        .on('data', (data) => {

            results.push(data);
        })
        .on('end', async () => {
            const transactions = JSON.parse(JSON.stringify(results));
            console.log(transactions);
            try {
                transactions.forEach(async (item) => {
                    const newTransaction = new TransactionModel({
                        TransactionDate: item['Transaction Date'],
                        StatementDescription: item['Statement Description'],
                        DebitAmount: item['Debit Amount'],
                        CategoryName: "Unknown"
                    });

                    const saveTransaction = await newTransaction.save();
                })
                res.status(200).json('Transaction Added Successfully!');
               
            } catch(err) {
                res.json(err);
            }
        });
});

app.listen(PORT, () => console.log('Server connected'));