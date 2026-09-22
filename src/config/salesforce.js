/**
 * Salesforce Configuration for OAK Foundation Portal
 *
 * These values connect the React app to the Salesforce org's
 * Embedded Service Deployment (MIAW) and Knowledge API.
 */

export const SF_CONFIG = {
  // Org ID (confirmed from org discovery)
  orgId: '00Dg700000GH4dvEAD',

  // Embedded Service Deployment API Name
  deploymentApiName: 'Oak_Selfhelp',

  // Experience Cloud Site URL (ESW Oak Selfhelp)
  siteUrl: 'https://trailsignup-a15be389d2c0be.my.site.com/ESWOakSelfhelp1789740723669vforcesite',

  // SCRT2 URL
  scrt2Url: 'https://trailsignup-a15be389d2c0be.my.salesforce-scrt.com',

  // Instance URL
  instanceUrl: 'https://trailsignup-a15be389d2c0be.my.salesforce.com',

  // Knowledge API base path (via Experience Cloud site)
  knowledgeApiPath: '/services/data/v67.0/support/knowledgeArticles',

  // Chat configuration
  chat: {
    height: '550px',
    enableDebugLogs: false,
    showCannedPrompts: true,
    cannedPrompts: [
      'How do I apply for a grant?',
      'What are the reporting requirements?',
      "Tell me about OAK's safeguarding policy",
    ],
  },
};
