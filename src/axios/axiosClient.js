import axios from 'axios';

const BASE_URL = 'http://139.99.62.190:8000/api/v1/fund_projects';

const axiosClient = axios.create({
  baseURL: BASE_URL
});


export default axiosClient;