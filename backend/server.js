const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/mongoDB');
const productRoutes = require('./routes/product.routes');

app.get('/', (req, res, next) => {
    res.json({ message: "Roxiler Backend Server", status: 'Active', time: new Date() })
})

app.use(express.json());
app.use(cors());
app.use('/api/products/', productRoutes);

//connect to Database
connectDB();

app.listen(port, (err) => {
    if (!err) {
        console.log(`Server is Running on port ${port}..!`);
    }
})