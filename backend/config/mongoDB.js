const mongoose = require('mongoose');
const { seedDatabase } = require('../controller/product.controller')

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Database Connected Successfully..!');
            seedDatabase();
        })
        .catch((err) => {
            if (err) {
                console.log('Error in Database Connection....\n', err);
            }
        })
}

module.exports = connectDB;