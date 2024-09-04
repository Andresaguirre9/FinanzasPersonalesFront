import { boot } from "quasar/wrappers";
import axios from "axios";
import { createPinia } from "pinia";
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const axiosInstanceBaseURL = "http://localhost:1337/api";
const api = axios.create({ baseURL: "http://localhost:1337/api" });
const axiosInstance = axios.create({
  baseURL: axiosInstanceBaseURL,
});

export default boot(({ app }) => {
  app.use(createPinia());
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api, axiosInstance };
