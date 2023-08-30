const express = require('express')
const connectToMongo = require('./db');
connectToMongo();
const app = express();
app.use('/api/auth', require('./router/auth'));
app.use('/api/query', require('./router/imageupload'));
app.use('/api/notify', require('./router/sendNotification'));

app.listen(process.env.PORT, () => {
    console.log("App is listening on port 8000");
});
