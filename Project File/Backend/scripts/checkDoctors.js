const mongoose = require("mongoose");
const dotenv = require("dotenv");
const doctorModel = require("../schemas/docModel");
const connectToDB = require("../config/connectToDB");

dotenv.config();

const checkDoctors = async () => {
    try {
        await connectToDB();
        const doctors = await doctorModel.find({});
        console.log(`Found ${doctors.length} doctors in the database.`);
        if (doctors.length > 0) {
            console.log("First doctor:", doctors[0]);
        } else {
            console.log("No doctors found. Please apply for a doctor account via the frontend first.");
        }
        process.exit();
    } catch (error) {
        console.log("Error checking doctors:", error);
        process.exit(1);
    }
};

checkDoctors();
