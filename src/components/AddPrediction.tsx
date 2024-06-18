import * as React from "react";
import { toast } from "react-toastify";
import { toastConfig } from "@/app/utils";
import { DatePicker, Input, Modal, Radio } from "antd";
import DebounceSelect from "@/components/DebounceSelect";
import { getCoins } from "@/api/public";
import { TokenDropdownRender } from "@/components/TokenLabel";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { InsightsUser } from "@/components/Tweet";
import { getMyProfile } from "@/api/user";
import { useTranslations } from "next-intl";

dayjs.extend(customParseFormat);

const { TextArea } = Input;
export interface CoinValue {
  label: string;
  value: string;
}

export function AddPrediction({ onSuccess, currentUserInfo }: { onSuccess?: any; currentUserInfo?: InsightsUser }) {
  const t = useTranslations("AddPrediction");
  const tTokenLabel = useTranslations("TokenLabel");
  const { address, isConnected } = useAccount();
  const [currentUser, setCurrentUser]: [InsightsUser, any] = useState(currentUserInfo || {});

  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);

  const [coinValue, setCoinValue] = useState<CoinValue | null>(null);
  const [predictionTime, setPredictionTime] = useState<Dayjs | null>(null);
  const [predictionTrend, setPredictionTrend] = useState("rise");
  const [predictionTweetUrl, setPredictionTweetUrl] = useState("");
  const [predictionExplanation, setPredictionExplanation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  useEffect((): any => {
    if (address) {
      if (!currentUserInfo) {
        console.log("add prediction profile");
        // Login(address).then(() => {
        getMyProfile().then((res) => {
          if (res.data) {
            setCurrentUser(res.data);
          }
        });
        // });
      }
    } else {
      setCurrentUser({});
    }
  }, [address]);

  const resetPredictionForm = () => {
    setCoinValue(null);
    setPredictionTime(null);
    setPredictionTrend("rise");
    setPredictionExplanation("");
    setPredictionTweetUrl("");
    setErrorMsg("");
  };

  const addPrediction = () => {
    setErrorMsg("");
    setAddLoading(false);
    // form valid
    if (!coinValue || (coinValue && !coinValue.value)) {
      setErrorMsg(t("ErrorMsgForm1"));
      return;
    }
    if (!predictionTime) {
      setErrorMsg(t("ErrorMsgForm2"));
      return;
    }
    setAddLoading(true);
    // console.log(coinValue);
    const prediction = {
      coin: JSON.parse(coinValue!.value),
      resultAchievementTime: predictionTime.format("YYYY-MM-DDTHH:mm:ss"),
      trend: predictionTrend,
      explanation: predictionExplanation,
      tweetUrl: predictionTweetUrl,
    };

    // console.log(prediction);

    axios
      .post(
        "/v0/api/user/prediction/create",
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
            toast.success(t("ToastMsgAddSuccess"), toastConfig);
            if (onSuccess) {
              onSuccess();
            }
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

  const openAddPrediction = () => {
    // TODO
    if (currentUser && ((currentUser.tweet && currentUser.tweet.name) || currentUser.isOperator)) {
      setIsPredictionModalOpen(true);
    } else {
      toast.error(t("ToastMsgErrorNoPermission"), toastConfig);
    }
  };
  const closeAddPrediction = () => {
    setIsPredictionModalOpen(false);
  };

  return (
    <>
      {((currentUser.tweet && currentUser.tweet.name) || currentUser.isOperator) && (
        <button className="btn btn-primary btn-sm text-white font-normal" onClick={openAddPrediction}>
          ＋{t("AddPredictionBtn")}
        </button>
      )}
      <Modal
        title={t("AddPredictionModalTitle")}
        open={isPredictionModalOpen}
        footer={null}
        onCancel={closeAddPrediction}
      >
        <div className="flex w-full flex-col gap-4 py-2">
          <div className="flex flex-col">
            <DebounceSelect
              showSearch
              value={coinValue}
              placeholder={t("TokenPlaceholder")}
              fetchOptions={(keywords) => getCoins(keywords, tTokenLabel)}
              onChange={(newValue) => {
                setCoinValue(newValue as CoinValue);
              }}
              // allowClear={true}
              style={{ width: "100%", height: 95 }}
              dropdownRender={TokenDropdownRender}
            />
            <span className="text-gray-500 mt-0 text-xs mb-1">
              <a href="https://dexscreener.com/" target="_blank">
                DEX Screener
              </a>{" "}
              {t("DEXScreenerTip1")}
            </span>
          </div>
          <div className="flex flex-col">
            <DatePicker
              showTime
              value={predictionTime}
              placeholder={t("DatePlaceholder")}
              onOk={(value) => setPredictionTime(value)}
              onChange={(value) => setPredictionTime(value)}
              minDate={dayjs(dayjs(new Date()).add(1, "day"), "YYYY-MM-DD")}
              maxDate={dayjs(dayjs(new Date()).add(91, "day"), "YYYY-MM-DD")}
            />
            <span className="text-gray-500 mt-0 text-xs mb-1">{t("DateTip")}</span>
          </div>
          <Radio.Group onChange={(e) => setPredictionTrend(e.target.value)} value={predictionTrend}>
            <span>{t("TrendLabel")}: </span>
            <Radio value="rise">
              <span className="text-success text-lg">{t("Rise")} ↗</span>
            </Radio>
            <Radio value="fall">
              <span className="text-error text-lg">{t("Fall")} ↘</span>
            </Radio>
          </Radio.Group>

          <div className="flex flex-col">
            <TextArea
              value={predictionTweetUrl}
              onChange={(e) => setPredictionTweetUrl(e.target.value.trim())}
              placeholder={t("PredictionSourcePlaceholder")}
              autoSize
            />
            <span className="text-gray-500 mt-0 text-xs mb-1">{t("PredictionSourceTip")}</span>
          </div>
          <div className="flex flex-col">
            <TextArea
              value={predictionExplanation}
              onChange={(e) => setPredictionExplanation(e.target.value.trim())}
              placeholder={t("PredictionExplanationPlaceholder")}
              autoSize
            />
            <span className="text-gray-500 mt-0 text-xs mb-1">{t("PredictionExplanationTip")}</span>
          </div>
          {errorMsg && <div className="text-error text-xs">{errorMsg}</div>}
          <div>
            <button className="btn btn-primary btn-sm text-white font-normal max-w-36" onClick={addPrediction}>
              {t("AddPredictionBtn")}
            </button>
            <button className="btn btn-sm ml-2 font-normal max-w-36" onClick={closeAddPrediction}>
              {t("CancelBtn")}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
