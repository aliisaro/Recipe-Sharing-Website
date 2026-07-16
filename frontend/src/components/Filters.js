import React from "react";
import Select from "react-select";

const Filters = ({
  TypeOptions,
  CuisineOptions,
  TagOptions,
  onFilterChange,
}) => {
  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;
  const selectProps = {
    classNamePrefix: "filters-select",
    menuPortalTarget,
    menuPosition: "fixed",
    styles: {
      menuPortal: (base) => ({ ...base, zIndex: 3000 }),
    },
  };

  return (
    <div className="filters">
      <Select
        {...selectProps}
        options={TypeOptions}
        placeholder="Type"
        onChange={(selected) => onFilterChange?.("type", selected)}
      />

      <Select
        {...selectProps}
        options={CuisineOptions}
        placeholder="Cuisine"
        onChange={(selected) => onFilterChange?.("cuisine", selected)}
      />

      <Select
        {...selectProps}
        options={TagOptions}
        placeholder="Tags"
        isMulti
        onChange={(selected) => onFilterChange?.("tags", selected)}
      />
    </div>
  );
};

export default Filters;
