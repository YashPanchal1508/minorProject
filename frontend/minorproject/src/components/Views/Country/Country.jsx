import { useState, useEffect } from "react";
import Modal from "../utils/Modal";
import { useCountryContext } from "../../../Context/Country.context.jsx";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Country = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteConformation, setDeleteConformation] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [page, setPage] = useState(0);
  const [searchResults, setSearchResults] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");

  const {
    countries,
    fetchCountries,
    setCurrentPage,
    deleteCountries,
    addCountry,
    updateCountry,
    filterData,
    totalPage,
    currentPage,
    sort
  } = useCountryContext();

  let newPage = 1,
    rowsPerPage = 5;
    
  useEffect(() => {
    fetchCountries(newPage, rowsPerPage);
  }, [newPage]);

  const handleDelete = async (id) => {
    setDeleteConformation(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteCountries(deleteConformation);
      toast.success("Country deleted successfully!");
      if (countries.length === 1 && totalPage > 1) {
        const newPage = currentPage > 1 ? currentPage - 1 : 1;
        setCurrentPage(newPage);
        setPage(newPage);
        fetchCountries(newPage, rowsPerPage);
      } else {
        fetchCountries(currentPage, rowsPerPage);
      }
  
      setDeleteConformation(null);
    } catch (error) {
      console.error("Error deleting country:", error);
    }
  };

  const cancelDelete = () => {
    setDeleteConformation(null);
  };

  const handleOpenModal = (mode, country) => {
    setModalMode(mode);
    setSelectedCountry(country);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddCountry = (data) => {
    addCountry(data);
    setModalOpen(false);
  }

  const handleUpdate = async (formData) => {
    await updateCountry(selectedCountry.countryid, formData);
    toast.success("Country updated successfully!");
    setModalOpen(false);
  };

  const handleSearchChange = async (e) => {
    const country = "country";
    const eventValue = e.target.value;

    let searchData;
    if (isNaN(eventValue)) {
      searchData = {
        search: eventValue,
        code: "",
        limit: rowsPerPage,
        page: 1,
      };
    } else {
      searchData = {
        search: "",
        code: eventValue,
        limit: rowsPerPage,
        page: 1,
      };
    }

    if (searchData.search === "" && searchData.code === "") {
      fetchCountries(newPage, rowsPerPage);
      setSearchResults(false);
    } else {
      setSearchResults(true);
      filterData(country, searchData);
    }
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
    setPage(newPage);
    fetchCountries(newPage, rowsPerPage);
  };

  // console.log(countries)

  const handleSort = async(columnName) => {
    setSortOrder((prevOrder) =>( prevOrder === "asc" ? "desc" : "asc"));
    console.log(columnName)
    await sort('country',currentPage,rowsPerPage,columnName,sortOrder)
  };

  return (
    <>
      <section className="">
        <div className="my-0">
          <div className="w-[100%] flex justify-between">
          <div className="input-group w-[300px] gap-2">
            <input
              type="search"
              className="form-control rounded border-black-400 bg-transparent"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="search-addon"
              onChange={handleSearchChange}
              />
          </div>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => handleOpenModal("add", null)}
            >
            Add Country
          </button>
            </div>

          {isModalOpen && (
            <Modal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSave={selectedCountry ? handleUpdate : handleAddCountry}
              selectedCountry={selectedCountry}
              Mode={modalMode}
            />
          )}
        </div>

        <div className="flex justify-center items-center min-h-[calc(100vh-24rem)] relative flex-grow w-[100%] overflow-y-visible">
            <table className="border border-gray-300 rounded-md w-[100%]">
              <thead className="text-center">
                <tr>
                  <th className="py-2 px-4 border-r border-b border-gray-300 w-96">
                    Country ID
                  </th>
                  <th className="py-2 px-4 border-r border-b border-gray-300 cursor-pointer" onClick={() =>handleSort('countryname')}>
                   Country Name  {sortOrder === "asc" ? "▼": "▲"}
                  </th>
                  <th className="py-2 px-4 border-r border-b border-gray-300 cursor-pointer"  onClick={() =>handleSort('countrycode')}>
                     Country Code {sortOrder === "asc" ? "▼": "▲"}
                  </th>
                  <th className="py-2 px-4 border-r border-b border-gray-300 cursor-pointer" onClick={() =>handleSort('phonecode')}>
                    Phone Code {sortOrder === "asc" ? "▼": "▲"}
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 ">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-center max-h-96 overflow-y-auto">
                {
              Array.isArray(countries) && countries.length > 0 ?(
                countries.map((country) => (
                      <tr
                        key={country.countryid}
                        className="hover:bg-gray-100 text-sm"
                      >
                        <td className="py-2 px-4 border-r border-b border-gray-300">
                          {country.countryid}
                        </td>
                        <td className="py-2 px-4 border-r border-b border-gray-300">
                          {country.countryname} 
                        </td>
                        <td className="py-2 px-4 border-r border-b border-gray-300">
                          {country.countrycode}
                        </td>
                        <td className="py-2 px-4 border-r border-b border-gray-300">
                          {country.phonecode}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-300 flex justify-center gap-2">
                          <button
                            className="text-slate-700 hover:underline mr-2 font-bold"
                            onClick={() => handleOpenModal("edit", country)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-500 hover:underline font-bold"
                            onClick={() => handleDelete(country.countryid)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) :
                    (
                      <tr>
                        <td colSpan={5} className="text-[200%]">
                          No Data Found!
                        </td>
                      </tr>
                    )
                }
              </tbody>
            </table>
          </div>

        <Stack className="flex justify-center items-center">
          {!searchResults && countries && Array.isArray(countries) && (
            <Pagination
              count={totalPage}
              page={currentPage}
              color="primary"
              onChange={handleChangePage}
            />
          )}
        </Stack>
      </section>

      {deleteConformation && (
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50 "></div>
          <div className="bg-white p-8 rounded-md z-20">
            <p>Are you sure you want to delete this country?</p>
            <div className="mt-4 flex justify-end">
              <button
                className="mr-4 text-white bg-opacity-75 z-50 p-2 hover:bg-opacity-100 bg-blue-600 rounded-md"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="text-white bg-red-500 bg-opacity-75 z-50 p-2 hover:bg-opacity-100 rounded-md"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Country;



