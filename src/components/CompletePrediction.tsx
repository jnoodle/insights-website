import * as React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { toastConfig } from "@/app/utils";
import { DatePicker, InputNumber, Modal } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import { useTranslations } from "next-intl";

// only by admin
dayjs.extend(customParseFormat);

export function CompletePrediction({ id, createTime }: { id: string; createTime: string }) {
  const t = useTranslations("AddPrediction");
  const t2 = useTranslations("Prediction");

  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);

  const [predictionTime, setPredictionTime] = useState<Dayjs | null>(null);
  const [predictionPrice, setPredictionPrice] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const resetPredictionForm = () => {
    setPredictionTime(null);
    setPredictionPrice(null);
    setErrorMsg("");
  };

  const completePrediction = () => {
    setErrorMsg("");
    setAddLoading(false);
    // form valid
    if (!predictionTime) {
      setErrorMsg("选择预测完成时间");
      return;
    }
    if (!predictionPrice) {
      setErrorMsg("填写完成时的价格");
      return;
    }
    setAddLoading(true);
    // console.log(coinValue);
    const prediction = {
      id,
      timestamp: predictionTime.format("YYYY-MM-DD HH:mm:ss"),
      price: predictionPrice,
    };

    // console.log(prediction);

    axios
      .post(
        "/v0/api/system/prediction/complete",
        {
          ...prediction,
        },
        {
          headers: {
            Authorization: localStorage.getItem("insights_token"),
          },
        },
      )
      .then((res: any) => {
        if (res.data) {
          console.log(res.data);
          if (res.data.code === 0) {
            resetPredictionForm();
            toast.success("完成预测成功", toastConfig);
          } else {
            setErrorMsg(t("ErrorMsgCode", { code: res.data.code }) || t("ErrorMsgInternal"));
          }
        } else {
          setErrorMsg(t("ErrorMsgNetwork"));
        }
      })
      .catch((err: any) => {
        console.error(err);
        setErrorMsg(err.message);
      })
      .finally(() => {
        setAddLoading(false);
      });
  };

  const openCompletePrediction = () => {
    setIsPredictionModalOpen(true);
  };
  const closeCompletePrediction = () => {
    setIsPredictionModalOpen(false);
  };

  return (
    <>
      <button className="btn btn-warning btn-xs font-normal" onClick={openCompletePrediction}>
        {t2("CompleteWithPrice")}
      </button>
      <Modal
        title={t2("CompleteWithPrice")}
        open={isPredictionModalOpen}
        footer={null}
        onCancel={closeCompletePrediction}
      >
        <div className="flex w-full flex-col gap-4 py-2">
          <div className="flex flex-col">
            <DatePicker
              showTime
              value={predictionTime}
              placeholder="选择预测完成时间"
              onOk={(value) => setPredictionTime(value)}
              onChange={(value) => setPredictionTime(value)}
              minDate={dayjs(createTime, "YYYY-MM-DD HH:mm:ss")}
              maxDate={dayjs(dayjs(new Date()), "YYYY-MM-DD HH:mm:ss")}
            />
          </div>
          <div className="flex flex-col">
            <InputNumber
              value={predictionPrice}
              min={0}
              className="w-full"
              onChange={(value) => setPredictionPrice(value || 0)}
              placeholder="输入完成价格（相对USDT价格）"
            />
          </div>
          {errorMsg && <div className="text-error text-xs">{errorMsg}</div>}
          <div>
            <button
              className="btn btn-primary btn-sm text-white font-normal"
              onClick={completePrediction}
              disabled={addLoading}
            >
              完成预测
              {addLoading && <span className="loading loading-spinner loading-xs"></span>}
            </button>
            <button className="btn btn-sm ml-2 font-normal max-w-36" onClick={closeCompletePrediction}>
              {t("CancelBtn")}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
