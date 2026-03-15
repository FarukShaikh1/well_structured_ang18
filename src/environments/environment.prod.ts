export const environment = {
  production: true,

  serverUrl: 'https://fmscollectionapi-cafuhmb0gbg6hhew.centralindia-01.azurewebsites.net/',
  apiPrefix: 'api',

  msalConfig: {
    auth: {
      clientId: 'e752795e-c2ae-44b5-b128-668abedd461d',
      authority: 'https://login.microsoftonline.com/ff00942c-81e2-4530-b90f-4e7d35c20644',
      // ⚠️ Must match the redirect URI registered in Azure AD app registration
      redirectUri: 'https://fmscollection.azurewebsites.net/home',
      postLogoutRedirectUri: 'https://fmscollection.azurewebsites.net'
    }
  },

  apiConfig: {
    scopes: ['api://057cdc86-008c-41b0-b766-cdf91b956c92/ReadWrite'],
    uri: 'https://graph.microsoft.com/v1.0/me'
  },

  oktaConfig: {
    clientId: '0oak77ummws4KkUwg5d7',
    issuer: 'https://dev-04327378.okta.com/oauth2/default',
    redirectUri: window.location.origin + '/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
  }
};
