import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { groupBy } from 'lodash';

interface PivotTableProps {
  data: { out_of_service_date: string; count: number }[];
}

const groupDataByPeriod = (data, period) => {
  const formatDate = (date, period) => {
    if (!date || typeof date !== 'string') {
      return null;
    }
  
    const dateParts = date.split('/');
    
    if (dateParts.length !== 3) {
      return null;
    }
  
    const [day, month, year] = dateParts;
    
    const dateObj = new Date(`${year}-${month}-${day}`);
    
    if (isNaN(dateObj.getTime())) {
      return null;
    }
  
    switch (period) {
      case 'Year':
        return dateObj.getFullYear();
      case 'Month':
        return `${dateObj.getFullYear()}-${('0' + (dateObj.getMonth() + 1)).slice(-2)}`;
      case 'Week':
        const startOfWeek = new Date(dateObj.setDate(dateObj.getDate() - dateObj.getDay()));
        return `${startOfWeek.getFullYear()}-${('0' + (startOfWeek.getMonth() + 1)).slice(-2)}-W${Math.ceil(startOfWeek.getDate() / 7)}`;
      default:
        return null;
    }
  };
  
  const grouped = groupBy(data, (item) => formatDate(item?.out_of_service_date, period));
  
  
  return Object.keys(grouped)
  .filter(([key, value]) => key != null && key != 'null' && value != 'null')
  .map((key) => ({
    period: key,
    count: grouped[key].length,
  }));
};



const PivotTable = () => {
  const data = useSelector((state: any) => state.Csv.records);
  const [period, setPeriod] = useState('Month');
  const groupedData = groupDataByPeriod(data, period);
  const filteredData = groupedData.filter(item => item.period !== 'null');

 

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
        <InputLabel>Group By</InputLabel>
        <Select value={period} onChange={handlePeriodChange} label="Group By">
          <MenuItem value="Year">Year</MenuItem>
          <MenuItem value="Month">Month</MenuItem>
          <MenuItem value="Week">Week</MenuItem>
        </Select>
      </FormControl>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedData.map((row) => (
              row.period!= "null" &&
              <TableRow key={row.period}>
                <TableCell>{row.period}</TableCell>
                <TableCell>{row.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <BarChart
        dataset={filteredData}
        xAxis={[{ scaleType: 'band', dataKey: 'period', label: 'Period' }]}
        series={[{ dataKey: 'count', label: 'Count' }]}
        width={1000}
        height={400}
        sx={{ mt: 4 }}
      />
    </>
  );
};

export default PivotTable;

