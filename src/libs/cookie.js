/*
 * @Author: wangmeng
 * @Date: 2025-12-17 09:03:31
 * @LastEditors: 最后编辑者
 * @LastEditTime: 2026-02-04 18:05:48
 * @Description: 
 */
import Cookies from "js-cookie";

const TokenKey = "Authorization";
// const TokenKey = "Refresh-Token";
const SecretTokenKey = "secretToken";

export function getToken() {
  return Cookies.get(TokenKey);
  // return "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJJZCI6ImFkbWluIiwidXNlck5hbWUiOiLns7vnu5_nrqHnkIblkZgiLCJpc0FkbWluIjp0cnVlLCJ1c2VyVXVpZCI6IjE1Nzc3NTg3ODY5MDFmNTJlYzYyMjYzYTQ0NzEyYjg3Njk3NGI5OTNmZjIxNyIsImN1cnJlbnRVc2VyUm9sZXMiOlsxXSwiY3VzdG9tNSI6ImZhbHNlIiwiYnJvd3Nlck5hbWUiOiJDaHJvbWUgMTQiLCJzZXZlclJlbW90ZUlwIjoiMTAuMTIuMTAxLjE0NSIsImNoZWNrSWQiOiI0OGVjZjk3NzAwYTc0MmJiOGNjMWI3N2QxZjk3NGVkMiIsImlhdCI6MTc2MzY5NDQwNSwiZXhwIjoxNzYzNjk4MDA1fQ.Do4LZECPk09lhlGaB2CiMe098hs8B-bHfLUJinBWFHqfoEV81LGtIUk4YAtpO05CcXj8VUri8386lxqBAJAz7csnGXLgwcljXFfkopHUVODrT5pHXCt8tDTt9ityCIlv5ydmSIVAFjpC-aPfybcUGVSwSp66mlH4vExKz7DN20o02hRmzDIdRJdP-QmhyNb51Q2a8bUwiXIwj6YtMmlLql67OtAp3rPtH39PyLeSoUeTFre4C_SZiS3JDTjymM0sLAduAQ8Fh0XlbiOh_f8qJE3B304eOI-pUlW5jvc5np85IQ7Rq2w-wXIoqw7rTU4vigjBRXo4NudVgS6F_sgetQ";
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function setSecretToken(token) {
  return Cookies.set(SecretTokenKey, token);
}

export function getSecretToken() {
  return Cookies.get(SecretTokenKey);
}

export function removeSecretToken() {
  return Cookies.remove(SecretTokenKey);
}
