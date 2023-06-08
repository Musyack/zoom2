import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import Category from "../models/categoryModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const createCategory = asyncHandler(async (req,res) => {
  const {name} = req.body
  const category = await new Category({name})

  const created = await category.save()
  res.status(201).json(created)
})


const deleteCategory = asyncHandler(async (req, res) => {

  const {name} = req.body
  const category = await Category.find({name})

  if (category) {
    await category[0].remove()
    res.json({ message: 'Category removed' })
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

const updateCategory = asyncHandler(async (req, res) => {
  const {name, newName} = req.body

  const category = await Category.find({name})

  if (category){
    category[0].name = newName
    const updatedCategory = await category[0].save()
    res.status(201).json(updatedCategory)
  }



})
const getCategories = asyncHandler(async (req,res) => {

  const categories = await Category.find()
  res.status(201).json(categories)
})


const getCategory = asyncHandler(async (req,res) => {
  const {name} = req.params
  const category = await Category.find({name})
  const finishProducts = category[0]



  res.status(201).json(finishProducts)
})
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1
  const {category} = req.query
  console.log(category)
  const keyword = req.query.keyword
      ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
      : {}
  if(category === 'all'){
    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
  }
  else {
    const count = await Product.countDocuments({ ...keyword, category })
    const products = await Product.find({ ...keyword, category })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
  }





})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    images: ['/images/sample.jpg'],
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
    chars: {key: '', value: ''}
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    images,
    brand,
    category,
    countInStock,
    chars
  } = req.body

  const product = await Product.findById(req.params.id)
  const isCategory = await Category.find({name: category})
  console.log(isCategory)
  if(!isCategory){
    console.log('bad')
    throw new Error('Такой категории не существует')
  }
  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.images = images
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    product.chars = chars

    isCategory[0].products.push(product)
    console.log(isCategory)
    const updatedCategory = await isCategory[0].save()
    const updatedProduct = await product.save()
    res.json(updatedCategory)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3)

  res.json(products)
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getCategory,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
}
