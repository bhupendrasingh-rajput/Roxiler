const mongoose = require('mongoose');
const Product = require('../models/products');

const seedDatabase = async () => {
    try {
        const data = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const seedProducts = await data.json();
        await Product.deleteMany({});
        await Product.insertMany(seedProducts).then(() => { return console.log('Database Seeding Completed...') });
    } catch (error) {
        console.log('Error in Database Seeding !\n', error);
        res.status(500).json({ Message: 'Error in Database Seeding' })
    }
};

const getAllProducts = async (req, res) => {
    try {
        const limit = 10;
        const { search, month } = req.query;
        const page = req.query.page - 1 || 0;
        let filter = {};

        if (search) {
            filter = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { price: !isNaN(Number(search)) ? Number(search) : null },
                ],
            };
        }

        if (month) {
            filter = {
                ...filter,
                $expr: { $eq: [{ $month: '$dateOfSale' }, month] },
            };
        }

        const products = await Product.find(filter).skip(page * limit).limit(limit);

        res.json(products);
    } catch (error) {
        console.log('Error in Product Fetching !\n', error);
        res.status(500).json({ Message: 'Error in Product Fetching !' })
    }
}

const getStats = async (req, res) => {
    try {
        const { month } = req.query;
        const products = (await Product.find({ $expr: { $eq: [{ $month: '$dateOfSale' }, month] } }))
        let soldItems = 0, unsoldItems = 0, sellAmount = 0;
        products.map(prod => {
            prod.sold ? soldItems++ : unsoldItems++;
            sellAmount += prod.price;
        });
        res.json({ sellAmount, soldItems, unsoldItems });
    } catch (error) {
        console.log('Error in Stats Fetching !\n', error);
        res.status(500).json({ Message: 'Error in Stats Fetching !' })
    }
}

const getBarChartData = async (req, res) => {
    try {
        const { month } = req.query;
        if (!month) { return res.status(200).json({ message: 'Value For Month Not Found!' }) };
        const products = await Product.find({ $expr: { $eq: [{ $month: '$dateOfSale' }, month] } });
        const barChartData = { '0-100': 0, '101-200': 0, '201-300': 0, '301-400': 0, '401-500': 0, '501-600': 0, '601-700': 0, '701-800': 0, '801-900': 0, '901 Above': 0 };
        products.map(prod => {
            if (prod.price >= 0 && prod.price <= 100) { barChartData['0-100'] += 1; }
            else if (prod.price >= 101 && prod.price <= 200) { barChartData['101-200'] += 1; }
            else if (prod.price >= 201 && prod.price <= 300) { barChartData['201-300'] += 1; }
            else if (prod.price >= 301 && prod.price <= 400) { barChartData['301-400'] += 1; }
            else if (prod.price >= 401 && prod.price <= 500) { barChartData['401-500'] += 1; }
            else if (prod.price >= 501 && prod.price <= 600) { barChartData['501-600'] += 1; }
            else if (prod.price >= 601 && prod.price <= 700) { barChartData['601-700'] += 1; }
            else if (prod.price >= 701 && prod.price <= 800) { barChartData['701-800'] += 1; }
            else if (prod.price >= 801 && prod.price <= 900) { barChartData['801-900'] += 1; }
            else if (prod.price >= 901) { barChartData['901 Above'] += 1; }
        })
        res.json(barChartData);
    } catch (error) {
        console.log('Error in Bar Chart Data Fetching !\n', error);
        res.status(500).json({ Message: 'Error in Bar Chart Data Fetching !' })
    }
}


const getPieChartData = async (req, res) => {
    try {
        const { month } = req.query;
        if (!month) { return res.status(200).json({ message: 'Value For Month Not Found!' }) };
        const products = (await Product.find({ $expr: { $eq: [{ $month: '$dateOfSale' }, month] } }))
        const pieChartData = {};
        products.map(prod => {
            pieChartData[prod.category] = pieChartData[prod.category] + 1 || 0;
        })
        res.json(pieChartData);
    } catch (error) {
        console.log('Error in Pie Chart Data Fetching !\n', error);
        res.status(500).json({ Message: 'Error in Pie Chart Data Fetching !' })
    }
}

const getCombinedData = async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) { return res.status(400).json({ message: 'Value for month not found!' }) }


        const statsResponse = await fetch(`http://localhost:5000/api/products/stats?month=${month}`)
            .then(data => data.json()).catch(err => err);

        const barChartDataResponse = await fetch(`http://localhost:5000/api/products/bar-chart?month=${month}`)
            .then(data => data.json()).catch(err => err);

        const pieChartDataResponse = await fetch(`http://localhost:5000/api/products/pie-chart?month=${month}`)
            .then(data => data.json()).catch(err => err);

        res.json({ statsResponse, barChartDataResponse, pieChartDataResponse });
    } catch (error) {
        console.error('Error fetching combined data:', error);
        res.status(500).json({ message: 'Error fetching combined data!' });
    }
};

module.exports = { seedDatabase, getAllProducts, getStats, getBarChartData, getPieChartData, getCombinedData };