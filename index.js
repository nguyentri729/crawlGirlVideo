const express = require("express");
const app = express();
const girlRoute = require('./routes/girl.route')
const cors = require('cors')

app.use(cors())

app.use('/girl', girlRoute)

app.listen(6969);


