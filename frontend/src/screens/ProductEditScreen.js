import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import {FormGroup, FormLabel, TableRow} from "@mui/material";
import {SwiperSlide} from "swiper/react";
import {Player} from "video-react";
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id


  const [countInStock, setCountInStock] = useState(0)
  const [chars, setChars] = useState([{key: '', value: ''}])
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  const [offer, setOffer] = useState('Новинка')
  const dispatch = useDispatch()
  const categoryList = useSelector((state) => state.categoryList)
  const [successChar, setSuccessChar] = useState('')


  const [name, setName] = useState('')
  const [price, setPrice] = useState(1)
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')

  const [brand, setBrand] = useState('')
  const [imagesArr, setImagesArr] = useState([])

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails
  const onChars = (e) => {
    e.preventDefault()
    let copy = Object.assign([], chars)
    let obj = {key, value}
    copy.push(obj)
    setChars(copy)
    setSuccessChar('Характеристика успешно добавлена')
  }
  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      history.push('/admin/productlist')
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
        setImagesArr(product.images)
        setChars(product.chars)
        console.log(categoryList)
      }
    }
  }, [dispatch, history, productId, product, successUpdate])

  const uploadFileHandler = async (e) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    const file = e.target.files[0]
    console.log(e.target.files)
    const newCopy = JSON.parse(JSON.stringify(e.target.files))
    let copy = Object.assign([], imagesArr)


    setUploading(true)
    let formData = new FormData()

    for (let i = 0; i < e.target.files.length; i++){

      formData.append('image', e.target.files[i])




    }
    let { data } = await axios.post('/api/upload', formData, config)
    for (let i = 0; i < data.length; i++){
      copy.push(data[i])
    }
    setUploading(false)

    setImagesArr(copy)
  }

  const deleteImage = (i) => {
    const copy = JSON.parse(JSON.stringify(imagesArr))
    delete copy[i]
    setImagesArr(copy)
  }

  const deleteChars = (i) => {
    const copy = JSON.parse(JSON.stringify(chars))
    delete copy[i]
    setChars(copy)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        images: imagesArr,
        brand,
        category,
        chars,
        description,
        countInStock,
      })
    )
  }

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'

              ></Form.Control>
              <Form.File
                id='image-file'
                label='Choose File'
                custom
                onChange={uploadFileHandler}
                multiple

              ></Form.File>
              {uploading && <Loader />}
              <TableRow>
                {imagesArr ? imagesArr.map((item, i) => {
                  if (item){
                    if ((item[item.length - 1] === '4') || (item[item.length - 1] === '3')){
                      return (

                          <Player>
                            <source src={`/${item}`} />
                            <DeleteIcon onClick={() => deleteImage(i)}/>
                          </Player>

                      )
                    } else {
                      return (

                          <>
                            <img style={{width: '300px'}} src={`/${item}`}/>
                            <DeleteIcon onClick={() => deleteImage(i)}/>
                          </>


                      )
                    }
                  }
                }) : <></>}
              </TableRow>
            </Form.Group>
            <FormGroup controlId='chars'>
              <FormLabel>Характеристики</FormLabel>
              <TableRow>
                <Col>
                  <Form.Control onChange={(e) => setKey(e.target.value)} value={key} type="text" placeholder="Ключ" />
                </Col>
                <Col>
                  <Form.Control onChange={(e) => setValue(e.target.value)} value={value} type="text" placeholder="Значение" />
                </Col>
                <Col>
                  <Button onClick={onChars} variant="primary" type="submit">
                    Добавить

                  </Button>
                </Col>
                <Col>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Ключ</TableCell>

                          <TableCell align="left">Значение</TableCell>
                          <TableCell align="left"></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {chars.map((char, i) => {
                          if( char){
                            return (
                                <TableRow
                                    key={char.key}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                  <TableCell component="th" scope="row">
                                    {char.key}
                                  </TableCell>
                                  <TableCell align="left">{char.value}</TableCell>
                                  <TableCell align="left">
                                    <DeleteIcon onClick={() => deleteChars(i)}/>
                                  </TableCell>


                                </TableRow>
                            )
                          }
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Col>
              </TableRow>
            </FormGroup>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <select onChange={(e) => setCategory(e.target.value)}>
              <option selected value={''}>{'Выберите категорию'}</option>
              {categoryList.categories.map((item) => {

                return <option value={item.name}>{item.name}</option>
              })}
            </select>
            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>



            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <textarea
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen
