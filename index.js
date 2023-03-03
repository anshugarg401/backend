const connecttomongo = require('./db');
const express = require('express')
var cors = require('cors')
connecttomongo();


const app = express()
app.use(cors())

const port = 5000
app.use(express.json())

app.use('/api/auth', require("./routes/auth"));
app.use('/api/notes', require("./routes/notes"));

app.listen(port, () => {
  console.log(`inotebook app listening on port http://localhost:${port}`)
})