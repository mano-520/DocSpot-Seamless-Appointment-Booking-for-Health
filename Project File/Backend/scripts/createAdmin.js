const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userModel = require("../schemas/userModel");
const connectToDB = require("../config/connectToDB");
const bcrypt = require("bcryptjs");

dotenv.config();

const createAdmin = async () => {
    try {
        await connectToDB();

        const email = "admin@example.com";
        let user = await userModel.findOne({ email });

        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("123456", salt);
            user = new userModel({
                name: "Admin User",
                email: email,
                password: hashedPassword,
                phone: "0000000000",
                isAdmin: true,
                isDoctor: false,
            });
            await user.save();
            console.log("Admin User Created Successfully");
        } else {
            console.log("Admin User already exists");
            if (!user.isAdmin) {
                user.isAdmin = true;
                await user.save();
                console.log("Updated existing user to Admin");
            }
        }

        console.log("Login with: admin@example.com / 123456");
        process.exit();
    } catch (error) {
        console.log("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
