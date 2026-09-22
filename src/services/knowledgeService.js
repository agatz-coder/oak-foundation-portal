/**
 * knowledgeService — fetches Knowledge articles from Salesforce's
 * Knowledge Support REST API via the Experience Cloud site.
 *
 * The Experience Cloud site acts as a proxy so the external React app can
 * access articles without an authenticated Salesforce session.
 *
 * API:  GET {siteUrl}/services/data/v67.0/support/knowledgeArticles
 * Docs: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_knowledge_support_articles.htm
 */
import { SF_CONFIG } from '../config/salesforce';

const BASE_URL = `${SF_CONFIG.siteUrl}${SF_CONFIG.knowledgeApiPath}`;

/**
 * Fetch a list of published Knowledge articles.
 *
 * @param {Object}  [options]
 * @param {string}  [options.queryString]  - Search term
 * @param {number}  [options.pageSize=10]  - Results per page
 * @param {number}  [options.pageNumber=1] - Page number
 * @returns {Promise<{ articles: Array, total: number }>}
 */
export async function fetchArticles({ queryString, pageSize = 10, pageNumber = 1 } = {}) {
  const params = new URLSearchParams({
    pageSize: String(pageSize),
    pageNumber: String(pageNumber),
  });

  if (queryString) {
    params.set('q', queryString);
  }

  const url = `${BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en-US',
      },
    });

    if (!response.ok) {
      throw new Error(`Knowledge API returned ${response.status}`);
    }

    const data = await response.json();

    // The API returns { articles: [...], currentPageUrl, nextPageUrl, pageNumber }
    return {
      articles: (data.articles || []).map(normalizeArticle),
      total: data.articles?.length ?? 0,
      pageNumber: data.pageNumber,
      nextPageUrl: data.nextPageUrl,
    };
  } catch (err) {
    console.error('[Knowledge] fetchArticles error:', err);
    // Return empty list so the UI can show placeholder articles
    return { articles: [], total: 0 };
  }
}

/**
 * Fetch a single article by its URL Name.
 *
 * @param {string} articleId - The Knowledge article ID
 * @returns {Promise<Object|null>}
 */
export async function fetchArticleById(articleId) {
  const url = `${BASE_URL}/${articleId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en-US',
      },
    });

    if (!response.ok) {
      throw new Error(`Knowledge API returned ${response.status}`);
    }

    const data = await response.json();
    return normalizeArticleDetail(data);
  } catch (err) {
    console.error('[Knowledge] fetchArticleById error:', err);
    return null;
  }
}

/**
 * Normalise a list-item article from the API response.
 */
function normalizeArticle(raw) {
  return {
    id: raw.id,
    knowledgeArticleId: raw.articleNumber || raw.id,
    urlName: raw.urlName,
    title: raw.title,
    summary: raw.summary || '',
    articleType: raw.articleType || '',
    lastPublishedDate: raw.lastPublishedDate || '',
    // The API sometimes returns category info differently
    categoryGroup: raw.categoryGroups?.[0]?.name || '',
    categoryLabel: raw.categoryGroups?.[0]?.selectedCategories?.[0]?.label || '',
  };
}

/**
 * Normalise a full article detail from the API response.
 */
function normalizeArticleDetail(raw) {
  // Extract article body from layoutItems
  let body = '';
  if (raw.layoutItems) {
    raw.layoutItems.forEach((item) => {
      if (item.type === 'RICH_TEXT_AREA' || item.type === 'TEXT_AREA') {
        body += item.value || '';
      }
    });
  }

  return {
    id: raw.id,
    urlName: raw.urlName,
    title: raw.title,
    summary: raw.summary || '',
    body,
    articleType: raw.articleType || '',
    lastPublishedDate: raw.lastPublishedDate || '',
    lastModifiedDate: raw.lastModifiedDate || '',
  };
}
