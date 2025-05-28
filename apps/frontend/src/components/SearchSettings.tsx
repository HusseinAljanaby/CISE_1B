import React from "react";
import formStyles from "@/styles/Form.module.scss"
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

interface SearchSettings {
}

const SearchSettings: React.FC<SearchSettings> = () => {
  const openSettings = () => {
    console.debug("open settings");
    setIsOpen(true);
  }
  
  const [modalIsOpen, setIsOpen] = React.useState(false);
  
  function closeModal() {
    setIsOpen(false);
  }
  
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const columnKeys = ["title", "authors", "claim", "doi", "publication_year", "summary"];

  const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const stored = localStorage.getItem("searchColumnVisibility");
    if (stored) {
      setVisibleColumns(JSON.parse(stored));
    } else {
      const defaultVisibility = Object.fromEntries(columnKeys.map(key => [key, true]));
      setVisibleColumns(defaultVisibility);
    }
  }, []);

  const toggleColumn = (key: string) => {
    const updated = {
      ...visibleColumns,
      [key]: !visibleColumns[key],
    };
    setVisibleColumns(updated);
    localStorage.setItem("searchColumnVisibility", JSON.stringify(updated));
  };

  return (
    <div id="search-settings">
      <button onClick={openSettings} className={formStyles.buttonItem}>settings</button>
      <Modal
        appElement={typeof document !== 'undefined' ? document.getElementById('app-root') ?? undefined : undefined}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>Column Visibility</h2>
        <button onClick={closeModal}>close</button>
        <div>
          {columnKeys.map((key) => (
            <div key={key}>
              <label>
                <input
                  type="checkbox"
                  checked={visibleColumns[key]}
                  onChange={() => toggleColumn(key)}
                />
                {key}
              </label>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default SearchSettings;