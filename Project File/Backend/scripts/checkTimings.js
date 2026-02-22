const mongoose = require("mongoose");
require("dotenv").config();

const checkDoctorTimings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB\n");

        const doctorModel = mongoose.model("doctors");
        const doctors = await doctorModel.find({});

        doctors.forEach(doc => {
            console.log(`\n=== Dr. ${doc.firstName} ${doc.lastName} ===`);
            console.log(`Timings:`, doc.timings);
            console.log(`Timings Type:`, typeof doc.timings);
            console.log(`Is Array:`, Array.isArray(doc.timings));

            if (Array.isArray(doc.timings) && doc.timings.length > 0) {
                console.log(`First element:`, doc.timings[0]);
                console.log(`First element type:`, typeof doc.timings[0]);
                console.log(`First element JSON:`, JSON.stringify(doc.timings[0]));

                if (doc.timings.length > 1) {
                    console.log(`Second element:`, doc.timings[1]);
                    console.log(`Second element type:`, typeof doc.timings[1]);
                    console.log(`Second element JSON:`, JSON.stringify(doc.timings[1]));
                }

                // Test comparison
                const testTime = "16:00";
                console.log(`\nTest comparison with "${testTime}":`);
                console.log(`  ${testTime} < ${doc.timings[0]} = ${testTime < doc.timings[0]}`);
                console.log(`  ${testTime} > ${doc.timings[1]} = ${testTime > doc.timings[1]}`);
            }
        });

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkDoctorTimings();
