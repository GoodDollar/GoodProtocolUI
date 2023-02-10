import { QueryParams } from "@usedapp/core";
import useAppState from "./useAppState";

const useRefreshOrNever = (refresh: QueryParams["refresh"]) => {
  const { active } = useAppState();

  return active ? refresh : "never";
};

export default useRefreshOrNever;
