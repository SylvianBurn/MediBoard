import HomeTool from "./HomeTool";

const AdminHome = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      columnGap: '10px',
      rowGap: '40px',
      padding: '20px',
    }}>
      <HomeTool label="Manage patients" link="/admin/patients" />
      <HomeTool label="Manage doctors" link="/admin/doctors" />
    </div>
  )
};

export default AdminHome;