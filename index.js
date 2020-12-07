// EXPRESS AND SETUP
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const MongoUtil = require('./MongoUtil.js');
const ObjectId = require('mongodb').ObjectId

// Load in Environment variables
require('dotenv').config();

// Create the app
const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))

// Setup template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// Handlebar Helpers
const helpers = require("handlebars-helpers")({
    handlebars: hbs.handlebars,
});

async function main() {
    const MONGO_URL = process.env.MONGO_URL;
    await MongoUtil.connect(MONGO_URL, "tgc9_faults");
    let db = MongoUtil.getDB();

    // ROUTES

    // READ database
    app.get('/', async (req, res) => {
        let faults = await db.collection('faults').find().toArray();
        res.render('faults', {
            'faultRecord': faults
        })
    })

    // CREATE
    // Display form for users to add faults
    app.get('/fault/add', (req, res) => {
        res.render("add_fault")
    })

    // Post form results to Database
    app.post('/fault/add', async (req, res) => {
        let { name, location, tags, block, reporter_name, reporter_email, date } = req.body;

        let newFaultRecord = {
            'name': name,
            'location': location,
            'tags': tags,
            'block': block,
            'reporter_name': reporter_name,
            'reporter_email': reporter_email,
            'date': date
        }

        await db.collection('faults').insertOne(newFaultRecord);
        res.redirect('/')
    })

    // Update form results
    app.get('/fault/:id/update', async (req, res) => {
        // 1. Fetch existing records, use findOne()
        let record = await db.collection('faults').findOne({
            '_id': ObjectId(req.params.id)
        })

        // 2. Pass existing record to HBS file
        res.render('edit_fault', {
            'record':record
        })
    })

    app.post('/fault/:id/update', async (req,res) => {
        let { name, location, tags, block, reporter_name, reporter_email, date } = req.body;

        let newFaultRecord = {
            'name':name,
            'location':location,
            'tags':tags,
            'block':block,
            'reporter_name':reporter_name,
            'reporter_email':reporter_email,
            'date':new Date(date)
        }

        db.collection('faults').updateOne({
            '_id':ObjectId(req.params.id)
        }, {
            '$set': newFaultRecord
        });

        res.redirect('/')
    })

    app.get('/food/:id/delete', async (req,res)=> {
        let faultRecord = await db.collection('faults').findOne({
            '_id':ObjectId(req.params.id)
        })
        res.render('confirm_delete_fault', {
            'record':faultRecord
        })
    })
}

main();

// LISTEN
app.listen(3000, () => {
    console.log("Express is running")
})