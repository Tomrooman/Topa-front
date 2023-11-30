import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import StarBorder from '@mui/icons-material/StarBorder';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

import styles from './stats.module.scss';

const YearComponent = ({ stats, year, month, day }: { stats: any, year: number, month?: number, day?: number }) => {
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

    if (day) {
        selectedData = selectedData.trades;
    } else if (month) {
        selectedData = selectedData.days;
    } else {
        selectedData = selectedData.months;
    }

    return (
        <>
            <ListItemButton onClick={() =>
                setOpen(!open)
            }>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={selectedType + '' + selectedValue} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse className={styles[selectedType + "_content"]} in={open} timeout="auto" unmountOnExit>
                {selectedData.map((d: any, index: number) => selectedType !== 'Jour' ? <YearComponent key={year.toString() + d.value.toString()} stats={stats} year={year} month={month || d.value} day={month ? d.value : null} /> : <List key={year.toString() + month?.toString() + day?.toString() + index.toString()} component="div">
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Starred" />
                    </ListItemButton>
                </List>)}
            </Collapse>
        </>)
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
        // const formattedCandlesData = data.candles.map((d: any) => ({
        //     open: d.open,
        //     high: d.high,
        //     low: d.low,
        //     close: d.close,
        //     time: Math.round(d.start_timestamp / 1000)
        // }));
        setStats(data);
        console.log({ data })
    }

    return (
        <div style={{
            display: 'flex',
            height: '100%',
        }}>
            <List
                sx={{ width: '100%', maxWidth: '50%', bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                {stats.map((d: any) => <YearComponent key={d.value} stats={stats} year={d.value} />)}
            </List>
        </div >
    )
}

export default Stats
