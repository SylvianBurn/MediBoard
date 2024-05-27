import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./utils/ProtectedRoute";
import ResponsiveDrawer from "./pages/ResponsiveDrawer";
import { Global, css } from "@emotion/react";
import PatientList from "./pages/admin/PatientList";
import DoctorList from "./pages/admin/DoctorList";
import PatientAssign from "./pages/admin/PatientAssign";

function App() {
  return (
    <>
      <AuthProvider>
        <div style={{ display: "flex" }}>
          <Global
            styles={css`
              body {
                margin: 0;
              }
            `}
          />
          <ResponsiveDrawer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin">
              <Route path="/admin/patients" element={<PatientList />} />
              <Route path="/admin/doctors" element={<DoctorList />} />
              <Route path="/admin/patient_assign/:patientId" element={<PatientAssign />} />
              {/* <Route path="/admin/doctor_assign" element={} /> */}
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
