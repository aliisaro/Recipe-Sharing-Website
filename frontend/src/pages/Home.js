import Select from "react-select";

const Home = () => {

  const SortByOptions = [
    { value: "trending", label: "trending" },
    { value: "date", label: "date" },
    { value: "best reviews", label: "best reviews" },
  ];

  const TypeOptions = [
    { value: "none", label: "none" },
    { value: "drinks", label: "drinks"},
    { value: "breakfeast", label: "breakfeast" },
    { value: "lunch", label: "lunch" },
    { value: "dinner", label: "dinner" },
    { value: "dessert", label: "dessert" },
    { value: "snacks", label: "snacks" },
  ];

  const CuisineOptions = [
    { value: "none", label: "none" },
    { value: "asian", label: "asian" },
    { value: "african", label: "african" },
    { value: "european", label: "european" },
    { value: "oceanian", label: "oceanian" },
    { value: "north american", label: "north american" },
    { value: "south american", label: "south american" },
    { value: "middle eastern", label: "middle eastern" },
    { value: "mediterranean", label: "mediterranean" },
  ];

  return (
    <div className="home">
      <h1>Explore recipes</h1>

      <div className="item" style={{ flexGrow: 6 }}>
      </div>

      <div className="item" style={{ flexGrow: 1 }}>
        <ul>
          <h3 style={{ textAlign: "center" }}>Filters</h3>
          <li>
            Sort by: <Select options={SortByOptions} />
          </li>
          <li>
            Type: <Select options={TypeOptions} />
          </li>
          <li>
            Cuisine: <Select options={CuisineOptions} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
