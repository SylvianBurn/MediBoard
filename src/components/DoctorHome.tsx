import HomeTool from "./HomeTool";

const DoctorHome = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        columnGap: "10px",
        rowGap: "10px",
        padding: "20px",
      }}
    >
      <HomeTool label="My Patients" link="/doctor/my_patients" />
    </div>
  );
};

export default DoctorHome;
