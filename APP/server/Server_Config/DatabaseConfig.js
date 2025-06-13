const mongoose = require('mongoose');

require('dotenv').config();

exports.dbConnect = () => {
    mongoose.connect(process.env.MONGO_DB_ATLAS_URL).then(
        () => {
            console.log('Database Connection Successfull');
        }
    ).catch(
        (err) => {
            console.log('Some Error Occurred while Connecting To DB');
            console.error(err);
        }
    )
};