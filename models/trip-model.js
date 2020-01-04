const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    googleid: String,
    username: String,
    idea: String,
    location: String,
    filename: String,
    createdTime: { type: Date, default: Date.now }
})

const Trip = mongoose.model('trip', tripSchema);
module.exports = Trip;