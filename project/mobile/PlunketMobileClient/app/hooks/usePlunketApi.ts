import { useContext } from "react";
import { PlunketApiContext } from "../context/PlunketApiContext";

const usePlunketApi = () => {
  return useContext(PlunketApiContext);
};

export default usePlunketApi;
