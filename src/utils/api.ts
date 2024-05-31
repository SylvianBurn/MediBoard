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


//const api = process.env.REACT_APP_API_URL || "http://127.0.0.1:3336";
const api = "http://127.0.0.1:3336";
ax.defaults.baseURL = "http://127.0.0.1:3336";
console.log("api from env:", api);

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

  return ax.post(`/user/login`, JSON.stringify(data));
};

export const logoutRequest = () => {
  return ax.post(`/user/logout`, {}, getConfig());
};

export const fetchPatientsAsAdmin = (
  page?: number,
  pageSize?: number,
  name?: string | undefined
) => {
  var route = `/admin/patient_list`;
  const searchParams = new URLSearchParams();
  var paramsAdded: boolean = false;

  if (page) {
    searchParams.append("page", Number(page + 1).toString());
    paramsAdded = true;
  }
  if (pageSize) {
    searchParams.append("limit", pageSize.toString());
    paramsAdded = true;
  }
  if (name !== undefined) {
    searchParams.append("name", name);
    paramsAdded = true;
  }
  if (paramsAdded === true) {
    route = `${route}?${searchParams.toString()}`;
  }

  return ax.get(route, getConfig());
};

export const fetchDoctorsAsAdmin = (
  page?: number,
  pageSize?: number,
  name?: string | undefined
) => {
  var route = `/admin/doctor_list`;
  const searchParams = new URLSearchParams();
  var paramsAdded: boolean = false;

  if (page) {
    searchParams.append("page", Number(page + 1).toString());
    paramsAdded = true;
  }
  if (pageSize) {
    searchParams.append("limit", pageSize.toString());
    paramsAdded = true;
  }
  if (name !== undefined) {
    searchParams.append("name", name);
    paramsAdded = true;
  }
  if (paramsAdded === true) {
    route = `${route}?${searchParams.toString()}`;
  }

  return ax.get(route, getConfig());
};

export interface DoctorCreationData {
  fullName: string;
  email: string;
  role: string;
}

export const createDoctor = (name: string, email: string, role: string) => {
  var data: DoctorCreationData = {
    fullName: name,
    email: email,
    role: role
  };

  return ax.post(
    `/admin/create/doctor`,
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
    `/admin/create/patient`,
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
    `/admin/assign/patient_to_doctor`,
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
    `/admin/deassign/patient_to_doctor`,
    JSON.stringify(data),
    getConfig()
  );
};

export const deleteDoctor = (doctorId: string) => {
  return ax.delete(`/admin/doctor?doctorID=${doctorId}`, getConfig());
};

export const deletePatient = (patientId: string) => {
  return ax.delete(`/admin/patient?patientID=${patientId}`, getConfig());
};

export const fetchPatientsAsDoctor = () => {
  return ax.get('/doctor/patient_list', getConfig());
};

export const fetchPatientMedicalRecord = (patientId: string) => {
  return ax.get(`/patient/records?patientID=${patientId}`, getConfig());
};

export const fetchPatientAnalysis = (patientId: string) => {
  return ax.get(`/patient/ai_analysis?patientID=${patientId}`, getConfig());
};

export const fetchDoctorsAssignedPatient = (patientId: string) => {
  return ax.get(`/admin/doctor_patients?doctorID=${patientId}`, getConfig());
};
