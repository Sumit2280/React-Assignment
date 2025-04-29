import axios from "axios";
import { User } from "../types/User";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get("/users");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const postUser = async (params: User) => {
  try {
    const response = await axiosInstance.post("/users", params);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteUsers = async (userIds: string[]) => {
  await Promise.all(userIds.map((id) => axiosInstance.delete(`/users/${id}`)));
};

export const getUsersById = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateUser = async (id: string, data: User) => {
  return await axiosInstance.put(`/users/${id}`, data);
};
