import { Box, Tab, Tabs, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { useStores } from "../app/root-store-context";
import { observer } from "mobx-react-lite";
import { MakeOrder } from "../modules/make-order";
import { OrdersList } from "../modules/orders-list";

const MainPage = observer(() => {
  const { user } = useStores();

  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: "70px",
      }}
    >
      {!user.address ? (
        <Typography textAlign="center" variant="h6" color="#f8f8f8">
          You need to connect your MetaMask
        </Typography>
      ) : (
        <>
          <Box sx={{ width: "1000px", bgcolor: "#010409" }}>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="Make new order" sx={{ color: "#1976d2" }} />
              <Tab label="My orders list" sx={{ color: "#1976d2" }} />
            </Tabs>
          </Box>
          <Box
            sx={{
              width: "1000px",
              boxShadow:
                "0px 2px 4px -1px rgba(0, 0, 0, 0.2),0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {value === 0 ? <MakeOrder /> : <OrdersList />}
          </Box>
        </>
      )}
      ;
    </Box>
  );
});

export default MainPage;
