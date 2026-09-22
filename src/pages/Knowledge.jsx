import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Hero from '../components/UI/Hero';
import { fetchArticles, fetchArticleById } from '../services/knowledgeService';
import './Knowledge.css';

// Fallback placeholder articles — used when the Knowledge API is unavailable
const PLACEHOLDER_ARTICLES = [
  {
    id: '1',
    urlName: 'how-to-apply-for-a-grant',
    title: 'How to apply for an OAK Foundation grant',
    summary:
      'Overview of the grant application process from Letter of Inquiry to full proposal, including eligibility criteria and expected timelines.',
    categoryLabel: 'Grant-Making',
    lastPublishedDate: '2026-09-22',
  },
  {
    id: '2',
    urlName: 'reporting-requirements',
    title: "Understanding OAK Foundation's reporting requirements",
    summary:
      'What narrative and financial reports are expected from grantees, reporting frequency, deadlines, and how to submit through the portal.',
    categoryLabel: 'Grantee Resources',
    lastPublishedDate: '2026-09-22',
  },
  {
    id: '3',
    urlName: 'safeguarding-policy-partners',
    title: "OAK Foundation's safeguarding policy for partners",
    summary:
      "Summary of OAK's safeguarding commitments, partner expectations, and how to report concerns or incidents.",
    categoryLabel: 'Policies',
    lastPublishedDate: '2026-09-22',
  },
  {
    id: '4',
    urlName: 'faq-grantees',
    title: 'Frequently asked questions for OAK grantees',
    summary:
      'Answers to common questions about budget modifications, no-cost extensions, payment timelines, and who to contact.',
    categoryLabel: 'FAQ',
    lastPublishedDate: '2026-09-22',
  },
];

function Knowledge() {
  const { urlName } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState(PLACEHOLDER_ARTICLES);
  const [articleDetail, setArticleDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usingSalesforce, setUsingSalesforce] = useState(false);

  // ── Fetch article list from Salesforce ──────────────────────────
  const loadArticles = useCallback(async (query) => {
    setLoading(true);
    try {
      const result = await fetchArticles({ queryString: query, pageSize: 20 });
      if (result.articles.length > 0) {
        setArticles(result.articles);
        setUsingSalesforce(true);
      } else if (!query) {
        // No articles from API and no search — keep placeholders
        setArticles(PLACEHOLDER_ARTICLES);
        setUsingSalesforce(false);
      } else {
        setArticles([]);
      }
    } catch {
      // Keep placeholders on error
      if (!query) {
        setArticles(PLACEHOLDER_ARTICLES);
      }
      setUsingSalesforce(false);
    }
    setLoading(false);
  }, []);

  // Try loading from Salesforce on mount
  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // ── Search handler ──────────────────────────────────────────────
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (usingSalesforce && searchTerm) {
        loadArticles(searchTerm);
      } else if (!searchTerm) {
        loadArticles();
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm, usingSalesforce, loadArticles]);

  // Filter placeholders locally when not using Salesforce
  const filteredArticles = usingSalesforce
    ? articles
    : articles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // ── Article detail view ─────────────────────────────────────────
  useEffect(() => {
    if (!urlName) {
      setArticleDetail(null);
      return;
    }

    // First try to find in current articles list
    const local = articles.find((a) => a.urlName === urlName);
    if (local) {
      setArticleDetail(local);
    }

    // Also attempt to fetch full detail from API
    const fetchDetail = async () => {
      setLoading(true);
      const detail = await fetchArticleById(urlName);
      if (detail) {
        setArticleDetail(detail);
        setUsingSalesforce(true);
      }
      setLoading(false);
    };

    fetchDetail();
  }, [urlName, articles]);

  // ── Render: article detail ──────────────────────────────────────
  if (urlName) {
    if (loading && !articleDetail) {
      return (
        <div className="knowledge-page">
          <div className="container section">
            <p className="loading-text">Loading article...</p>
          </div>
        </div>
      );
    }

    if (!articleDetail) {
      return (
        <div className="knowledge-page">
          <div className="container section">
            <p>
              Article not found. <Link to="/knowledge">Back to Knowledge Base</Link>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="knowledge-page">
        <div className="container section">
          <nav className="breadcrumb">
            <Link to="/knowledge">Knowledge Base</Link>
            <span className="breadcrumb-sep">/</span>
            <span>{articleDetail.categoryLabel || articleDetail.articleType || 'Article'}</span>
            <span className="breadcrumb-sep">/</span>
            <span>{articleDetail.title}</span>
          </nav>
          <article className="article-detail">
            <span className="article-category">
              {articleDetail.categoryLabel || articleDetail.articleType || 'Article'}
            </span>
            <h1>{articleDetail.title}</h1>
            <p className="article-meta">
              Published {articleDetail.lastPublishedDate || articleDetail.lastModifiedDate || ''}
            </p>
            <div className="article-body">
              {articleDetail.body ? (
                <div dangerouslySetInnerHTML={{ __html: articleDetail.body }} />
              ) : (
                <>
                  <p>{articleDetail.summary}</p>
                  {!usingSalesforce && (
                    <p>
                      <em>
                        Full article content will be loaded from Salesforce Knowledge once the API
                        integration is complete.
                      </em>
                    </p>
                  )}
                </>
              )}
            </div>
          </article>
        </div>
      </div>
    );
  }

  // ── Render: article list ────────────────────────────────────────
  return (
    <div className="knowledge-page">
      <Hero
        label="Resources"
        title="Knowledge Base"
        subtitle="Find answers to common questions about grants, reporting, policies, and working with OAK Foundation."
      />

      <section className="section">
        <div className="container">
          <div className="knowledge-search">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {loading && <p className="loading-text">Searching...</p>}

          <div className="article-list">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                to={`/knowledge/${article.urlName}`}
                className="article-card"
              >
                <span className="article-category">
                  {article.categoryLabel || article.articleType || 'Article'}
                </span>
                <h3 className="article-title">{article.title}</h3>
                <p className="article-summary">{article.summary}</p>
                <span className="article-date">
                  {article.lastPublishedDate || ''}
                </span>
              </Link>
            ))}
            {!loading && filteredArticles.length === 0 && (
              <p className="no-results">No articles match your search. Try a different term.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Knowledge;
