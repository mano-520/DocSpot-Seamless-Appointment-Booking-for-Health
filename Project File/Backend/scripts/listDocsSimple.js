const mongoose = require("mongoose");
const dotenv = require("dotenv");
const doctorModel = require("../schemas/docModel");
const connectToDB = require("../config/connectToDB");

dotenv.config();

const listDocs = async () => {
    try {
        await connectToDB();
        const doctors = await doctorModel.find({});
        console.log("--------------------------------------------------");
        console.log(`Total Doctors Found: ${doctors.length}`);
        doctors.forEach(doc => {
            console.log(`Name: ${doc.firstName} ${doc.lastName}`);
            console.log(`Timings: ${JSON.stringify(doc.timings)}`);
            console.log("--------------------------------------------------");
        });
        setTimeout(() => { process.exit(0); }, 1000);
    } catch (error) {
        console.log("Error:", error);
        process.exit(1);
    }
};

listDocs();
