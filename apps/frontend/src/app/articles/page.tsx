"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
interface Article {
  _id: string;
  title: string;
  authors: string[];
  source: string;
  publication_year: number;
  doi: string;
  summary: string;
  linked_discussion?: string;
  isModerated: boolean;
  createdAt: string;
}
export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch articles"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Articles</h1>
      <div className="grid gap-6">
        {articles.map((article) => (
          <div
            key={article._id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <Link href={`/articles/${article._id}`}>
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <div className="text-sm text-gray-600 mb-2">
                Authors: {article.authors.join(", ")}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Publication Year:</span>{" "}
                  {article.publication_year}
                </div>
                <div>
                  <span className="font-medium">Source:</span> {article.source}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
