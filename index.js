require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT || 5000
const sequilize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const fileUpload = require('express-fileupload')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)


//Обработка ошибок
app.use(errorHandler)


const start = async () => {
    try{

        await sequilize.authenticate()
        await sequilize.sync()
        app.listen(PORT, ()=> console.log(`Server started on port: ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}


start()