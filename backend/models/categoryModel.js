import mongoose from 'mongoose'

const categorySchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        products: {
            type: mongoose.Schema.Types.Array,
            required: false,
            ref: "Product",
        }
    }

)

const Category = mongoose.model('Category', categorySchema)

export default Category
