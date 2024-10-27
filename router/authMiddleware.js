// authMiddleware.js

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
      return next(); // Proceed if user is authenticated
    }
    res.redirect('/login.html'); // Redirect to login if not authenticated
  }
  
  module.exports = isAuthenticated;
  