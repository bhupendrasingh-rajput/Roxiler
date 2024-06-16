import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import axios from 'axios';
import monthOptions from '../../utils/monthOptions';
import './Stats.css';

const Stats = () => {
  const [month, setMonth] = useState(monthOptions[0]);
  const [statsData, setStatsData] = useState();
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products/stats?month=${month.value}`);
      setStatsData(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchStats();
  }, [month])

  return (
    <div className='stats'>
      <div className='stats_header'>
        <h2>Statistics : </h2>
        <Select
          className="monthBox"
          name="month"
          placeholder='Select Month'
          defaultValue={month}
          options={monthOptions}
          onChange={(selected) => setMonth(selected)}
          styles={{
            control: (prev) => ({ ...prev, borderRadius: '1.5rem', backgroundColor: '#e3b63ce4', border: 'none' }),
            placeholder: (prev) => ({ ...prev, color: 'black', fontWeight: '600' }),
            indicatorSeparator: () => ({ display: 'none' })
          }}
        />
      </div>
      <div className='stats_data'>
        <div className='data_row'>
          <p>Total Sale</p>
          <p>{statsData?.sellAmount}</p>
        </div>
        <div className='data_row'>
          <p>Total Sold Items</p>
          <p>{statsData?.soldItems}</p>
        </div>
        <div className='data_row'>
          <p>Total Not Sold Items</p>
          <p>{statsData?.unsoldItems}</p>
        </div>
      </div>
    </div>
  )
}

export default Stats