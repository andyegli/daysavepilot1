// middlewares/auth.js
/**
 * Middleware to require authentication
 * If user is not authenticated, redirect to login page
 */
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    
    // Save the URL the user is trying to access
    if (req.method === 'GET') {
      req.session.returnTo = req.originalUrl;
    }
    
    res.redirect('/login');
  };
  
  /**
   * Middleware for routes that should only be accessible when NOT logged in
   * For example, login and register pages should not be accessible when already logged in
   */
  exports.isNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    
    res.redirect('/dashboard');
  };