const Searchbar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="searchbar-wrapper">
      <input
        type="text"
        placeholder="Type to search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default Searchbar;
