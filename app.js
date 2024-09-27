const express=require('express')
const cors = require('cors');
const config=require('./config/config.js')
const router=require('./config/router.js')
require('./config/cron.js')

const app=express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router)
const port = config.Port;

app.listen(port, () => {
    console.log("running on port :" + port);
});

