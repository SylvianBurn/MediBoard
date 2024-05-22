import axios from "axios";
import formatDate from "./utils";

const ax = axios.create();

// Setup your interceptor
ax.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle the error appropriately
    return Promise.reject(error);
  }
);

// Sets Content-Type header value for all post and put requests
ax.defaults.headers.post["Content-Type"] = "application/json";
ax.defaults.headers.put["Content-Type"] = "application/json";

// const api = process.env.REACT_APP_API_URL?.toString() || "http://127.0.0.1:3336";
const api = "http://127.0.0.1:3336";
console.log('api from env:', api);

const getConfig = () => {
  var config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return config;
};

export const loginRequest = (email: string, password: string) => {
  const data = {
    email: email,
    password: password,
  };

  return ax.post(`${api}/user/login`, JSON.stringify(data));
};

export const logoutRequest = () => {
  return ax.post(`${api}/user/logout`, {}, getConfig());
};

export const fetchPatientsAsAdmin = (
  page: number,
  pageSize: number,
  name?: string | undefined
) => {
  var route = `${api}/admin/patient_list`;
  const searchParams = new URLSearchParams();

  if (name !== undefined) {
    searchParams.append("name", name);
  }
  searchParams.append("page", Number(page + 1).toString());
  searchParams.append("limit", pageSize.toString());
  route = `${route}?${searchParams.toString()}`;

  return ax.get(route, getConfig());
};

export const fetchDoctorsAsAdmin = (
  page: number,
  pageSize: number,
  name?: string | undefined
) => {
  var route = `${api}/admin/doctor_list`;
  const searchParams = new URLSearchParams();

  if (name !== undefined) {
    searchParams.append("name", name);
  }
  searchParams.append("page", Number(page + 1).toString());
  searchParams.append("limit", pageSize.toString());
  route = `${route}?${searchParams.toString()}`;

  return ax.get(route, getConfig());
};

export interface DoctorCreationData {
  fullName: string;
  email: string;
  role?: string | undefined;
}

export const createDoctor = (name: string, email: string, role?: string) => {
  var data: DoctorCreationData = {
    fullName: name,
    email: email,
  };

  if (role) {
    data.role = role;
  }

  return ax.post(
    `${api}/admin/create/doctor`,
    JSON.stringify(data),
    getConfig()
  );
};

export interface PatientCreationData {
  fullName: string;
  email: string;
  birthDate?: string | undefined;
}

export const createPatient = (
  name: string,
  email: string,
  birthDate?: string
) => {
  var data: PatientCreationData = {
    fullName: name,
    email: email,
  };

  if (birthDate) {
    data.birthDate = formatDate(birthDate);
  }

  return ax.post(
    `${api}/admin/create/patient`,
    JSON.stringify(data),
    getConfig()
  );
};

export const assignPatientToDoctor = (doctorId: string, patientId: string) => {
  const data = {
    doctor_id: doctorId,
    patient_id: patientId,
  };

  return ax.post(
    `${api}/admin/assign/patient_to_doctor`,
    JSON.stringify(data),
    getConfig()
  );
};

export const deassignPatientToDoctor = (
  doctorId: string,
  patientId: string
) => {
  const data = {
    doctor_id: doctorId,
    patient_id: patientId,
  };

  return ax.post(
    `${api}/admin/deassign/patient_to_doctor`,
    JSON.stringify(data),
    getConfig()
  );
};
