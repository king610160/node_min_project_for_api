require('dotenv').config()

const { connect } = require('mongoose')
const connectDB = require('./db/connect')
const Product = require('./models/product')

const jsonProducts = require('./products.json')

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI)
        // if you want to delete origin data in mongodb, the use deleteMany
        await Product.deleteMany()
        await Product.create(jsonProducts)
        console.log('Success!!!')
        process.exit(0)
    } catch(error) {
        console.log(error)
        process.exit(1)
    }
}

start()