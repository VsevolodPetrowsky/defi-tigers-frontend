import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { Contract } from "ethers";
import { useEffect, useState } from "react";
// import defaultProvider from "../../../abi/default-provider";
import walletProvider from "../../../abi/wallet-provider";

type OrderType = {
  coin: "matic" | "eth";
  operation: "buy" | "sell";
  fee: 0.01 | 0.05 | 0.3 | 1;
  amount: number;
  strike: number;
};

const MakeOrder = () => {
  const [order, setOrder] = useState<OrderType>({
    coin: "matic",
    operation: "buy",
    fee: 0.3,
    amount: 100,
    strike: 0,
  });

  const abi = [
    {
      inputs: [],
      name: "_currentTick",
      outputs: [{ internalType: "int24", name: "", type: "int24" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "address", name: "token0", type: "address" },
        { internalType: "address", name: "token1", type: "address" },
        { internalType: "uint24", name: "fee", type: "uint24" },
      ],
      name: "_decreaseLiquidity",
      outputs: [
        { internalType: "uint256", name: "amount0", type: "uint256" },
        { internalType: "uint256", name: "amount1", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "_tickSpacing",
      outputs: [{ internalType: "int24", name: "", type: "int24" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "collectAllFees",
      outputs: [
        { internalType: "uint256", name: "amount0", type: "uint256" },
        { internalType: "uint256", name: "amount1", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "deposits",
      outputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "uint128", name: "liquidity", type: "uint128" },
        { internalType: "address", name: "token0", type: "address" },
        { internalType: "address", name: "token1", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_token1", type: "address" },
        { internalType: "address", name: "_token2", type: "address" },
        { internalType: "uint256", name: "_amount0ToMint", type: "uint256" },
        { internalType: "uint256", name: "_amount1ToMint", type: "uint256" },
        { internalType: "uint24", name: "_poolFee", type: "uint24" },
        { internalType: "int24", name: "_lowerTick", type: "int24" },
        { internalType: "int24", name: "_upperTick", type: "int24" },
      ],
      name: "mintNewPosition",
      outputs: [
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "uint128", name: "liquidity", type: "uint128" },
        { internalType: "uint256", name: "amount0", type: "uint256" },
        { internalType: "uint256", name: "amount1", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "nonfungiblePositionManager",
      outputs: [
        {
          internalType: "contract NonfungiblePositionManager",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "operator", type: "address" },
        { internalType: "address", name: "", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "bytes", name: "", type: "bytes" },
      ],
      name: "onERC721Received",
      outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "pool",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "position",
      outputs: [
        {
          internalType: "enum LiquidManager.Position",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bool", name: "_putOrCall", type: "bool" },
        { internalType: "address", name: "_token1", type: "address" },
        { internalType: "address", name: "_token2", type: "address" },
        { internalType: "uint256", name: "_amount0ToMint", type: "uint256" },
        { internalType: "uint256", name: "_amount1ToMint", type: "uint256" },
        { internalType: "uint24", name: "_poolFee", type: "uint24" },
        { internalType: "int24", name: "_price", type: "int24" },
      ],
      name: "putOrCall",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "retrieveNFT",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "strikes",
      outputs: [{ internalType: "int24", name: "", type: "int24" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "token0", type: "address" },
        { internalType: "address", name: "token1", type: "address" },
        { internalType: "uint24", name: "fee", type: "uint24" },
      ],
      name: "takePoolInfo",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  // const primitives = new Contract(
  //   import.meta.env.VITE_LIQUID_MANAGER_ADDRESS,
  //   abi,
  //   defaultProvider
  // );

  const maticAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
  const ethAddress = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const signer = await walletProvider.getSigner();

  //       console.log(signer);

  //       const primitivesWithSigner = new Contract(
  //         '0x2BE98E087df773F3a19b1F5837d66Dda17114a34',
  //         abi,
  //         signer
  //       );
  //       const poolInfo = await primitivesWithSigner.takePoolInfo(
  //         token1,
  //         token2,
  //         order.fee * 10000
  //       );
  //       const response = poolInfo.wait();
  //       console.log(response);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   })();
  // }, []);

  const makeNewOrder = async () => {
    const putOrCall = order.operation === "buy" ? true : false;
    const token1 = order.coin === "eth" ? ethAddress : maticAddress;
    const token2 = maticAddress;
    const amount0ToMint =
      order.operation === "buy" ? BigInt(order.amount * 10 ** 18) : 2000;
    const amount1ToMint =
      order.operation === "sell" ? BigInt(order.amount * 10 ** 18) : 2000;
    const poolFee = order.fee * 10000;
    const price = order.strike;

    try {
      const signer = await walletProvider.getSigner();

      const primitivesWithSigner = new Contract(
        "0x2BE98E087df773F3a19b1F5837d66Dda17114a34",
        abi,
        signer
      );
      const tx = await primitivesWithSigner.putOrCall(
        putOrCall,
        token1,
        token2,
        amount0ToMint,
        amount1ToMint,
        poolFee,
        price
      );
      const response = tx.wait();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormControl sx={{ padding: "50px 300px" }}>
      <FormLabel id="coins-label">Choose coin:</FormLabel>
      <RadioGroup
        row
        aria-labelledby="coins-label"
        name="coins-radio-buttons-group"
      >
        <FormControlLabel
          onChange={() => setOrder({ ...order, coin: "matic" })}
          value="matic"
          control={<Radio />}
          label="Matic"
        />
        <FormControlLabel
          onChange={() => setOrder({ ...order, coin: "eth" })}
          value="eth"
          control={<Radio />}
          label="Etherium"
        />
      </RadioGroup>
      <FormLabel id="operation-label" sx={{ mt: "20px" }}>
        Choose operation:
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="operation-label"
        name="operation-radio-buttons-group"
      >
        <FormControlLabel
          onChange={() => setOrder({ ...order, operation: "sell" })}
          value="sell"
          control={<Radio />}
          label="Sell"
        />
        <FormControlLabel
          onChange={() => setOrder({ ...order, operation: "buy" })}
          value="buy"
          control={<Radio />}
          label="Buy"
        />
      </RadioGroup>

      <RadioGroup
        row
        aria-labelledby="fee-label"
        name="fee-radio-buttons-group"
      >
        <FormControlLabel
          onChange={() => setOrder({ ...order, fee: 0.01 })}
          value="0.01"
          control={<Radio />}
          label="0.01"
        />
        <FormControlLabel
          onChange={() => setOrder({ ...order, fee: 0.05 })}
          value="0.05"
          control={<Radio />}
          label="0.05"
        />
        <FormControlLabel
          onChange={() => setOrder({ ...order, fee: 0.3 })}
          value="0.3"
          control={<Radio />}
          label="0.3"
        />
        <FormControlLabel
          onChange={() => setOrder({ ...order, fee: 1 })}
          value="1"
          control={<Radio />}
          label="1"
        />
      </RadioGroup>

      <TextField sx={{ mt: "20px" }} label="Amount USDC" variant="outlined" />

      <TextField sx={{ mt: "20px" }} label="Strike price" variant="outlined" />

      <Button
        sx={{ mt: "20px" }}
        variant="outlined"
        onClick={() => makeNewOrder()}
      >
        Make new order
      </Button>
    </FormControl>
  );
};

export default MakeOrder;
