// EXPRESS AND SETUP
const express = require('express');
const MongoUtil = require('../MongoUtil.js');
const ObjectId = require('mongodb').ObjectId
const router = express.Router();

let db = MongoUtil.getDB();

// READ database
router.get('/', async (req, res) => {
    let faults = await db.collection('faults').find().toArray();
    res.render('fault', {
        'faultRecord': faults
    })
})

// CREATE
// Display form for users to add faults
router.get('/add', (req, res) => {
    res.render("add_fault")
})

// Post form results to Database
router.post('/add', async (req, res) => {
    let { name, location, tags, block, reporter_name, reporter_email, date } = req.body;

    if (!Array.isArray(tags)) {
        if (!tags) {
            tags = []
        } else {
            tags = ['tags']
        }
    }

    if (!block) {
        block = "304";
    }

    let newFaultRecord = {
        'name': name,
        'location': location,
        'tags': tags,
        'block': block,
        'reporter_name': reporter_name,
        'reporter_email': reporter_email,
        'date': new Date(date)
    }

    await db.collection('faults').insertOne(newFaultRecord);
    req.flash('success_messages', 'New fault has been added to the records')
    res.redirect('/fault')
})

// Update form results
router.get('/:id/update', async (req, res) => {
    // 1. Fetch existing records, use findOne()
    let record = await db.collection('faults').findOne({
        '_id': ObjectId(req.params.id)
    })

    // 2. Pass existing record to HBS file
    res.render('edit_fault', {
        'record': record
    })
})

router.post('/:id/update', async (req, res) => {
    let { name, location, tags, block, reporter_name, reporter_email, date } = req.body;

    let newFaultRecord = {
        'name': name,
        'location': location,
        'tags': tags,
        'block': block,
        'reporter_name': reporter_name,
        'reporter_email': reporter_email,
        'date': new Date(date)
    }

    db.collection('faults').updateOne({
        '_id': ObjectId(req.params.id)
    }, {
        '$set': newFaultRecord
    });

    req.flash('success_messages', 'Fault record has been updated')
    res.redirect('/fault')
})

// DELETE FAULT
router.get('/:id/delete', async (req, res) => {
    let faultRecord = await db.collection('faults').findOne({
        '_id': ObjectId(req.params.id)
    })
    res.render('confirm_delete_fault', {
        'record': faultRecord
    })
})

router.post('/:id/delete', async (req, res) => {
    await db.collection('faults').deleteOne({
        '_id': ObjectId(req.params.id)
    })
    req.flash('error_messages', "Fault record has been deleted");
    res.redirect('/fault')
})

module.exports = router;