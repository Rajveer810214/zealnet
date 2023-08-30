const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());
const Notification = require('../models/notification');
router.use(express.json());
router.post('/notifications', async (req, res) => {
    try {
      const { email, playerid,name } = req.body;
  
      // Create a new notification document and save it to the database
      const newNotification = await Notification.create({ name,email, playerid });
      await newNotification.save();
  
      // Set success to true if the notification is successfully saved
      const success = true;
  
      // Return a 201 (Created) status code for successful creation
      console.log(newNotification)
      res.status(201).json({ success: 'Player ID saved successfully', data: newNotification });
    } catch (error) {
      console.error('Error saving player ID:', error);
  
      // Return a 500 (Internal Server Error) status code for any unexpected errors
      res.status(500).json({ success: 'Player ID could not be saved', error: error.message });
    }
  });
  
router.get('/getplayerid',async(req,res)=>{
    const notification=await Notification.find();
    success = true;
        res.status(200).json({ success: notification });
})

module.exports = router;