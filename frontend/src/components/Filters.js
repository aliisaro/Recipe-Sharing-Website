import React from "react";
import Select from "react-select";

const Filters = ({
  TypeOptions,
  CuisineOptions,
  TagOptions,
  onFilterChange,
}) => {
  return (
    <div className="filters">
      <Select
        options={TypeOptions}
        placeholder="Type"
        onChange={(selected) => onFilterChange?.("type", selected)}
      />

      <Select
        options={CuisineOptions}
        placeholder="Cuisine"
        onChange={(selected) => onFilterChange?.("cuisine", selected)}
      />

      <Select
        options={TagOptions}
        placeholder="Tags"
        isMulti
        onChange={(selected) => onFilterChange?.("tags", selected)}
      />
    </div>
  );
};

export default Filters;
