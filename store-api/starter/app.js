require('dotenv').config()
// async errors

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')
const router = require('./routes/products')

// middleware, if need to change respond to json, need to add .json()
app.use(express.json())

// router
app.get('/', (req,res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
})

app.use('/api/v1/products', router)

// products route

app.use(notFoundMiddleware)
app.use(errorMiddleware)


const start = async () => {
    try {
        //connect DB
        await connectDB(process.env.MONGODB_URI)
        app.listen(port, () => console.log(`Server is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()