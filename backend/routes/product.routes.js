const express = require('express');
const router = express.Router();
const { seedDatabase, getAllProducts, getStats, getBarChartData, getPieChartData, getCombinedData } = require('../controller/product.controller');

router.get('/seed', seedDatabase);
router.get('/all', getAllProducts);
router.get('/stats', getStats);
router.get('/bar-chart', getBarChartData);
router.get('/pie-chart', getPieChartData);
router.get('/combined', getCombinedData);

module.exports = router;