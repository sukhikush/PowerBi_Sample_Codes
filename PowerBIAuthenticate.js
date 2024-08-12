// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

const getAccessToken = async function () {
  // Create a config variable that store credentials from config.json
  //   const config = require("../config/config.js");

  const config = {
    authenticationMode: process.env.POWER_BI_AUTHENTICATION_MODE,
    authorityUrl: process.env.POWER_BI_AUTHORITY_URL,
    scopeBase: process.env.POWER_BI_SCOPE_BASE,
    powerBiApiUrl: process.env.POWER_BI_API_URL,
    clientId: process.env.POWER_BI_CLIENT_ID,
    clientSecret: process.env.POWER_BI_CLIENT_SECRET,
    tenantId: process.env.POWER_BI_TENANT_ID,
  };

  // Use MSAL.js for authentication
  const msal = require("@azure/msal-node");

  const msalConfig = {
    auth: {
      clientId: config.clientId,
      authority: `${config.authorityUrl}${config.tenantId}`,
    },
  };

  // Check for the MasterUser Authentication
  if (config.authenticationMode.toLowerCase() === "masteruser") {
    const clientApplication = new msal.PublicClientApplication(msalConfig);

    const usernamePasswordRequest = {
      scopes: [config.scopeBase],
      username: config.pbiUsername,
      password: config.pbiPassword,
    };

    return clientApplication.acquireTokenByUsernamePassword(
      usernamePasswordRequest
    );
  }

  // Service Principal auth is the recommended by Microsoft to achieve App Owns Data Power BI embedding
  if (config.authenticationMode.toLowerCase() === "serviceprincipal") {
    msalConfig.auth.clientSecret = config.clientSecret;
    const clientApplication = new msal.ConfidentialClientApplication(
      msalConfig
    );

    const clientCredentialRequest = {
      scopes: [config.scopeBase],
    };

    return clientApplication.acquireTokenByClientCredential(
      clientCredentialRequest
    );
  }
};

module.exports.getAccessToken = getAccessToken;
