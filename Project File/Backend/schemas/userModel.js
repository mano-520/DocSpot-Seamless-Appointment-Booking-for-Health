const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minLength: 3,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isDoctor: {
        type: Boolean,
        default: false,
    },
    notification: {
        type: Array,
        default: [],
    },
    seennotification: {
        type: Array,
        default: [],
    },
    status: {
        type: String,
        default: "active",
    },
}, { timestamps: true });

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
