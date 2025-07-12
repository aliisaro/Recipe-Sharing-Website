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

      <div className="select">
        <Select
          options={TypeOptions}
          placeholder="Choose type:"
          onChange={(selected) => onFilterChange?.("type", selected)}
        />
      </div>

      <div className="select">
        <Select
          options={CuisineOptions}
          placeholder="Choose cuisine:"
          onChange={(selected) => onFilterChange?.("cuisine", selected)}
        />
        </div>

      <div className="select">
        <Select
          options={TagOptions}
          placeholder="Select tags:"
          isMulti
          onChange={(selected) => onFilterChange?.("tags", selected)}
        />

      </div>
    </div>
  );
};

export default Filters;
