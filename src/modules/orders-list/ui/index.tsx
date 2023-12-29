import { Contract } from "ethers";
import { useEffect, useState } from "react";
import walletProvider from "../../../abi/wallet-provider";
import * as stylex from "@stylexjs/stylex";
import { abi, tokenAbi } from "../../../abi/abi";
import {
  CONTRACT_ADDRESS,
  // TOKEN1_ADDRESS,
  // TOKEN2_ADDRESS,
} from "../../../abi/addresses";
// import getPrice from "../../../helpers/get-price";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import defaultProvider from "../../../abi/default-provider";
import { useStores } from "../../../app/root-store-context";

const styles = stylex.create({
  wrapper: {
    margin: "10px",
  },
  text: {
    fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
    fontWeight: "500",
    fontSize: "1.2rem",
    lineHeight: "1.2",
    letterSpacing: "0.0075em",
    color: "#f8f8f8",
    margin: "20px 0",
  },
});

interface Order {
  0: string;
  1: number;
  2: string;
  3: string;
}

type Orders = Order[];

const OrdersList = () => {
  const [orders, setOrders] = useState<Orders>([]);
  const [expanded, setExpanded] = useState<string | false>(false);

  const { user } = useStores();

  useEffect(() => {
    (async () => {
      try {
        const signer = await walletProvider.getSigner();

        const primitives = new Contract(CONTRACT_ADDRESS, abi, defaultProvider);

        const primitivesWithSigner = new Contract(
          CONTRACT_ADDRESS,
          abi,
          signer
        );

        // const deposits = await primitives.myOrders(user.address);
        const result: Orders = [];
        (async () => {
          for (let i = 0; i <= 1000; i++) {
            const deposit = await primitives.orders(i);
            console.log({ ...deposit });
            if (deposit[0] === "0x3B66e7a2C8147EA2f5FCf39613492774F361A0DF") {
              result.push({ ...deposit });
            }
          }
        })();
        setOrders(result);

      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleChange =
    (panel: string) => (e: React.SyntheticEvent, isExpanded: boolean) => {
      e.preventDefault();
      setExpanded(isExpanded ? panel : false);

      console.log(orders);
    };

  return (
    <div {...stylex.props(styles.wrapper)}>
      {orders[0] ? (
        orders.map((el, i) => (
          <Accordion
            expanded={expanded === `order${i}`}
            onChange={handleChange(`order${i}`)}
            key={i}
            sx={{
              background: "transparent",
              border: "1px solid #f8f8f8",
              color: "#f8f8f8",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#f8f8f8" }} />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <p>{el[0]}</p>
            </AccordionSummary>
            <AccordionDetails>1</AccordionDetails>
          </Accordion>
        ))
      ) : (
        <>No</>
      )}
    </div>
  );
};

export default OrdersList;
