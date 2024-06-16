import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import monthOptions from '../../utils/monthOptions';

import { AgChartsReact } from 'ag-charts-react';

import './BarChart.css';

const BarChart = () => {
  const [month, setMonth] = useState(monthOptions[0]);
  const [barChartData, setBarChartData] = useState({});

  const fetchChartData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products/bar-chart?month=${month.value}`);
      const dataArray = Object.entries(response.data).map((entry, index) => ({ 'range': entry[0], 'items': entry[1] }));
      setBarChartData({ data: [...dataArray], series: [{ type: 'bar', xKey: 'range', yKey: 'items', fill: 'cyan' }] });
    } catch (err) {
      console.log(err);
    }
  }


  console.log(barChartData);

  useEffect(() => {
    fetchChartData();
  }, [month])
  return (
    <div className='barchart'>
      <div className='stats_header'>
        <h2>Bar Chart Stats : </h2>
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
      <div className='bar_chart_box'>
        <AgChartsReact options={barChartData} />
      </div>
    </div>

  )
}

export default BarChart