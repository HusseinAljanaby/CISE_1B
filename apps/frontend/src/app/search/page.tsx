"use client";

import { FormEvent, useState } from "react";
import formStyles from "@/styles/Form.module.scss";
import resultsStyles from "@/styles/Results.module.scss"

const SearchArticles = () => {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [source, setSource] = useState("");
  const [pubYear, setPubYear] = useState<number | "">("");
  const [doi, setDoi] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim() && authors.length === 0 && !source && !pubYear && !doi.trim()) {
      newErrors.title = "Please enter at least one search field";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildQueryString = () => {
    const queryParams: string[] = [];

    if (title) queryParams.push(`title=${encodeURIComponent(title)}`);
    if (authors.length > 0) authors.forEach((author) => queryParams.push(`authors[]=${encodeURIComponent(author)}`));
    if (source) queryParams.push(`source=${encodeURIComponent(source)}`);
    if (pubYear) queryParams.push(`publication_year=${encodeURIComponent(pubYear)}`);
    if (doi) queryParams.push(`doi=${encodeURIComponent(doi)}`);

    return queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  };

  const submitSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const queryString = buildQueryString();
      const response = await fetch(`http://localhost:3001/api/articles${queryString}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
      setLoading(false);
    } catch (error) {
      alert(error);
      console.error("Search error:", error);
      setLoading(false);
    }
  };

  const addAuthor = () => {
    setAuthors(authors.concat([""]));
  };

  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const changeAuthor = (index: number, value: string) => {
    setAuthors(authors.map((oldVal, i) => (i === index ? value : oldVal)));
  };

  return (
    <div className={formStyles.container}>
      <div className={formStyles.header}>SPEED</div>
      <div className={formStyles.formWrapper}>
        <h1 style={{ fontSize: "2rem" }}>Search Articles</h1>
        <form className={formStyles.form} onSubmit={submitSearch}>
          <label htmlFor="title">Title:</label>
          <input
            className={formStyles.formItem}
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Authors:</label>
          {authors.map((author, index) => (
            <div key={index} className={formStyles.arrayItem}>
              <input
                type="text"
                value={author}
                onChange={(e) => changeAuthor(index, e.target.value)}
                className={formStyles.formItem}
              />
              <button
                onClick={() => removeAuthor(index)}
                className={formStyles.buttonItem}
                type="button"
              >
                -
              </button>
            </div>
          ))}
          <button
            onClick={addAuthor}
            className={formStyles.buttonItem}
            style={{ marginLeft: "auto" }}
            type="button"
          >
            +
          </button>

          <label htmlFor="source">Source:</label>
          <input
            className={formStyles.formItem}
            type="text"
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />

          <label htmlFor="pubYear">Publication Year:</label>
          <input
            className={formStyles.formItem}
            type="number"
            id="pubYear"
            value={pubYear}
            onChange={(e) =>
              setPubYear(e.target.value === "" ? "" : parseInt(e.target.value))
            }
          />

          <label htmlFor="doi">DOI:</label>
          <input
            className={formStyles.formItem}
            type="text"
            id="doi"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
          />

          {errors.title && <p className={formStyles.error}>{errors.title}</p>}

          <button className={formStyles.buttonItem} type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {results.length > 0 && (
          <div>
            <h2 className={resultsStyles.resultsHeader}>Search Results</h2>
            <ul>
              {results.map((result) => (
                <li key={result._id} className={resultsStyles.result}>
                  <h3>{result.title}</h3>
                  <p>Authors: {result.authors.join(", ")}</p>
                  <p><a href={result.source}>[source link]</a></p>
                  <p>DOI: {result.doi}</p>
                  <p>Publication Year: {result.publication_year}</p>
                  <p>{result.summary}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchArticles;
