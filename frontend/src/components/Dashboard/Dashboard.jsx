import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

import monthOptions from '../../utils/monthOptions';

import './Dashboard.css';

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState();
  const [search, setSearch] = useState();
  const [products, setProducts] = useState([]);

  const fetchAllProducts = async () => {
    try {
      const params = new URLSearchParams({
        page: page,
        search: search || '',
        month: month || '',
      })
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products/all?${params.toString()}`);
      setProducts(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleMonthChange = (selected) => {
    setMonth(selected);
  }
  const handleNext = () => { products.length === 0 ? setPage(page) : setPage(page + 1) }
  const handlePrev = () => { page === 1 ? setPage(1) : setPage(page - 1); }

  useEffect(() => {
    fetchAllProducts();
  }, [page, month])

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchAllProducts();
    }, 500);
    return () => clearTimeout(debounceFetch);
  }, [search]);

  return (
    <div className='dashboard'>
      <header>Transaction Dashboard</header>
      <div className="filterBox">
        <input type="text" className='searchbox' placeholder='Search Transaction' onChange={(e) => setSearch(e.target.value)} />
        <Select
          className="monthBox"
          name="month"
          placeholder='Select Month'
          options={monthOptions}
          onChange={(selected) => setMonth(selected.value)}
          styles={{
            control: (prev) => ({ ...prev, borderRadius: '1.5rem', backgroundColor: '#e3b63ce4', border: 'none' }),
            placeholder: (prev) => ({ ...prev, color: 'black', fontWeight: '600' }),
            indicatorSeparator: () => ({ display: 'none' })
          }}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {products.length !== 0 ? products.map((product) =>
            <tr key={product._id}>
              <td id='id'>{product.id}</td>
              <td id='title'>{product.title}</td>
              <td id='desc'>{product.description}</td>
              <td id='price'>{product.price}</td>
              <td id='category'>{product.category}</td>
              <td id='sold'>{product.sold ? 'Yes' : 'No'}</td>
              <td id='image'><img src={product.image} alt="product_image" /></td>
            </tr>
          ) : <tr><td colSpan={7}>No Transactions Available</td></tr>}
        </tbody>
      </table>
      <footer>
        <span>Page No : {page}</span>
        <div>
          <span onClick={handleNext}>Next</span> - <span onClick={handlePrev}>Previous</span>
        </div>
        <span>Per Page : 10</span>
      </footer>
    </div>
  )
}

export default Dashboard;