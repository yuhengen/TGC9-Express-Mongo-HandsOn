// EXPRESS AND SETUP
const express = require('express');
const { setupExpressApp } = require('./setupExpress');
const { setupHBS } = require('./setupHBS.js')
const MongoUtil = require('./MongoUtil.js');
const ObjectId = require('mongodb').ObjectId

// Load in Environment variables
require('dotenv').config();

// Create the app
const app = express();
setupExpressApp(app);
setupHBS();

async function main() {
    const MONGO_URL = process.env.MONGO_URL;
    await MongoUtil.connect(MONGO_URL, "tgc9_faults");

    // ROUTES
    const faultRoutes = require('./routes/faultRoutes')
    app.use('/fault', faultRoutes)
}

main();

// LISTEN
app.listen(3000, () => {
    console.log("Express is running")
})