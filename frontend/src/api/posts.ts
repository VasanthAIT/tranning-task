import axios from 'axios';

const API = 'http://localhost:3000'; 

export const getAllPosts = async () => {
  const res = await axios.get(`${API}/posts`);
  return res.data;
};
