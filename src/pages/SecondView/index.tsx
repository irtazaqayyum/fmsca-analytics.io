import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import PivotTable from './components/PivotTable/PivotTable';
import PivotChart from './components/PivotChart/PivotChart';


const transformData = (data: { timestamp: string }[], period: 'year' | 'month' | 'week'): { period: string; count: number }[] => {
    const result: Record<string, number> = {};
  
    data.forEach((item) => {
      const date = new Date(item.timestamp);
      let key: string;
  
      switch (period) {
        case 'year':
          key = date.getFullYear().toString();
          break;
        case 'month':
          // Format as "YYYY-MM" for month grouping
          key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          break;
        case 'week':
          const weekNumber = Math.ceil((date.getDate() - date.getDay() + 1) / 7);
          // Format as "YYYY-WW" for week grouping
          key = `${date.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
          break;
        default:
          key = date.getFullYear().toString();
      }
  
      if (!result[key]) result[key] = 0;
      result[key]++;
    });
  
    // Convert the grouped data into an array suitable for the chart
    return Object.entries(result).map(([key, count]) => ({
      period: key,
      count: count as number,
    }));
  };

  const fillMissingPeriods = (data: { period: string; count: number }[], period: 'year' | 'month' | 'week') => {
    const filledData: { period: string; count: number }[] = [];
    const currentYear = new Date().getFullYear();
  
    if (period === 'year') {
      for (let year = 2020; year <= currentYear; year++) {
        const found = data.find((d) => d.period === year.toString());
        filledData.push({ period: year.toString(), count: found ? found.count : 0 });
      }
    } else if (period === 'month') {
      for (let month = 1; month <= 12; month++) {
        const key = `${currentYear}-${month.toString().padStart(2, '0')}`;
        const found = data.find((d) => d.period === key);
        filledData.push({ period: key, count: found ? found.count : 0 });
      }
    } else if (period === 'week') {
      for (let week = 1; week <= 52; week++) {
        const key = `${currentYear}-W${week.toString().padStart(2, '0')}`;
        const found = data.find((d) => d.period === key);
        filledData.push({ period: key, count: found ? found.count : 0 });
      }
    }
  
    return filledData;
  };
  
  
  

export const SecondView = () => {
    const csvData = useSelector((state: any) => state.Csv.records);
    const [period, setPeriod] = useState<'year' | 'month' | 'week'>('month');

    const handlePeriodChange = (event: SelectChangeEvent<'year' | 'month' | 'week'>) => {
        setPeriod(event.target.value as 'year' | 'month' | 'week');
    };

    const transformedData = transformData(csvData, period);
    const filledData = fillMissingPeriods(transformedData, period);
    return (
        <Box sx={{ padding: 2 }}>
            {/* <FormControl fullWidth>
                <InputLabel id="period-select-label">Period</InputLabel>
                <Select
                labelId="period-select-label"
                value={period}
                onChange={handlePeriodChange}
                label="Period"
                >
                <MenuItem value="year">Year</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="week">Week</MenuItem>
                </Select>
            </FormControl> */}

            <Box sx={{ mt: 3 }}>
                <PivotTable/>
            </Box>
            
            {/* <Box sx={{ mt: 3 }}>
                <PivotChart/>
            </Box> */}
        </Box>
      );
}
