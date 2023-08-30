const mongoose = require("mongoose")

var notificationSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    playerid: {
        type: String,
        unique:true,
        required: true,
    },

});
var notification = mongoose.model("Notification", notificationSchema);
module.exports = notification;