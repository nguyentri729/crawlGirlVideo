const express = require("express");
const app = express();
const girlRoute = require('./routes/girl.route')

app.use('/girl', girlRoute)

app.listen(3000);
