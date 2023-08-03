const router = require('express').Router();
const transactionModel = require('../models/dbschema');
const upload = require('express-fileupload');
const { application } = require('express');

// router.post('/file-upload', upload.single('file'), (req, res) => {
//     const results = [];
//     fs.createReadStream(req.file.path)
//         .pipe(csv({ separator: ';' }))
//         .on('data', (data) => results.push(data))
//         .on('end', () => {
//             console.log(results);
//             const transactions = JSON.parse(JSON.stringify(results));
//             try {
//                 transactions.forEach((item) => {
//                     const newTransaction = new transaction({
//                         SequenceNumber: item['Sequence Number'],
//                         TransactionDate: item['Transaction Date'],
//                         StatementDescription: item['Statement Description'],
//                         DebitAmount: item['Debit Amount']
//                     });

//                     const saveTransaction = await newTransaction.save();
//                 })
//                 res.status(200).json('Transaction Added Successfully!');
               
//             } catch(err) {
//                 res.json(err)
//             }
//         });
// });

module.exports = router;