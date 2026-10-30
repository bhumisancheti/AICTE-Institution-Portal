
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach the login token to every API request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getApplications = async () => {
  const response = await API.get("/applications");
  return response.data.data;
};

export const createApplication = async (applicationData) => {
  const response = await API.post("/applications", applicationData);
  return response.data.data;
};

export const updateApplication = async (id, applicationData) => {
  const response = await API.put(
    `/applications/${id}`,
    applicationData
  );
  return response.data.data;
};

export const deleteApplication = async (id) => {
  const response = await API.delete(`/applications/${id}`);
  return response.data;
};

export const uploadDocument = async (applicationId, file) => {
  const formData = new FormData();
  formData.append("document", file);

  const response = await API.post(
    `/applications/${applicationId}/upload`,
    formData
  );

  return response.data;
};
