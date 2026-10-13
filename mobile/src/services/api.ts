import axios from 'axios';

export const api = axios.create({
  // IP da máquina e a porta padrão do Spring Boot
  baseURL: 'http://172.31.0.101:8080',
});