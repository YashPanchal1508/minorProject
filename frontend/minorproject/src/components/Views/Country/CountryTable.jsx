// import { useCountryContext } from "../../../Context/Country.context";

// /* eslint-disable react/prop-types */
// const CountryTable = ({ countries }) => {

//     const { deleteCountries ,fetchCountries } = useCountryContext();

//     const handleDelete = async (countryId) => {
//         try {
//           // Make API call to delete the country
//           await deleteCountries(countryId);
          
//           // After successful deletion, fetch updated countries
//           await fetchCountries();
//         } catch (error) {
//           console.error("Error deleting country:", error);
//         }
//       };

//     return (
//         <div className="w-[70%]">

//             <table className="border border-gray-300 rounded-md">
//                 <thead className="bg-gray-200 text-center">
//                     <tr>
//                         <th className="py-2 px-4 border-r border-b border-gray-300 w-[40%]">Country ID</th>
//                         <th className="py-2 px-4 border-r border-b border-gray-300">Name</th>
//                         <th className="py-2 px-4 border-r border-b border-gray-300">Country Code</th>
//                         <th className="py-2 px-4 border-r border-b border-gray-300">Phone Code</th>
//                         <th className="py-2 px-4 border-b border-gray-300 w-[20%]">Action</th>
//                     </tr>
//                 </thead>
//                 <tbody className="text-center">
//                     {
//                         countries.map((country) => (
//                             <tr key={country.countryid} className="hover:bg-gray-100 text-sm">
//                                 <td className="py-2 px-4 border-r border-b border-gray-300">{country.countryid}</td>
//                                 <td className="py-2 px-4 border-r border-b border-gray-300">{country.countryname}</td>
//                                 <td className="py-2 px-4 border-r border-b border-gray-300">{country.countrycode}</td>
//                                 <td className="py-2 px-4 border-r border-b border-gray-300">{country.phonecode}</td>
//                                 <td className="py-2 px-4 border-b border-gray-300 flex justify-center gap-2">
//                                     <button className="text-blue-500 hover:underline mr-2">Edit</button>
//                                     <button className="text-red-500 hover:underline" onClick={() => handleDelete(country.countryid)}>Delete</button>
//                                 </td>
//                             </tr>
//                         ))
//                     }
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default CountryTable