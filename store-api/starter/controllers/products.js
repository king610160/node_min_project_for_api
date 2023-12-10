const Product = require('../models/product')


const getAllProductsStatic = async(req, res) => {
    const products = await Product.find({price: { $gt: 30 }})
        .sort('price')
        .select('name price')
        .limit(4)
    res.status(200).json({products, nbHits: products.length})
}

const getAllProducts = async(req, res) => {
    const { featured, company, name, sort, field, numericFilters } = req.query
    const queryObject = {}

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if (company) queryObject.company = company

    // regex是正則表達式，options中的i表不用分大小寫
    if (name) queryObject.name = {$regex: name, $options: 'i'}

    if (numericFilters) {
        const operatorMap = {
            '>' : '$gt',
            '>=' : '$gte',
            '=' : '$eq',
            '<' : '$lt',
            '<=' : '$ltq',
        }
        const regex = /\b(>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(
            regex,
            (match) => `-${operatorMap[match]}-`
        )
        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if(options.includes(field)) {
                queryObject[field] = { [operator]: Number(value)}
            }
        })
    }

    console.log(queryObject)
    let result = Product.find(queryObject)

    // since sort is optional, if user don't sort, then sort with createAt
    // string pass in will be "name,price" ; we need to transfer it to "name price", and sort it
    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('createdAt')
    }

    // use select to select certain type of data
    if (field) {
        const fieldsList = field.split(',').join(' ')
        result = result.select(fieldsList)
    }

    // page is pagnation, limit is limit data searching, skip is jump througn how many data
    // skip is for human
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({products, nbHits: products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}