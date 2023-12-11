import { makeAutoObservable } from "mobx";

class UserStore {
  address: null | string = localStorage.getItem("userAddress");

  constructor() {
    makeAutoObservable(this);
  }

  setUser = (address: string) => {
    this.address = address;
  };

  deleteUser = () => {
    this.address = null;
  };
}

export default new UserStore();
