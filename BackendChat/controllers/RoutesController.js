const routes = require('../routes.json');

exports.getStaticRoutes = (req, res) => {
  try {
    console.log(routes,'routes')
    // Filter out the home route if you want to handle it separately
    const filteredRoutes = routes.filter(route => route.path !== '/');
    
    res.json({
      success: true,
      data: filteredRoutes,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to load routes',
      details: err.message
    });
  }
};

// Optional: Get a single route by ID
exports.getStaticRouteById = (req, res) => {
  try {
    const route = routes.find(r => r.id === req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }
    
    res.json({
      success: true,
      data: route
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to load route',
      details: err.message
    });
  }
};