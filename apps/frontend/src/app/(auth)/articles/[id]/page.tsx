"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import formStyles from "@/styles/Form.module.scss";
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
export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles/${params.id}`
        );
        if (!response.ok) {
          throw new Error("Article not found");
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch article"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [params.id]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!article) return <div>Article not found</div>;
  return (
    <div className={formStyles.formWrapper}>
      <h1 style={{ fontSize: "2rem" }}>{article.title}</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Authors</h2>
        <p>{article.authors.join(", ")}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h2 className="font-semibold">Publication Year</h2>
          <p>{article.publication_year}</p>
        </div>
        <div>
          <h2 className="font-semibold">Source</h2>
          <p>{article.source}</p>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold">DOI</h2>
        <p>{article.doi}</p>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold">Summary</h2>
        <p>{article.summary}</p>
      </div>
      <h2>
        <Link href="/articles" className={formStyles.buttonItem}>
          Go Back?
        </Link>
      </h2>
    </div>
  );
}
