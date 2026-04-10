import axiosInstance from '../api/axiosInstance';
const baseUrl = '/api/books';

const getAll = () => {
  const request = axiosInstance.get(baseUrl);
  return request.then(response => response.data);
};

const create = async newObject => {
  const response = await axiosInstance.post(baseUrl, newObject);
  return response.data;
};

const update = async updatedObject => {
  const response = await axiosInstance.put(`${baseUrl}/${updatedObject.id}`, updatedObject);
  return response.data;
};

const remove = async id => {
  await axiosInstance.delete(`${baseUrl}/${id}`);
};

export default { getAll, create, update, remove };
