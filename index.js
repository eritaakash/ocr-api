const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cors = require('cors');
app.use(cors());

const fs = require('fs');
const apiDir = fs.readdirSync('./api');

apiDir.forEach((file) => {
    const route = require(`./api/${file}`);
    app.use('/api', route);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));


process.on('unhandledRejection', (err) => {
    console.log('[*]; Unhandled Rejection.');
});

process.on('uncaughtException', (err) => {
    console.log('[*]; Uncaught Exception thrown.');
});