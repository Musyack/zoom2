import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import { listTopProducts } from '../actions/productActions'
import slider1 from '../assets/img/slider-1.jpg'
import slider4 from '../assets/img/slider-4.jpg'
import slider6 from '../assets/img/slider-6.jpg'
import slider7 from '../assets/img/slider-7.jpg'
import slider5 from '../assets/img/slider-5.jpg'


const ProductCarousel = () => {
  const dispatch = useDispatch()

  const productTopRated = useSelector((state) => state.productTopRated)
  const { loading, error, products } = productTopRated

  useEffect(() => {
    dispatch(listTopProducts())
  }, [dispatch])

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <Carousel variant={'dark'} pause='hover' className='bg-dark'>

        <Carousel.Item>

            <Image src={slider1} alt={'slider1'} fluid />

        </Carousel.Item>
      <Carousel.Item>

        <Image src={slider4} alt={'slider1'} fluid />

      </Carousel.Item>
      <Carousel.Item>

        <Image src={slider5} alt={'slider1'} fluid />

      </Carousel.Item>
      <Carousel.Item>

        <Image src={slider6} alt={'slider1'} fluid />

      </Carousel.Item>
      <Carousel.Item>

        <Image src={slider7} alt={'slider1'} fluid />

      </Carousel.Item>

    </Carousel>
  )
}

export default ProductCarousel
