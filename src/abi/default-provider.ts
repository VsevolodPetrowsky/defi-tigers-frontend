import { InfuraProvider } from "ethers";

const defaultProvider = new InfuraProvider(import.meta.env.VITE_NETWORK_NAME);

export default defaultProvider;
