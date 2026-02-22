const mongoose = require("mongoose");
const dotenv = require("dotenv");
const doctorModel = require("../schemas/docModel");
const connectToDB = require("../config/connectToDB");

dotenv.config();

const listAllDoctors = async () => {
    try {
        await connectToDB();
        const doctors = await doctorModel.find({});
        console.log(`Total Doctors: ${doctors.length}`);
        doctors.forEach(doc => {
            console.log(`Dr. ${doc.firstName} ${doc.lastName} | ID: ${doc._id} | Timings: ${JSON.stringify(doc.timings)}`);
        });
        process.exit();
    } catch (error) {
        console.log("Error:", error);
        process.exit(1);
    }
};

listAllDoctors();
