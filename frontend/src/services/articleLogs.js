import axiosInstance from '../api/axiosInstance';
const baseUrl = '/api/articlelogs';

const getAll = async () => {
  const request = axiosInstance.get(baseUrl);
  return request.then(response => response.data);
};

const create = async newObject => {
  const response = await axiosInstance.post(baseUrl, newObject);
  return response.data;
};

const update = async updatedObject => {
  const response = await axiosInstance.put(
    `${baseUrl}/${updatedObject.id}`,
    updatedObject
  );
  return response.data;
};

export default { getAll, create, update };
