import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/ProtectedRoute";
import { Box, Typography } from "@mui/material";
import { drawerWidth } from "../ResponsiveDrawer";
import {
  fetchPatientAnalysis,
  fetchPatientMedicalRecord,
} from "../../utils/api";
import MedicalRecord from "../../interface/MedicalRecord";
import LineChartComp from "../../components/LineChart";
import formatDate from "../../utils/utils";

const PatientDetail = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [medRecords, setMedRecords] = useState<MedicalRecord[]>([]);
  const [analysis, setAnalysis] = useState("");
  const [bsg, setBsg] = useState<any[]>([]);
  const [sc, setSc] = useState<any[]>([]);
  const [mhr, setMhr] = useState<any[]>([]);
  const [rbp, setRbp] = useState<any[]>([]);

  const handleFetchMedicalRecords = () => {
    if (state && state.id) {
      fetchPatientMedicalRecord(state.id).then((res) => {
        console.log("medRecords:", res);
        setMedRecords(res.data);
      });
    }
  };

  const handleFetchAnalysis = () => {
    if (state && state.id) {
      fetchPatientAnalysis(state.id).then((res) => {
        console.log("analysis:", res);
        if (res.data && res.data.msg.msg) {
          setAnalysis(res.data.msg.msg);
        }
      });
    }
  };

  useEffect(() => {
    document.title = "Patient Detail";
    if (!isAuthenticated || role === "admin") {
      navigate("/login");
    }
    handleFetchMedicalRecords();
    handleFetchAnalysis();
  }, []);

  const handleTransformMedRecords = () => {
    if (medRecords.length > 0) {
      var tempBsg: any[] = [];
      var tempSc: any[] = [];
      var tempMhr: any[] = [];
      var tempRbp: any[] = [];

      medRecords.map((rec) => {
        if (!Number.isNaN(rec.fastingBloodSugar)) {
          const bsgNb: number = Number(rec.fastingBloodSugar);
          tempBsg.push(bsgNb);
        } else {
          tempBsg.push(null);
        }
        if (!Number.isNaN(rec.serumCholestrol)) {
          const scNb: number = Number(rec.serumCholestrol);
          tempSc.push(scNb);
        } else {
          tempSc.push(null);
        }
        if (!Number.isNaN(rec.maxHeartRate)) {
          const mhrNb: number = Number(rec.maxHeartRate);
          tempMhr.push(mhrNb);
        } else {
          tempMhr.push(null);
        }
        if (!Number.isNaN(rec.restingBp)) {
          const rbpNb: number = Number(rec.restingBp);
          tempRbp.push(rbpNb);
        } else {
          tempRbp.push(null);
        }
      });
      setBsg(tempBsg);
      setSc(tempSc);
      setMhr(tempMhr);
      setRbp(tempRbp);
    }
  };

  useEffect(() => {
    handleTransformMedRecords();
  }, [medRecords]);

  return (
    <>
      {isAuthenticated && role !== "admin" ? (
        <Box
          component="main"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            paddingRight: "2%",
            paddingLeft: "4.5%",
            paddingTop: "72px",
            paddingBottom: "0px",
          }}
        >
          <h1>Patient details</h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "10px",
              marginBottom: "20px",
            }}
          >
            <p>
              Details of patient{" "}
              <strong>{state.fullName}</strong> born on{" "}
              <strong>{state.birthDate}</strong>
            </p>
            {analysis !== "" ? (
              <p>
                AI analysis: <strong>{analysis}</strong>
              </p>
            ) : null}
            {medRecords.length > 0 ? (
              <>
                {bsg.length > 0 ? (
                  <LineChartComp
                    title="Fasting Blood Glucose Line Chart"
                    caption="Can help identify diabetes"
                    data={bsg}
                  />
                ) : null}
                {sc.length > 0 ? (
                  <LineChartComp
                    title="Serum Chlorine Line Chart"
                    caption="Can help identy kidney disease (in mg/dL)"
                    data={sc}
                  />
                ) : null}
                {rbp.length > 0 ? (
                  <LineChartComp
                    title="Resting Blood Pressure Line Chart"
                    caption="Can help identify hypertension (in mmHg)"
                    data={rbp}
                  />
                ) : null}
                {mhr.length > 0 ? (
                  <LineChartComp
                    title="Max Heart Rate Line Chart"
                    caption="Can help identify hypertension (in BPM)"
                    data={mhr}
                  />
                ) : null}
              </>
            ) : (
              <Box
                sx={{
                  mt: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography>This patient has no medical record</Typography>
              </Box>
            )}
          </div>
        </Box>
      ) : null}
    </>
  );
};

export default PatientDetail;
