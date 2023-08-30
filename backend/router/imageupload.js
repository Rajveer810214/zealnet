const express = require('express');
const cors = require('cors');
const multerConfig = require('../middleware/multerConfig'); // Import the multerConfig
const router = express.Router();
const cron = require('node-cron');
const fetchuser = require('../middleware/fetchuser');
const Stories = require('../models/Stories');
const User = require('../models/User');
router.use(cors());

cron.schedule('0 0 * * *', async () => {
  try {
    // Calculate the date one day ago from the current date
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    // Delete stories older than one day
    const result = await Story.deleteMany({ timestamp: { $lt: oneDayAgo } });
    console.log(`Deleted ${result.deletedCount} expired stories.`);
  } catch (error) {
    console.error('Error deleting expired stories:', error);
  }
});
// Set up storage for image uploads using Multer
router.post('/upload', multerConfig.single('image'), fetchuser, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const imageBuffer = req.file.buffer; // Get the image buffer data from req.file.buffer

  try {
    const story = await Stories.create({
      image: imageBuffer, // Save the image buffer in the database
      title: req.body.title,
      user: req.user.id,
    });



    res.status(200).json({ success: true, message: 'File uploaded successfully.', story });
  } catch (error) {
    console.error('Error occurred while processing the image:', error);
    return res.status(500).json({ error: 'Internal server error occurred' });
  }
});
router.get('/getimageall', async (req, res) => {
  try {
    const stories = await Stories.find().select('image user');

    const imageUrlsWithUserIds = stories.map(story => ({ image: story.image, userId: story.user }));

    const imageUrlsWithUserEmails = await Promise.all(
      imageUrlsWithUserIds.map(async story => {
        const user = await User.findById(story.userId).select('name');
        const userEmail = await User.findById(story.userId).select('email');

        return { image: story.image, name: user?.name || null,email:userEmail?.email||null};
      })
    );

    res.json(imageUrlsWithUserEmails);
  } catch (error) {
    console.error('Internal server error occurred:', error);
    res.status(500).json({ error: 'Internal server error occurred' });
  }
});

module.exports = router;

