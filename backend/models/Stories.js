const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  image: { type: Buffer, required: true }, // Specify that image is of type Buffer
  title: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now }, // Add a timestamp field to store the creation date and time
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
