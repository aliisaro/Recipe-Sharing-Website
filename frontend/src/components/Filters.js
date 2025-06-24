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
      <ul>
        <h3>Filters</h3>
        <li>
          <Select
            options={TypeOptions}
            placeholder="Choose type:"
            onChange={(selected) => onFilterChange?.("type", selected)}
          />
        </li>
        <li>
          <Select
            options={CuisineOptions}
            placeholder="Choose cuisine:"
            onChange={(selected) => onFilterChange?.("cuisine", selected)}
          />
        </li>
        <li>
          <Select
            options={TagOptions}
            placeholder="Select tags:"
            isMulti
            onChange={(selected) => onFilterChange?.("tags", selected)}
            />
        </li>
      </ul>
    </div>
  );
};

export default Filters;
