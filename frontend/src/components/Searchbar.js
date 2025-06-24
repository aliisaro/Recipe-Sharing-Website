const Searchbar = ({ searchTerm, setSearchTerm }) => {
  return (
    <input
      type="text"
      placeholder="Type to search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};

export default Searchbar;
