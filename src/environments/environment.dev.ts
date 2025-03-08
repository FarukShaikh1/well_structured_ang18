export const environmentDev = {
  production: false,
  // serverUrl: 'https://localhost:44343',
  // serverUrl: 'https://localhost:7069/',
   serverUrl:  'http://localhost:8181/',
  apiPrefix: 'api',
  msalConfig: {
    auth: {
      clientId: 'e752795e-c2ae-44b5-b128-668abedd461d',
      authority: 'https://login.microsoftonline.com/ff00942c-81e2-4530-b90f-4e7d35c20644',
      redirectUri: 'http://localhost:4200/home',
      postLogoutRedirectUri: 'http://localhost:4200'
    }
  },
  apiConfig: {
    scopes: ['api://057cdc86-008c-41b0-b766-cdf91b956c92/ReadWrite'],
    uri: 'https://graph.microsoft.com/v1.0/me'
  },
  ssoEmailDomains: ['Application.com', 'cfbm.com', 'skbiotek.ie', 'apfc.com', 'yposkesi.com'],

  // Local
  oktaConfig: {
    clientId: '0oak77ummws4KkUwg5d7',
    issuer: 'https://dev-04327378.okta.com/oauth2/default',
    redirectUri: window.location.origin + '/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
  }

  // Application Okta configs
  // oktaConfig: {
  //   clientId: '0oahqvs1awk4Jcjni1d7',
  //   issuer: 'https://cfbm.oktapreview.com',
  //   redirectUri: 'https://dev.Application.com/login/callback',
  //   scopes: ['openid', 'profile', 'email'],
  //   pkce: true,
  // }
};
