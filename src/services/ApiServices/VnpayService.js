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
