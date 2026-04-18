import axios from "axios";

const API = axios.create({
  baseURL: "https://api.voarion.in/api?v=2"
});

export const stocksAPI = {
  getQuote: async (symbol) => {
    const res = await API.get(`/stocks/${symbol}`);
    return res.data;
  },

  searchStocks: async (query) => {
    const res = await API.get(`/stocks/search/${query}`);
    return res.data;
  }
};