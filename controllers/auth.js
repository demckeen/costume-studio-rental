// AUTH CONTROLLER

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Place Controller functions here:

// PUT EXPORTS:

//Create a User
exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPw,
      name: name
    });

    const result = await user.save();
    res.status(201).json({ message: 'User created!', userId: result._id });
  } catch {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


// POST EXPORTS:

// User Login
exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  let isAdmin;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      { 
        email: loadedUser.email, 
        userId: loadedUser._id.toString()
      }, 
      'KateJenDanaHaileyJamieJennifer', 
      { expiresIn: '1h' }
    );

    if(loadedUser.admin) {
      isAdmin = loadedUser.admin;
    }
    else {
      isAdmin = false;
    }
    console.log(loadedUser.admin);

    res.status(200).json({ message: 'Logged in successfully.', token: token, 
      userId: loadedUser._id.toString(), isAdmin: isAdmin });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// WORKING RESET PASSWORD METHODS USING TOKEN METHOD FROM THE SHOP VIDEOS - SEE BELOW FOR OTHER VERSIONS

// TODO: This route works using the token method used in shop instead of jwt/is-pass-auth middleware
// Reset Password
// exports.postReset = (req, res, next) => {
//   crypto.randomBytes(32, (err, buffer) => {
//     const token = buffer.toString('hex');
//     User.findOne({email: req.body.email})
//       .then(user => {
//         if (!user) {
//           const error = new Error('User not found.');
//           error.statusCode = 404;
//           throw error;
//         }
//       user.resetToken = token;
//       user.resetTokenExpiration = Date.now() + 3600000;
//       return user.save();
//       })
//       .then(result => {
//         //send email? link provided will be http://localhost:3000/reset/${token}
//         res.status(200).json({ 
//           message: 'Password reset request authorized', token: token 
//         });
//     })
//     .catch (err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       return next(err);
//     });
//   });
// };

// TODO: This route works using the token method used in shop instead of jwt/is-pass-auth middleware
//Create new password
// exports.postNewPassword = async (req, res, next) => {
//   const newPassword = req.body.password;
//   const userId = req.body.userId;
//   const passwordToken = req.body.passwordToken;
//   try {
//     const resetUser = await User.findOne({
//       resetToken: passwordToken, 
//       resetTokenExpiration: { $gt: Date.now() },
//       _id: userId
//     });
//     const hashedPassword = await bcrypt.hash(newPassword, 12);
//     resetUser.password = hashedPassword;
//     resetUser.resetToken = undefined;
//     resetUser.resetTokenExpiration = undefined;
//     await resetUser.save();
//     res.status(200).json({ message: 'Password reset successfully', userId: resetUser._id.toString() });
//   } catch {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// OLDER VERSIONS - WILL WORK WITHOUT MIDDLEWARE BUT NO TOKEN WITH EXPIRATION GETS PASSED

// // TODO: Older version - This route works if not using the is-pass-auth middleware
// // Reset Password
exports.postReset = async (req, res, next) => {
  let loadedUser;
    try {
      console.log(req.body.email);
      const user = await User.findOne({email: req.body.email});
      if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
      }
      loadedUser = user; 
      const token = jwt.sign(
        { 
          email: loadedUser.email, 
          userId: loadedUser._id.toString()
        }, 
        'secretpasswordsauce', 
        { expiresIn: '20m' }
      );

      //send email? link provided will be http://localhost:3000/reset/${token}

      res.status(200).json({ message: 'Password reset request authorized', token: token, userId: loadedUser._id.toString() });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }


// TODO: This route currently does not work. Do we even really need it if it is for the frontend? 
// Prior to rendering reset password form, frontend is verifying status of url parameter, :tokenId
// exports.isPassLinkAuth = async (req, res, next) => {
//   const token = tokenId;
//   const userId  = await jwt.decode(token.userId);
//   try {
//     const passUser = await User.findById(userId);
//     if(!passUser) {
//       const error = new Error('No user found.');
//       error.statusCode = 404;
//       throw error;
//     }
//     const currentPass = passUser.password;
//     const decodedToken = jwt.verify(token, `secretpasswordsauce${currentPass}`)
//     if(!decodedToken) {
//       const error = new Error('Not authenticated.');
//       error.statusCode = 401;
//       throw error;
//     }
//     //authentication reply allows frontend to render "set password" form with added layer of security
//     res.status(200).json({message: 'User authenticated.', userId: req.userId.toString()})}
    
//     catch {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     }
//   };

// TODO: Older version - This route works if not using the is-pass-auth middleware
//Create new password
exports.postNewPassword = async (req, res, next) => {
  const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error = new Error('Not authenticated - missing Authentication Headers.');
      error.statusCode = 401;
      throw error;
    }
  try { 
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try { decodedToken = jwt.verify(token, 'secretpasswordsauce')}
    catch (err) {
      err.statusCode = 500;
      throw err;}
    if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
    }
    const userId  = decodedToken.userId;
        const passUser = await User.findById(userId);
        if(!passUser) {
          console.log(userId);
          const error = new Error('No user found.');
          error.statusCode = 404;
          throw error;
        }
    const newPassword = req.body.password;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    passUser.password = hashedPassword;

    await passUser.save();
    res.status(200).json({ message: 'Password reset successfully', userId: userId });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
