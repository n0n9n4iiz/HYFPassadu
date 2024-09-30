import axios from "axios";
import { api } from "./_baseUrl";

export const getParcel = async (search, from = 0, to = 10) => {
  try {
    const url = `/api/hyfpassadu/data`;
    const params = {
      search,
      from,
      to,
    };
    const res = await api.get(url, {
      headers: { "ngrok-skip-browser-warning": "69420" },
      params,
    });
    return res;
  } catch (err) {
    console.error(err);
  }
};
export const updateStock = async (id, quantity) => {
  try {
    const url = `/api/hyfpassadu/data/stock`;
    const body = {
      id,
      quantity,
    };
    const res = await api.patch(url, body, {
      headers: { "ngrok-skip-browser-warning": "69420" },
    });
    return res;
  } catch (err) {
    console.error(err);
  }
};
export const getParcel2 = async () => {
  try {
    const url = `https://16-1-hyf-api-messge-for-parcel-stock-online.vercel.app/json?message=`;
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const updateStock2 = async (lineId, parcelCode, quantity, usingFor) => {
  try {
    const url = `https://16-1-hyf-api-messge-for-parcel-stock-online.vercel.app/stockOut`;
    const body = {
      LINE_USER_ID : lineId,
      PARCEL_CODE : parcelCode,
      STOCK_OUT_QUANTITY : quantity,
      USE_FOR_WORK : usingFor
    };
    const res = await axios.post(url, body);
    return res;
  } catch (err) {
    console.error(err);
  }
};
