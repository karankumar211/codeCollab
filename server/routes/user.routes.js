const app = require('express').Router();
const {registerUser, loginUser, logoutUser, getUser} = require('../controllers/user.controller');
const verifyToken = require('../middlewares/user.middleware');
// create api for user 

app.post('/register', registerUser );
app.post('/login', loginUser );
app.post('/logout',verifyToken, logoutUser);

// other routes 
app.post('/profile', verifyToken, (req, res)=>{
    res.status(200).json({message: 'user profile', user: req.user});
});

app.get('/me', verifyToken,getUser ); 

module.exports = app;