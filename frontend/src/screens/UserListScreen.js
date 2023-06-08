import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listUsers, deleteUser } from '../actions/userActions'
import axios from "axios";
import FormContainer from "../components/FormContainer";
import {useState} from "react";
import {getCategories} from "../actions/productActions";


const UserListScreen = ({ history }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getCategories())
  }, [])
  const userList = useSelector((state) => state.userList)
  const { loading, error, users } = userList
  const categoryList = useSelector((state) => state.categoryList)
  const [name, setName] = useState('')

  console.log(categoryList)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDelete = useSelector((state) => state.userDelete)
  const { success: successDelete } = userDelete

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, successDelete, userInfo])

  const deleteCategory = async (name) => {
    if (window.confirm('Are you sure')) {
      await axios.post(`/api/products/category/delete`, {name})
    }
  }
  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteUser(id))
    }
  }

  const submitHandler = async (e) => {
    await axios.post('/api/products/category/', {name})
  }




  return (
    <>
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>ADMIN</th>

              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.phone}
                </td>
                <td>
                  {user.isAdmin ? (
                      <i className='fas fa-check' style={{ color: 'green' }}></i>
                  ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(user._id)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <h1>Categories</h1>
      {loading ? (
          <Loader />
      ) : error ? (
          <Message variant='danger'>{error}</Message>
      ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th></th>

            </tr>
            </thead>
            <tbody>
            {categoryList.categories.map((category) => (
                <tr key={category._id}>
                  <td>{category._id}</td>
                  <td>{category.name}</td>
                  <td>

                    <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteCategory(category.name)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>



                </tr>
            ))}
            </tbody>
          </Table>
      )}
      <>

        <FormContainer>
          <h1>Add Category</h1>

          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                  onChange={(e) => setName(e.target.value)}
                  type='name'
                  placeholder='Enter name'
                  value={name}

              ></Form.Control>
            </Form.Group>



            <Button type='submit' variant='primary'>
              Submit
            </Button>
          </Form>

        </FormContainer>
      </>
    </>
  )
}

export default UserListScreen
