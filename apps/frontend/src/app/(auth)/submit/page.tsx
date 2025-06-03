"use client";

import { FormEvent, useEffect, useState } from "react";
import formStyles from "@/styles/Form.module.scss";
import { useRouter } from "next/navigation";

const NewDiscussion = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [source, setSource] = useState("");
  const [pubYear, setPubYear] = useState<number | "">("");
  const [doi, setDoi] = useState("");
  const [abstractText, setAbstractText] = useState("");
  const [linkedDiscussion, setLinkedDiscussion] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      router.push("/");
    }
  }, [router]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (authors.length === 0 || authors.some((a) => a.trim() === ""))
      newErrors.authors = "At least one author is required";
    if (!pubYear || isNaN(Number(pubYear)))
      newErrors.pubYear = "Valid publication year is required";
    if (!doi.trim()) newErrors.doi = "DOI is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            authors,
            source,
            publication_year: pubYear,
            doi,
            abstract: abstractText,
            linked_discussion: linkedDiscussion,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to submit article: ${response.statusText}`);
      }

      alert("Article submitted successfully!");
      setTitle("");
      setAuthors([]);
      setSource("");
      setPubYear("");
      setDoi("");
      setAbstractText("");
      setLinkedDiscussion("");
      setErrors({});
    } catch (error) {
      alert(error);
      console.error("Submit error:", error);
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
    <div className={formStyles.formWrapper}>
      <h1 style={{ fontSize: "2rem" }}>New Article</h1>
      <form className={formStyles.form} onSubmit={submitNewArticle}>
        <label htmlFor="title">Title:</label>
        <input
          className={formStyles.formItem}
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className={formStyles.error}>{errors.title}</p>}

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
        <div className={formStyles.leftAligned}>
          <button
            onClick={addAuthor}
            className={formStyles.buttonItem}
            type="button"
          >
            +
          </button>
        </div>
        {errors.authors && <p className={formStyles.error}>{errors.authors}</p>}

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
        {errors.pubYear && <p className={formStyles.error}>{errors.pubYear}</p>}

        <label htmlFor="doi">DOI:</label>
        <input
          className={formStyles.formItem}
          type="text"
          id="doi"
          value={doi}
          onChange={(e) => setDoi(e.target.value)}
        />
        {errors.doi && <p className={formStyles.error}>{errors.doi}</p>}

        <label htmlFor="abstract">Abstract:</label>
        <textarea
          className={formStyles.formTextArea}
          name="abstract"
          value={abstractText}
          onChange={(e) => setAbstractText(e.target.value)}
        />

        <button className={formStyles.formItem} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewDiscussion;
