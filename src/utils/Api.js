import { config } from "./config";
import { getToken } from "./localstorage";

const BASE_URL='https://vof635r1yb.execute-api.eu-north-1.amazonaws.com/dev'

const getRequest = async (path) => {

  try {
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    };

    const res = await fetch(BASE_URL+path, params);
    const data = await res.text();
    return { statusCode: res.status, data };
  } catch (e) {
    console.error(`error in get Request (${BASE_URL+path}) :- `, e);
    return { statusCode: 400, data: [] };
  }
};

const postRequest = async (path, body) => {
  try {

    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
      body: JSON.stringify(body),
    };

    const res = await fetch(BASE_URL+path, params);

    const data = await res.text();
    return { statusCode: res.status, data };
  } catch (e) {
    console.log(`error in post Request (${BASE_URL+path}) :- `, e);
  }
};

const DeleteRequest = async (path) => {
  try {
    const params = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    };

    const res = await fetch(BASE_URL+path, params);

    const data = await res.text();
    return { statusCode: res.status, data };
  } catch (e) {
    console.log(`error in Delete Request (${BASE_URL+path}) :- `, e);
  }
};

const putRequest = async (path, body) => {
  try {
    const params = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
      body: JSON.stringify(body),
    };

    const res = await fetch(BASE_URL+path, params);

    const data = await res.text();
    return { statusCode: res.status, data };
  } catch (e) {
    console.log(`error in PUT Request (${BASE_URL+path}) :- `, e);
  }
};

const patchRequest = async (path, body) => {
  try {
    const params = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
      body: JSON.stringify(body),
    };

    const res = await fetch(BASE_URL+path, params);

    const data = await res.text();
    return { statusCode: res.status, data };
  } catch (e) {
    console.log(`error in PUT Request (${BASE_URL+path}) :- `, e);
  }
};

export const Api = {
  getRequest,
  postRequest,
  DeleteRequest,
  putRequest,
  patchRequest
};
