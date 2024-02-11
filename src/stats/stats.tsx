import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

const tableContentStyle = {
    'padding': "4px 16px 4px 16px",
};

const tableHeaderStyle = {
    'padding': "16px 16px 16px 16px",
    'fontWeight': 'bold',
    'backgroundColor': '#f5f5f5',
};

const Row = ({ stats, year, month, day }: { stats: any, year: number, month?: number, day?: number }) => {
    const [open, setOpen] = useState(false);

    let selectedData = stats.find((d: any) => d.value === year);
    let selectedType = 'Année';
    let selectedValue = year;

    if (month) {
        selectedData = selectedData.months.find((d: any) => d.value === month);
        selectedType = 'Mois';
        selectedValue = month;
    }
    if (day) {
        selectedData = selectedData.days.find((d: any) => d.value === day);
        selectedType = 'Jour';
        selectedValue = day;
    }

    const selectedProfit = selectedData.profit;
    const selectedPercentage = selectedData.percentage_from_balance;

    if (day) {
        selectedData = selectedData.trades;
    } else if (month) {
        selectedData = selectedData.days;
    } else {
        selectedData = selectedData.months;
    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell sx={tableContentStyle}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={tableContentStyle} scope="row">
                    {selectedValue}
                </TableCell>
                <TableCell sx={tableContentStyle} align='right'>{selectedPercentage} %</TableCell>
                <TableCell sx={tableContentStyle} align="right">{Math.round(selectedProfit)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ padding: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {selectedType !== 'Jour' ?
                            <Table style={{ "display": "inline-table", "width": "100%" }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={tableHeaderStyle} />
                                        <TableCell sx={tableHeaderStyle}>{selectedType === "Année" ? 'Mois' : 'Jour'}</TableCell>
                                        <TableCell sx={tableHeaderStyle} align='right'>Pourcentage</TableCell>
                                        <TableCell sx={tableHeaderStyle} align="right">Profit</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedData.map((d: any) => <Row key={year.toString() + d.value.toString()} stats={stats} year={year} month={month || d.value} day={month ? d.value : day} />)}
                                </TableBody>
                            </Table>
                            : false}
                        {selectedType === 'Jour' ?
                            <Table style={{ "display": "inline-table", "width": "100%" }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={tableHeaderStyle}>Ouverture</TableCell>
                                        <TableCell sx={tableHeaderStyle}>Fermeture</TableCell>
                                        <TableCell sx={tableHeaderStyle} align="right">Profit</TableCell>
                                    </TableRow>
                                </TableHead>
                                {selectedData.map((d: any) =>
                                    <TableBody key={d.opened_at}>
                                        <TableRow >
                                            <TableCell sx={tableContentStyle} scope="row">
                                                {d.opened_at}
                                            </TableCell>
                                            <TableCell sx={tableContentStyle}>{d.closed_at}</TableCell>
                                            <TableCell sx={tableContentStyle} align="right">{Math.round(d.profit)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                            : false}
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment >
    );
}

const Stats = () => {
    const loaded = useRef(false);
    const [stats, setStats] = useState<any[]>([]);

    useEffect(() => {
        if (!loaded.current) {
            console.log('Stats')
            loaded.current = true;
            synchronizeData();
        }
    })

    const synchronizeData = async () => {
        const { data } = await axios.get(`http://localhost:5000/stats`);
        setStats(data.years);
        console.log({ data })
    }


    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={tableHeaderStyle} />
                        <TableCell sx={tableHeaderStyle}>Année</TableCell>
                        <TableCell sx={tableHeaderStyle} align='right'>Pourcentage</TableCell>
                        <TableCell sx={tableHeaderStyle} align="right">Profit</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stats.map((d: any) => <Row key={d.value} stats={stats} year={d.value} />)}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Stats;