import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };


export async function PayService(data) {
  const response = await axios.post(
    `${getEndpoint()}/api/Vnpay/PayUserCredit`,
    data,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function CheckCreditService(data) {
  const response = await axios.post(
    `${getEndpoint()}/api/Vnpay/CheckUserCredit`,
    data,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function TransferMoney(data) {
  const response = await axios.post(
    `${getEndpoint()}/api/Vnpay/TransferMoney`,
    data,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function TransferMoneyTutor(data) {
  const response = await axios.post(
    `${getEndpoint()}/api/Vnpay/TransferMoneyTutor`,
    data,
    ngrokSkipWarning,
  );
  return response.data;
}

