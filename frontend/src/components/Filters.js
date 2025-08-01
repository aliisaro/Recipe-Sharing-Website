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
        classNamePrefix="filters-select"
        options={TypeOptions}
        placeholder="Type"
        onChange={(selected) => onFilterChange?.("type", selected)}
      />

      <Select
        classNamePrefix="filters-select"
        options={CuisineOptions}
        placeholder="Cuisine"
        onChange={(selected) => onFilterChange?.("cuisine", selected)}
      />

      <Select
        classNamePrefix="filters-select"
        options={TagOptions}
        placeholder="Tags"
        isMulti
        onChange={(selected) => onFilterChange?.("tags", selected)}
      />
    </div>
  );
};

export default Filters;
