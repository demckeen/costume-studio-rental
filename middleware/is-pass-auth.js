const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated - missing Authentication Headers.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  const loadedUser = await User.findbyId(req.userId);
  if(!loadedUser) {
    const error = new Error('No user found.');
    error.statusCode = 404;
    throw error;
  }
  const currentPass = loadedUser.password;

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, `secretpasswordsauce${currentPass}`)
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};