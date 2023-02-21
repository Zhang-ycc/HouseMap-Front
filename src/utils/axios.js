/* eslint-disable prettier/prettier */
import _axios from 'axios';

const axios = baseURL => {
  return _axios.create({
    baseURL: baseURL || 'http://124.71.172.246:80',
    timeout: 5000,
    changeOrigin: true,
  });
};

export {axios};
export default axios();
