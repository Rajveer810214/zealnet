const mongoose = require("mongoose")

var friendSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});
var addFriend = mongoose.model("addFriend", friendSchema);
module.exports = addFriend;