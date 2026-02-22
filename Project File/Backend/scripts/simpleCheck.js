const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const checkTimings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected!\n");

        // Get the schema-less collection
        const db = mongoose.connection.db;
        const doctors = await db.collection("doctors").find({}).toArray();

        doctors.forEach(doc => {
            console.log(`\n=== Dr. ${doc.firstName} ${doc.lastName} ===`);
            console.log(`Timings RAW:`, JSON.stringify(doc.timings, null, 2));
            console.log(`Type:`, typeof doc.timings);
            console.log(`Is Array:`, Array.isArray(doc.timings));

            if (Array.isArray(doc.timings)) {
                doc.timings.forEach((t, i) => {
                    console.log(`  [${i}]:`, t, `(type: ${typeof t})`);
                });

                // Test comparison
                const test = "16:00";
                console.log(`\nTest: "${test}" vs [${doc.timings[0]}, ${doc.timings[1]}]`);
                console.log(`  ${test} < ${doc.timings[0]} = ${test < doc.timings[0]}`);
                console.log(`  ${test} > ${doc.timings[1]} = ${test > doc.timings[1]}`);
                console.log(`  Result: ${test < doc.timings[0] || test > doc.timings[1] ? 'REJECT' : 'ACCEPT'}`);
            }
        });

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

checkTimings();
