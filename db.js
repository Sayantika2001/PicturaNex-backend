const mongoose = require('mongoose');

const connectDB = async () =>{
    try {
        const conn = await mongoose.connect('mongodb+srv://PicturaNex:PicturaNex01@picturanex.ms155w4.mongodb.net/User');
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
module.exports = connectDB;