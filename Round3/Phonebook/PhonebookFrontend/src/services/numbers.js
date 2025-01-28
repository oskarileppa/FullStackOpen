import axios from 'axios'
const baseUrl = '/api/persons'

/*
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}*/

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createNumber = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const updateNumber = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const deleteNumber = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

export default { 
  getAll, createNumber, updateNumber, deleteNumber
}