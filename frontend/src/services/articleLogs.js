import axiosInstance from '../api/axiosInstance';
const baseUrl = '/api/articlelogs';

const getAll = () => {
  const request = axiosInstance.get(baseUrl);
  return request.then(response => response.data);
};

const create = async newObject => {
  const response = await axiosInstance.post(baseUrl, newObject);
  return response.data;
};

export default { getAll, create };
