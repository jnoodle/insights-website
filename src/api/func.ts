import { toast } from "react-toastify";
import { toastConfig } from "@/app/utils";
import axios from "axios";

export const completePrediction = async (id: string) => {
  const res = await axios.post(
    "/v0/api/user/prediction/finish",
    {
      id,
    },
    {
      headers: {
        Authorization: localStorage.getItem("insights_token"),
      },
    },
  );

  // console.log(res);
  if (res && res.data && res.data.code === 0) {
    return res.data;
  }
  throw new Error(res.data);
};

export const deleteItem = async (id: string, type: "prediction" | "news" | "tweet") => {
  const res = await axios.post(
    `/v0/api/system/${type}/delete`,
    {
      id,
    },
    {
      headers: {
        Authorization: localStorage.getItem("insights_token"),
      },
    },
  );

  // console.log(res);
  if (res && res.data && res.data.code === 0) {
    return res.data;
  }
  throw new Error(res.data);
};
