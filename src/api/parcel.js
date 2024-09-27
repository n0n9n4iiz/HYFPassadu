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
