"use client";

import { toast } from "react-toastify";
import { toastConfig } from "@/app/utils";
import axios from "axios";
import Cookies from "js-cookie";

export const Login = async (address: string) => {
  if (!localStorage.getItem("insights_signin_message")) {
    localStorage.removeItem("insights_token");
    localStorage.removeItem("insights_token_timeout");
    toast.error("A signing error occurred during login.", toastConfig);
    return false;
  }

  const loginResponse = await axios.post("/v0/public/login", {
    address: address,
    invitationCode: Cookies.get("insights_invite_code") || "",
    message: localStorage.getItem("insights_signin_message"),
    signature: localStorage.getItem("insights_signin_signature"),
  });

  if (
    loginResponse.data &&
    typeof loginResponse.data.code !== "undefined" &&
    loginResponse.data.code === 0 &&
    loginResponse.data.data &&
    loginResponse.data.data.token
  ) {
    localStorage.setItem("insights_address", address);
    localStorage.setItem("insights_token", loginResponse.data.data.token);
    localStorage.setItem("insights_token_timeout", Math.ceil(+new Date() / 1000) + loginResponse.data.data.timeout);
    console.log("Login Success", address);
    return true;
  }
  console.error(loginResponse);
  toast.error("Login request error.", toastConfig);
  return false;
};

// private api
export const getMyProfile = async () => {
  try {
    // need login
    if (!localStorage.getItem("insights_token")) {
      return {};
    }
    const res = await axios.get("/v0/api/user/profile", {
      headers: {
        Authorization: localStorage.getItem("insights_token"),
      },
    });

    // console.log(res);
    if (res && res.data && res.data.code === 0) {
      localStorage.setItem("insights_user", JSON.stringify(res.data.data));
      localStorage.setItem("insights_user_alias", res.data.data.alias);
      if (res.data.data.isOperator) {
        sessionStorage.setItem("insights_user_r", "op");
      }
      return res && res.data ? res.data : {};
    } else {
      return {};
    }
  } catch (err) {
    console.error(err);
    return {};
  }
};

// public api
export const getUserProfile = async (alias: string) => {
  try {
    const res = await axios.get(`/v0/public/users/${alias}`);
    return res.data.data;
  } catch (err) {
    console.error(err);
    return {};
  }
};

// update username
export const updateUserName = async (userName: string) => {
  try {
    // need login
    if (!localStorage.getItem("insights_token")) {
      return false;
    }
    const res = await axios.post(
      "/v0/api/user/profile/update/name",
      { name: userName },
      {
        headers: {
          Authorization: localStorage.getItem("insights_token"),
        },
      },
    );

    return !!(res && res.data && res.data.code === 0);
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const getBindTwitterUri = async () => {
  try {
    // need login
    if (!localStorage.getItem("insights_token")) {
      return null;
    }
    const res = await axios.get(`/v0/api/user/twitter/bind/request`, {
      headers: {
        Authorization: localStorage.getItem("insights_token"),
      },
    });

    if (res && res.data && res.data.code === 0) {
      return res.data.data;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

// bind twitter
export const bindTwitterWithUser = async (oauth_token: string, oauth_verifier: string) => {
  try {
    // need login
    if (!localStorage.getItem("insights_token")) {
      return false;
    }
    const res = await axios.post(
      "/v0/api/user/twitter/bind",
      { oauthToken: oauth_token, oauthVerifier: oauth_verifier },
      {
        headers: {
          Authorization: localStorage.getItem("insights_token"),
        },
      },
    );

    return !!(res && res.data && res.data.code === 0);
  } catch (err) {
    console.error(err);
    return false;
  }
};
