import React from "react";
import Modal from "react-modal";
import formStyles from "@/styles/Form.module.scss";
import modalStyles from "@/styles/Modal.module.scss"

interface LoadSearchProps {
  callback: (searchState: {
    title: string;
    authors: string[];
    pubYearStart: number | "";
    pubYearEnd: number | "";
    doi: string;
  }) => void;
}

const LoadSearch: React.FC<LoadSearchProps> = ({ callback }) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [saved_searches, setSavedSearches] = React.useState<{ [name: string]: any }>({});

  const openModal = () => {
    loadFromStorage();
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  const loadFromStorage = () => {
    const raw = localStorage.getItem("saved_searches");
    setSavedSearches(raw ? JSON.parse(raw) : {});
  };

  const loadSearch = (searchState: any) => {
    callback(searchState);
    closeModal();
  };

  const deleteSearch = (name: string) => {
    const updated = { ...saved_searches };
    delete updated[name];
    localStorage.setItem("saved_searches", JSON.stringify(updated));
    setSavedSearches(updated);
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      color: 'black',
      width: '16rem',
    },
  };

  return (
    <div id="load-search">
      <button onClick={openModal} className={formStyles.buttonItem}>
        load search
      </button>
      <Modal
        appElement={typeof document !== "undefined" ? document.getElementById("app-root") ?? undefined : undefined}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Load Search Modal"
      >
        <h2>Load search</h2>
        <button
          onClick={closeModal}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            backgroundColor: "transparent",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
        <div style={{ marginTop: "1rem" }}>
          {Object.keys(saved_searches).length === 0 ? (
            <p>No saved searches.</p>
          ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {Object.entries(saved_searches).map(([name, search]) => (
              <li
                key={name}
                style={{
                  marginBottom: "1rem",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "0.5rem",
                }}
              >
                <strong>{name}</strong>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      loadSearch(search);
                    }}
                    style={{ color: "blue"}}
                  >
                    Load
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteSearch(name);
                    }}
                    style={{ color: "#e74c3c"}}
                  >
                    Delete
                  </a>
                </div>
              </li>
            ))}
          </ul>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LoadSearch;
