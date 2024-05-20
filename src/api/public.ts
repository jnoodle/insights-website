import { toast } from "react-toastify";
import { toastConfig } from "@/app/utils";
import axios from "axios";
import { CoinInfo } from "@/components/Prediction";
import { CoinValue } from "@/app/profile/page";

export const getCoins = async (keyword: string): Promise<CoinValue[]> => {
  return axios.get(`/v0/public/coins?keyword=${keyword}&from=0&size=10`).then((res) =>
    res.data.data.map((c: CoinInfo) => ({
      label: `${c.symbol} (${c.name})`,
      value: c.id + "",
    })),
  );
};
