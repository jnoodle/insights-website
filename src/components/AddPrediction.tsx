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
      setErrorMsg("Please select the token for prediction.");
      return;
    }
    if (!predictionTime) {
      setErrorMsg("Please select the latest time of the price prediction result achievement.");
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
            toast.success("Adding prediction success.", toastConfig);
            if (onSuccess) {
              onSuccess();
            }
          } else {
            setErrorMsg(`Code ${res.data.code} Error` || "Internal error.");
          }
        } else {
          setErrorMsg("Network error.");
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
      toast.error("This feature only supports verified users.", toastConfig);
    }
  };
  const closeAddPrediction = () => {
    setIsPredictionModalOpen(false);
  };

  return (
    <>
      {((currentUser.tweet && currentUser.tweet.name) || currentUser.isOperator) && (
        <button className="btn btn-primary btn-sm text-white font-normal" onClick={openAddPrediction}>
          ＋ Add Prediction
        </button>
      )}
      <Modal title="Add Prediction" open={isPredictionModalOpen} footer={null} onCancel={closeAddPrediction}>
        <div className="flex w-full flex-col gap-4 py-2">
          <div className="flex flex-col">
            <DebounceSelect
              showSearch
              value={coinValue}
              placeholder="Search Token by Name / Symbol / Address"
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
              provides the search service.
            </span>
          </div>
          <div className="flex flex-col">
            <DatePicker
              showTime
              value={predictionTime}
              placeholder="Select the latest time of the price prediction result achievement"
              onOk={(value) => setPredictionTime(value)}
              onChange={(value) => setPredictionTime(value)}
              minDate={dayjs(dayjs(new Date()).add(1, "day"), "YYYY-MM-DD")}
              maxDate={dayjs(dayjs(new Date()).add(91, "day"), "YYYY-MM-DD")}
            />
            <span className="text-gray-500 mt-0 text-xs mb-1">
              You can manually complete the prediction at any time before this time, and we will judge the accuracy
              based on the price at the time of manual completion. If not manually completed, the accuracy will be
              judged based on the price at this time.
            </span>
          </div>
          <Radio.Group onChange={(e) => setPredictionTrend(e.target.value)} value={predictionTrend}>
            <span>Trend Prediction: </span>
            <Radio value="rise">
              <span className="text-success text-lg">Rise ↗</span>
            </Radio>
            <Radio value="fall">
              <span className="text-error text-lg">Fall ↘</span>
            </Radio>
          </Radio.Group>

          <div className="flex flex-col">
            <TextArea
              value={predictionTweetUrl}
              onChange={(e) => setPredictionTweetUrl(e.target.value.trim())}
              placeholder="Prediction source tweet URL: https://x.com/xxx (optional)"
              autoSize
            />
            <span className="text-gray-500 mt-0 text-xs mb-1">
              You can input the link to your prediction-related tweet.
            </span>
          </div>
          <div className="flex flex-col">
            <TextArea
              value={predictionExplanation}
              onChange={(e) => setPredictionExplanation(e.target.value.trim())}
              placeholder="Prediction explanation (optional)"
              autoSize
            />
            <span className="text-gray-500 mt-0 text-xs mb-1">You can input the prediction explanation.</span>
          </div>
          {errorMsg && <div className="text-error text-xs">{errorMsg}</div>}
          <div>
            <button className="btn btn-primary btn-sm text-white font-normal max-w-36" onClick={addPrediction}>
              Add Prediction
            </button>
            <button className="btn btn-sm ml-2 font-normal max-w-36" onClick={closeAddPrediction}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
