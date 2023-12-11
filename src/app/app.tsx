import { Header } from "../modules/header";
import RootStore from "../stores/root-store";
import { RootStoreContext } from "./root-store-context";

const App = () => {
  return (
    <RootStoreContext.Provider value={new RootStore()}>
      <Header />
    </RootStoreContext.Provider>
  );
};

export default App;
