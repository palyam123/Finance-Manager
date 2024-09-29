const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/personalFinance', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.log(err));

// Define a schema for Transaction
const TransactionSchema = new mongoose.Schema({
    date: String,
    type: String, // 'Income' or 'Expense'
    amount: Number,
    category: String
});

// Create a model from the schema
const Transaction = mongoose.model('Transaction', TransactionSchema);

// Routes
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/transactions', async (req, res) => {
    const transaction = new Transaction({
        date: req.body.date,
        type: req.body.type,
        amount: req.body.amount,
        category: req.body.category
    });

    try {
        const savedTransaction = await transaction.save();
        res.status(201).json(savedTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Starting the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
