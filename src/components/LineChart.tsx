import { Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts";

type LineChartCompProps = {
  title: string;
  caption: string;
  data: number[];
};

const LineChartComp = ({ title, caption, data }: LineChartCompProps) => {
  return (
    <Box
      sx={{
        marginY: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography>{title}</Typography>
      <Typography variant="caption">{caption}</Typography>
      <Box sx={{ mt: 3, border: 1, borderRadius: 4 }}>
        <LineChart
          series={[
            {
              data: data,
            },
          ]}
          width={1000}
          height={400}
        />
      </Box>
    </Box>
  );
};

export default LineChartComp;
