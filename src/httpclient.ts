// Packages
import Axios, { AxiosRequestConfig, Method } from "axios";
import { fetchUtils } from "react-admin";

const httpClient = (
  url: any,
  options: fetchUtils.Options = {}
): Promise<{
  status: number;
  headers: Headers;
  body: string;
  json: any;
}> => {
  const token = JSON.parse(localStorage.getItem("auth") || "");
  const config: AxiosRequestConfig = {
    ...options,
    method: (options.method as Method) || "GET",
    baseURL: url,
    headers: {
      Authorization: `Bearer ${token?.access_token}`,
      "Content-Type": "application/json",
    },
    data: options.body,
  };

  return Axios(config).then((el) => {
    return {
      status: el.status,
      headers: new Headers(el.headers),
      body: JSON.stringify(el.data),
      json: el.data,
    };
  });
};

export default httpClient;
