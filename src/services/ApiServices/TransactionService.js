import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function GetAllByTypeTransaction(type) {
    const response = await axios.get(
      `${getEndpoint()}/api/Transaction/GetAllByTypeTransaction?type=${type}`,
      ngrokSkipWarning,
    );
    return response.data;
  }

  export async function GetAllTransactions() {
    const response = await axios.get(
      `${getEndpoint()}/api/Transaction/GetAll`,
      ngrokSkipWarning,
    );
    return response.data;
  }

  export async function GetTransaction(id) {
    const response = await axios.get(
        `${getEndpoint()}/api/Transaction/Get?id=${id}`,
        ngrokSkipWarning
    );
    return response.data;
  }