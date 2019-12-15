import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const mainWeb = "http://128.199.121.158:2303";

const ENDPOINTS: any = {
  login: { url: mainWeb + "/api/user/login", method: 'GET', token: false },
  loginToken: { url: mainWeb + "/api/user/login", method: 'GET', token: true },
  listRoom: { url: mainWeb + "/api/room/listRoom", method: 'GET', token: true },
  joinRoom: { url: mainWeb + "/api/room/joinRoom", method: 'POST', token: true },
  createRoom: { url: mainWeb + "/api/room/createRoom", method: 'GET', token: true },
  killRoom: { url: mainWeb + "/api/room/killRoom", method: 'POST', token: true },
  exitRoom: { url: mainWeb + "/api/room/exitRoom", method: 'POST', token: true },
}

export const callAPI = (url: string, body?: any) => {

  return new Promise(async (resolve, reject) => {
    const data = ENDPOINTS[url];
    if (data.token) {
      getToken().then((value: any) => {
        return API(data, body, value)
      }).then((value) => {
        resolve(value)
      }).catch((error) => {
        //console.log("error",error)
        reject()
      })
    }
    else {
      API(data, body)
        .then((value) => {
          resolve(value)
        }).catch((error) => {
          reject()
        })
    }
  })
}

async function getToken() {
  return new Promise(async (resolve, reject) => {
    AsyncStorage.getItem('@user:key').then((value: any) => {
      if (value) {
        resolve(value)
      }
      else {
        reject("errToken")
      }
    })
      .catch(() => {
        reject("errToken")
      });

  });
}

const API = (url: any, body?: any, token?: any, ) => {
  const data = url;
  let obj: any = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token,
      'x-mobile': Platform.OS,
    }
  }

  if (data.method === 'GET') {
    obj["method"] = data.method
  }
  else {
    obj["method"] = data.method
    obj["body"] = JSON.stringify(body)
  }
  //console.log("data.url",data.url)
  //console.log("data.url",obj)
  return new Promise((resolve: any, reject: any) => {
    fetch(data.url, obj).then(
      (response) => {
        if (response.status === 200) {
          return response.json()
        } else {
          reject('error code: ' + response.status)
        }
      }
    )
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
      })
  })
};