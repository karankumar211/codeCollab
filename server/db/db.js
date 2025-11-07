const mongoose = require('mongoose');

// connect to MongoDB 
const connectDB = async () =>{
   const uri = process.env.MONGODBURI;
   await mongoose.connect(uri).then(()=>{
       console.log('Connected to MongoDB');
   }
    ).catch((err)=>{
         console.log('Error connecting to MongoDB', err);
    });
}

module.exports = connectDB;