import React, { useState } from 'react';

function SearchComponent({ entityName, entityIdKey, onSearch, onEdit, onDelete }) {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const handleSearchClick = async () => {
    if (!searchId) {
      setSearchError(`Please enter a ${entityName} ID.`);
      setSearchResult(null);
      return;
    }

    setSearchError(null);
    try {
      const record = await onSearch(searchId);
      setSearchResult(record);
    } catch (err) {
      setSearchResult(null);
      setSearchError(err.message || 'Record not found.');
    }
  };

  return (
    <div className="search-card">
      <h3 className="search-header">
        Search {entityName} by ID
      </h3>

      <div className="search-bar">
        <input
          type="number"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder={`Enter ${entityName} ID`}
          className="search-input"
        />
        <button
          onClick={handleSearchClick}
          className="btn btn-primary"
        >
          Search
        </button>
      </div>

      {searchError && (
        <div className="search-error">
          {searchError}
        </div>
      )}

      {searchResult && (
        <div className="search-result">
          <h4>
            {entityName} Details (ID {searchResult[entityIdKey]})
          </h4>

          <div className="search-result-card">
            {Object.entries(searchResult).map(([key, value]) => {
              if (key === entityIdKey) return null;

              const displayKey = key
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase());

              return (
                <p key={key}>
                  <strong>{displayKey}: </strong>
                  {value || 'N/A'}
                </p>
              );
            })}
          </div>

          <div className="search-result-actions">
            <button className="action-btn edit" type="button" onClick={() => onEdit?.(searchResult)}>
              Edit
            </button>
            <button className="action-btn delete" type="button" onClick={() => onDelete?.(searchResult[entityIdKey])}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchComponent;
