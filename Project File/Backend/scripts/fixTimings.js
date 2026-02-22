const mongoose = require("mongoose");
const dotenv = require("dotenv");
const doctorModel = require("../schemas/docModel");
const connectToDB = require("../config/connectToDB");

dotenv.config();

const fixTimings = async () => {
    try {
        await connectToDB();

        const doctors = await doctorModel.find({});
        console.log(`Found ${doctors.length} doctors.`);

        for (const doc of doctors) {
            if (!doc.timings || doc.timings.length < 2 || doc.timings[0] === "00:00") {
                console.log(`Fixing timings for Dr. ${doc.firstName} ${doc.lastName}`);
                doc.timings = ["09:00", "17:00"];
                await doc.save();
            } else {
                console.log(`Timings for Dr. ${doc.firstName} ${doc.lastName} are okay: ${doc.timings}`);
            }
        }

        console.log("Timings fixed.");
        process.exit();
    } catch (error) {
        console.log("Error fixing timings:", error);
        process.exit(1);
    }
};

fixTimings();
