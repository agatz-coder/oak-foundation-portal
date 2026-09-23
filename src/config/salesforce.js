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
  deploymentApiName: 'Oaki_External_Help',

  // Experience Cloud Site URL (ESW Oaki External Help)
  siteUrl: 'https://trailsignup-a15be389d2c0be.my.site.com/ESWOakiExternalHelp1790156894075',

  // SCRT2 URL
  scrt2Url: 'https://trailsignup-a15be389d2c0be.my.salesforce-scrt.com',

  // Instance URL
  instanceUrl: 'https://trailsignup-a15be389d2c0be.my.salesforce.com',

  // Knowledge API base path (via Experience Cloud site)
  knowledgeApiPath: '/services/data/v67.0/support/knowledgeArticles',

  // Chat configuration
  chat: {
    height: '550px',
    enableDebugLogs: true,
    showCannedPrompts: true,
    cannedPrompts: [
      'How do I apply for a grant?',
      'What are the reporting requirements?',
      "Tell me about OAK's safeguarding policy",
    ],
  },
};
