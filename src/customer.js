import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import searchIcon from './images/search.png';
import sortIcon from './images/sorting.png';
const CustomerTable = () => {
  const [customer, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(20);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  // Filter and sort logic remains the same

  // Define sortedCustomers after fetching the data
  const filteredCustomers = customer.filter(customer =>
    customer.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCustomers = filteredCustomers.sort((a, b) => {
   
    if (sortOption === 'date') {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (sortOption === 'time') {
      const timeA = new Date(a.created_at);
      const timeB = new Date(b.created_at);

      if (timeA.getHours() < 12 && timeB.getHours() < 12) {
        return timeA - timeB;
      } else if (timeA.getHours() >= 12 && timeB.getHours() >= 12) {
        return timeA - timeB;
      } else {
        if (timeA.getHours() < 12) {
          return -1;
        } else {
          return 1;
        }
      }
    } else {
      return 0;
    }
  });

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = sortedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto">
      <h1 className="text-5xl font-semibold my-4 text-center">Customer Data</h1>
      <div className="flex justify-center mb-4">
        <img src={searchIcon} alt="Search Icon" className="w-6 h-6 mr-2 mt-1" />
        <input
          type="text"
          placeholder="Search by customer name or location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-700 hover:border-gray-900 rounded-md w-1/2"
        />
        <label className="mr-2">Sort by:</label>
        <img src={sortIcon} alt="Sort Icon" className="w-6 h-6 mr-2 mt-1" />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Option</option>
          <option value="date">Date</option>
          <option value="time">Time</option>
         
          
        </select>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4 border">S.no</th>
            <th className="py-2 px-4 border">Customer Name</th>
            <th className="py-2 px-4 border">Age</th>
            <th className="py-2 px-4 border">Phone</th>
            <th className="py-2 px-4 border">Location</th>
            <th className="py-2 px-4 border">Created At</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {currentCustomers.map((customer, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
              <td className="py-2 px-4 border">{customer.sno}</td>
              <td className="py-2 px-4 border">{customer.customer_name}</td>
              <td className="py-2 px-4 border">{customer.age}</td>
              <td className="py-2 px-4 border">{customer.phone}</td>
              <td className="py-2 px-4 border">{customer.location}</td>
              <td className="py-2 px-4 border">{format(new Date(customer.created_at), 'dd-MM-yyyy  HH:mm a')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(sortedCustomers.length / customersPerPage) }).map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)} className="mx-1 px-3 py-1 bg-blue-500 text-white rounded-md">
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomerTable;
