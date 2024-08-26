import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, TextField, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import { BarChart } from '@mui/x-charts/BarChart';
import Papa from 'papaparse';
import { addRecords, getRecords } from '../../store/record/actions';
import { set, get } from 'idb-keyval';
import ShareIcon from '@mui/icons-material/Share';

const validateField = (field, value) => {
    switch (field) {
        case 'created_dt':
            return !isNaN(new Date(value).getTime());
        case 'drivers':
            return typeof value === 'number' && !isNaN(value);
        default:
            return true;
    }
};

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 130, editable: true, type: 'number' },
    { field: 'created_dt', headerName: 'Created At', width: 130, editable: true },
    { field: 'credit_score', headerName: 'Credit Score', width: 130, editable: true, type: 'number' },
    { field: 'data_source_modified_at', headerName: 'Modified Data Source', width: 130, editable: true },
    { field: 'dba_name', headerName: 'DBA name', width: 90, editable: true, type: 'string' },
    { field: 'drivers', headerName: 'Drivers', width: 130, editable: true, type: 'number' },
    { field: 'duns_number', headerName: 'Duns Number', width: 130, editable: true, type: 'string' },
    { field: 'entity_type', headerName: 'Entity Type', width: 130, editable: true, type: 'string' },
    { field: 'legal_name', headerName: 'Legal name', width: 130, editable: true, type: 'string' },
    { field: 'm_city', headerName: 'M_City', width: 130, editable: true, type: 'string' },
    { field: 'm_state', headerName: 'M_State', width: 130, editable: true, type: 'string' },
    { field: 'm_street', headerName: 'M_Street', width: 130, editable: true, type: 'string' },
    { field: 'm_zip_code', headerName: 'M_Zip_Code', width: 130, editable: true, type: 'string' },
    { field: 'mailing_address', headerName: 'Mailing Address', width: 130, editable: true, type: 'string' },
    { field: 'mc_mx_ff_number', headerName: 'Mc_Mx_Ff_Number', width: 130, editable: true, type: 'string' },
    { field: 'mcs_150_form_date', headerName: 'Mcs_150_Form_Date', width: 130, editable: true},
    { field: 'mcs_150_mileage_year', headerName: 'Mcs_150_Mileage_Year', width: 130, editable: true, type: 'number' },
    { field: 'operating_status', headerName: 'Operating Status', width: 130, editable: true, type: 'string' },
    { field: 'out_of_service_date', headerName: 'Out_Of_Service_Date', width: 130, editable: true},
    { field: 'p_city', headerName: 'P_city', width: 130, editable: true, type: 'string' },
    { field: 'p_state', headerName: 'P_state', width: 130, editable: true, type: 'string' },
    { field: 'p_street', headerName: 'P_street', width: 130, editable: true, type: 'string' },
    { field: 'p_zip_code', headerName: 'P_zip_code', width: 130, editable: true, type: 'string' },
    { field: 'phone', headerName: 'Phone', width: 130, editable: true, type: 'string' },
    { field: 'physical_address', headerName: 'Physical Address', width: 130, editable: true, type: 'string' },
    { field: 'power_units', headerName: 'Power Units', width: 130, editable: true, type: 'number' },
    { field: 'record_status', headerName: 'Record Status', width: 130, editable: true, type: 'string' },
    { field: 'state_carrier_id_number', headerName: 'State_Carrier_Id_Number', width: 130, editable: true, type: 'string' },
    { field: 'usdot_number', headerName: 'USdot_Number', width: 130, editable: true, type: 'string' },
];

const CsvFileInput = ({ onFileLoad }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                chunk: async (results) => {
                    await set('csvData', results.data);
                    onFileLoad(results.data);
                },
                complete: () => {
                    console.log('CSV file successfully processed and stored');
                },
            });
        }
    };

    return (
        <Button>
            <input type="file" onChange={handleFileChange} />
        </Button>
    );
};

const countByMonth = (data) => {
    const monthCounts = Array(12).fill(0);

    data.forEach((item) => {
        const dateStr = item.out_of_service_date;

        if (dateStr) {
            const [day, month, year] = dateStr.split('/');
            if (day && month && year) {
                const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                const monthIndex = date.getMonth();
                if (monthIndex >= 0 && monthIndex < 12) {
                    monthCounts[monthIndex]++;
                }
            }
        }
    });

    return monthCounts;
};

const transformDataForChart = (monthCounts) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months.map((month, index) => ({
        month,
        count: monthCounts[index] || 0
    }));
};

export default function FirstView() {
    const dispatch = useDispatch();
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const serializedData = urlParams.get('data');
            const query = urlParams.get('search') || '';

            let parsedData = [];
            if (serializedData) {
                try {
                    parsedData = JSON.parse(decodeURIComponent(serializedData));
                } catch (error) {
                    console.error('Failed to parse data from URL');
                }
            } else {
                parsedData = await get('csvData');
            }

            if (parsedData) {
                setRows(parsedData);
                setFilteredRows(
                    parsedData.filter((row) =>
                        Object.values(row).some(value =>
                            value.toString().toLowerCase().includes(query.toLowerCase())
                        )
                    )
                );
                dispatch(addRecords(parsedData));
            } else {
                dispatch(getRecords([]));
            }

            setSearchQuery(query);
        };

        loadData();
    }, [dispatch]);

    useEffect(() => {
        // Recalculate the chart data whenever filteredRows change
        const monthCounts = countByMonth(filteredRows);
        const transformedData = transformDataForChart(monthCounts);
        setChartData(transformedData);
    }, [filteredRows]);

    const handleProcessRowUpdate = async (newRow) => {
        const isValid = Object.keys(newRow).every((field) => validateField(field, newRow[field]));
        if (!isValid) {
            alert('Validation failed. Please correct the errors and try again.');
            return null;
        }

        const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
        setRows(updatedRows);
        setFilteredRows(updatedRows.filter((row) =>
            Object.values(row).some(value =>
                value.toString().toLowerCase().includes(searchQuery.toLowerCase())
            )
        ));
        await set('csvData', updatedRows);
        return newRow;
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = rows.filter((row) =>
            Object.values(row).some(value =>
                value?.toString().toLowerCase().includes(query)
            )
        );
        setFilteredRows(filtered);
    };

    const generateShareableLink = () => {
        const serializedData = encodeURIComponent(JSON.stringify(rows));
        const query = encodeURIComponent(searchQuery);
        const url = `${window.location.origin}${window.location.pathname}?data=${serializedData}&search=${query}`;
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    };

    const handleFileLoad = (csvData) => {
        setLoading(true);
        setRows(csvData);
        setFilteredRows(csvData);
        dispatch(addRecords(csvData));
        setLoading(false);
    };

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CsvFileInput onFileLoad={handleFileLoad} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearch}
                    fullWidth
                />
                <IconButton onClick={generateShareableLink}>
                    <ShareIcon />
                </IconButton>
            </Box>
            <DataGrid
                rows={filteredRows}
                columns={columns}
                processRowUpdate={handleProcessRowUpdate}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                checkboxSelection
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <BarChart
                    dataset={chartData}
                    loading={loading}
                    xAxis={[{ scaleType: 'band', dataKey: 'month', label: 'Month' }]}
                    series={[{ dataKey: 'count', label: 'Count' }]}
                    width={1000}
                    height={400}
                />
            </Box>
        </Box>
    );
}
