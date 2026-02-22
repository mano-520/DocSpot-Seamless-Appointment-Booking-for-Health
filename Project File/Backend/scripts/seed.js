const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userModel = require("../schemas/userModel");
const doctorModel = require("../schemas/docModel");
const connectToDB = require("../config/connectToDB");
const bcrypt = require("bcryptjs");

dotenv.config();

const seedData = async () => {
    try {
        await connectToDB();

        // 1. Find or Create User
        let user = await userModel.findOne({ email: "testdoctor@example.com" });
        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("123456", salt);
            user = new userModel({
                name: "Test Doctor",
                email: "testdoctor@example.com",
                password: hashedPassword,
                phone: "1234567890",
                isDoctor: true,
                isAdmin: false,
            });
            await user.save();
            console.log("Created Test User");
        } else {
            console.log("Test User already exists");
            // Ensure isDoctor is true
            user.isDoctor = true;
            await user.save();
        }

        // 2. Find or Create Doctor Profile
        let doctor = await doctorModel.findOne({ userId: user._id });
        if (!doctor) {
            doctor = new doctorModel({
                userId: user._id,
                firstName: "Test",
                lastName: "Doctor",
                phone: "1234567890",
                email: "testdoctor@example.com",
                website: "www.testdoc.com",
                address: "123 Test St",
                specialization: "Cardiology",
                experience: "5 Years",
                feesPerCunsaltation: 500,
                status: "approved", // Auto-approved
                timings: ["09:00", "17:00"],
            });
            await doctor.save();
            console.log("Created Test Doctor Profile");
        } else {
            console.log("Doctor Profile already exists");
            doctor.status = "approved";
            await doctor.save();
        }

        console.log("Seeding Completed. You can now login with testdoctor@example.com / 123456");
        process.exit();
    } catch (error) {
        console.log("Seeding Failed:", error);
        process.exit(1);
    }
};

seedData();
