const express = require('express')
const app = express()
const port = 3000

// serve Angular content
app.use(express.static('dist/Resume'))

// server AngularJS content
app.use('/old', express.static('webapp'))

app.listen(port, () => {
  console.log(`The app is listening at http://localhost:${port}`)
})