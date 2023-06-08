import React, {useEffect, useState} from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'
import axios from "axios";
import Loader from "../components/Loader";
import {USER_DETAILS_RESET} from "../constants/userConstants";
import {ORDER_CREATE_RESET} from "../constants/orderConstants";
import {createOrder} from "../actions/orderActions";

const PaymentScreen = ({ history }) => {

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)

  if (!cart.shippingAddress.address) {
    history.push('/shipping')
  }
  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  cart.itemsPrice = addDecimals(
      cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))
  cart.totalPrice = (
      Number(cart.itemsPrice) +
      Number(cart.shippingPrice) +
      Number(cart.taxPrice)
  ).toFixed(2)

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`)
      dispatch({ type: USER_DETAILS_RESET })
      dispatch({ type: ORDER_CREATE_RESET })
    }
    // eslint-disable-next-line
  }, [history, success])



  const [paymentMethod, setPaymentMethod] = useState('PayPal')
  const [imagesArr, setImagesArr] = useState([])


  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(imagesArr))
    dispatch(
        createOrder({
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
          files: imagesArr
        })
    )

  }
  const [uploading, setUploading] = useState(false)
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

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Upload your documents</h1>
      <Form onSubmit={submitHandler}>

        <Form.Group controlId='image'>
          <Form.Label>We will contact you soon</Form.Label>

          <Form.File
              id='image-file'
              label='Choose File'
              custom
              onChange={uploadFileHandler}
              multiple
          ></Form.File>
          {uploading && <Loader />}
        </Form.Group>
        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen
