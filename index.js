const authenticationMode = 'ServicePrincipal'
const authorityUrl = 'https://login.microsoftonline.com/'
const scopeBase = 'https://analysis.windows.net/powerbi/api/.default'
const powerBiApiUrl = 'https://api.powerbi.com/'
const tenantId = process.env.POWER_BI_TENANT_ID

require('dotenv').config()
const axios = require('axios')
const { getAccessToken } = require('./PowerBIAuthenticate')

function getAvalableFeatures (accessToken) {
  return new Promise((resolve, reject) => {
    axios
      .get('https://api.powerbi.com/v1.0/myorg/availableFeatures', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

function getEmbedToken (accessToken, body) {
  return new Promise((resolve, reject) => {
    axios
      .post('https://api.powerbi.com/v1.0/myorg/yourEndpointHere', body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

async function main () {
  const header = await getAccessToken()
  // console.log(header);
  const accessToken = header.accessToken
  // const body = {
  //   reports: [
  //     {
  //       id: "691b6fd2-478f-4896-b089-e03f0a182130",
  //     },
  //   ],
  //   datasets: [
  //     {
  //       id: "40d2b297-e88c-4151-82f0-3bb4cb97ad77",
  //       xmlaPermissions: "ReadOnly",
  //     },
  //     {
  //       id: "b10104ae-7ca1-480a-9f16-2d5b915ee82f",
  //       xmlaPermissions: "ReadOnly",
  //     },
  //   ],
  //   targetWorkspaces: [
  //     {
  //       id: "c63e6e47-4b51-4a54-b99c-e98b0fb5c33b",
  //     },
  //   ],
  // };

  let data = await getAvalableFeatures(accessToken)
  // console.log(JSON.stringify(data, null, 2));
  console.log(JSON.stringify(data.features[1], null, 2))
  // let data2 = await getEmbedToken(accessToken, body);
  // console.log(data2);
}

main()
