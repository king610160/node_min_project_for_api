const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        // first is required or not, second is costume message
        required:[true,'product name must be provided']
    },
    price:{
        type:Number,
        // first is required or not, second is costume message
        required:[true,'product price must be provided']
    },
    featured:{
        type:Boolean,
        default:false
    },
    rating:{
        type:Number,
        default: 4.5
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    company:{
        type: String,
        enum: {
            values: ['ikea','liddy','caressa','marcos'],
            message: '{VALUE} is not supported'
        }
        // enum:['ikea','liddy','caressa','marcos']
    }
})

module.exports = mongoose.model('Product', productSchema)