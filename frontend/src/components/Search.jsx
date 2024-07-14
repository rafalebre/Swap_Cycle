import React, { useState, useEffect } from "react";
import SearchMapComponent from "./SearchMapComponent"; // Importando o componente do mapa

const Search = () => {
  const [searchType, setSearchType] = useState("all");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [items, setItems] = useState([]);
  const [mapBounds, setMapBounds] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Define a quantidade de itens por página diretamente

  useEffect(() => {
    const handleBoundsChange = (event) => {
      setMapBounds({
        north: event.detail.north,
        east: event.detail.east,
        south: event.detail.south,
        west: event.detail.west,
      });
    };

    window.addEventListener("mapBoundsChanged", handleBoundsChange);

    return () => {
      window.removeEventListener("mapBoundsChanged", handleBoundsChange);
    };
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch(
        `http://localhost:5001/${
          searchType === "services"
            ? "service-categories"
            : "product-categories"
        }`
      );
      const data = await response.json();
      setCategories(data);
      setSubcategories([]); // Reset subcategories when type or category changes
    }
    if (searchType !== "all") {
      fetchCategories();
    } else {
      setCategories([]);
      setSubcategories([]);
    }
  }, [searchType]);

  useEffect(() => {
    async function fetchSubcategories() {
      if (selectedCategoryId) {
        const response = await fetch(
          `http://localhost:5001/${
            searchType === "services"
              ? "service-subcategories"
              : "product-subcategories"
          }/${selectedCategoryId}`
        );
        const data = await response.json();
        setSubcategories(data);
      } else {
        setSubcategories([]);
      }
    }
    fetchSubcategories();
  }, [selectedCategoryId, searchType]);

  useEffect(() => {
    async function fetchItems() {
      let queryParams = `type=${searchType}&category_id=${
        selectedCategoryId || ""
      }&subcategory_id=${selectedSubcategoryId || ""}`;
      if (mapBounds) {
        queryParams += `&north=${mapBounds.north}&south=${mapBounds.south}&east=${mapBounds.east}&west=${mapBounds.west}`;
      }
      const response = await fetch(
        `http://localhost:5001/search?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      setItems(data);
    }
    fetchItems();
  }, [searchType, selectedCategoryId, selectedSubcategoryId, mapBounds]);

  // Calculando os itens a serem exibidos na página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // Mudar a página
  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Selecionar um item da lista
  const selectItem = (lat, lng) => {
    window.dispatchEvent(new CustomEvent("itemSelected", {
      detail: { lat, lng }
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ width: "60%", padding: "20px" }}>
        <select onChange={(e) => setSearchType(e.target.value)} value={searchType}>
          <option value="all">All</option>
          <option value="products">Products</option>
          <option value="services">Services</option>
        </select>
        <select onChange={(e) => setSelectedCategoryId(e.target.value)} value={selectedCategoryId}>
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <select onChange={(e) => setSelectedSubcategoryId(e.target.value)} value={selectedSubcategoryId} disabled={!selectedCategoryId}>
          <option value="">Select a subcategory</option>
          {subcategories.map(subcategory => (
            <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
          ))}
        </select>
        <ul>
          {currentItems.map(item => (
            <li key={`${item.type}-${item.id}`} onClick={() => selectItem(item.latitude, item.longitude)} style={{ cursor: 'pointer' }}>
              <h4>{item.name}</h4>
              <p>Category: {item.category} ({item.subcategory})</p>
              <p>Estimated Value: {item.estimated_value}</p>
              <p>Location: {item.location}</p>
            </li>
          ))}
        </ul>
        <div>
          {Array.from({ length: Math.ceil(items.length / itemsPerPage) }, (_, i) => i + 1).map(number => (
            <button key={number} onClick={() => paginate(number)}>{number}</button>
          ))}
        </div>
      </div>
      <div style={{ width: "40%" }}>
        <SearchMapComponent />
      </div>
    </div>
  );
};

export default Search;
