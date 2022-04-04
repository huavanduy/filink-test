import axiosClient from "./axiosClient";

export const loadDataApi = (filter) => {
    return axiosClient.post("/filter", filter);
};