const express = require('express');
const router = express.Router();
const staticRoutesController = require('../controllers/RoutesController');

// Get all static routes
router.get('/routes', staticRoutesController.getStaticRoutes);

// Get single static route by ID
router.get('/routes/:id', staticRoutesController.getStaticRouteById);

module.exports = router;