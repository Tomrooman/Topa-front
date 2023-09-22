import { Button, SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { ColorType, CrosshairMode, UTCTimestamp, createChart } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import SelectComponent from '../components/selectComponent';

const Analysis = () => {
    const chartContainerRef = useRef({} as HTMLDivElement);
    const getResponse = useRef(false);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [yearList, setYearList] = useState<{ name: string, value: string }[]>([]);
    const [monthList, setMonthList] = useState<{ name: string, value: string }[]>([]);
    const [dayList, setDayList] = useState<{ name: string, value: string }[]>([]);
    const [yearsWithMonthsAndDays, setYearsWithMonthsAndDays] = useState<{
        value: string,
        months: {
            value: string,
            days: {
                value: string
            }[]
        }[]
    }[]>([]);

    useEffect(() => {
        if (!getResponse.current) {
            getResponse.current = true;
            getAllDaysFromApi();
        }
    }, [getResponse]);

    const handleOnChangeYear = (event: SelectChangeEvent) => {
        setYear(event.target.value);
        const selectedYear = yearsWithMonthsAndDays.find((y: any) => y.value === event.target.value);
        if (selectedYear) {
            setMonthList(selectedYear.months.map((m: any) => ({ name: m.value, value: m.value })));
        }
    };

    const handleOnChangeMonth = (event: SelectChangeEvent) => {
        setMonth(event.target.value);
        const selectedYear = yearsWithMonthsAndDays.find((y: any) => y.value === year);
        if (selectedYear) {
            const selectedMonth = selectedYear.months.find((m: any) => m.value === event.target.value);
            if (selectedMonth) {
                setDayList(selectedMonth.days.map((m: any) => ({
                    name: m.value.substring(0, m.value.indexOf('.csv')),
                    value: m.value.substring(0, m.value.indexOf('.csv'))
                })));
            }
        }
    };

    const handleOnChangeDay = (event: SelectChangeEvent) => {
        setDay(event.target.value);
    };

    const handleOnClick = () => {
        getDataFromApi();
    };

    const getAllDaysFromApi = async () => {
        const res = await axios.get(`http://localhost:5000/daysList`);
        setYearsWithMonthsAndDays(res.data);
        setYearList(res.data.map((d: any) => ({ name: d.value, value: d.value })));
    };

    const getDataFromApi = async () => {
        const res = await axios.get(`http://localhost:5000/candles?year=${year}&month=${month}&day=${day}`);
        const formattedData = res.data.map((d: any) => ({
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
            time: Math.trunc(d.start_timestamp / 1000 + (60 * 60 * 2)) as UTCTimestamp // add 2 hours to show time in UTC+2 because the module already remove 2 hours from retreived data
        }));
        renderGraph(formattedData);
    };

    const renderGraph = (formattedData: {
        open: number;
        high: number;
        low: number;
        close: number;
        time: UTCTimestamp;
    }[]) => {
        chartContainerRef.current.innerHTML = '';
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            layout: {
                background: { type: ColorType.Solid, color: '#253248' },
                textColor: 'rgba(255, 255, 255, 0.9)',
            },
            grid: {
                vertLines: {
                    color: '#334158',
                },
                horzLines: {
                    color: '#334158',
                },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            leftPriceScale: {
                borderColor: '#485c7b',
            },
            rightPriceScale: {
                borderColor: '#485c7b',
            },
            timeScale: {
                borderColor: '#485c7b',
                timeVisible: true,
                minBarSpacing: 0.2,
            },
        });
        chart.timeScale().fitContent();
        const candleSeries = chart.addCandlestickSeries({
            priceFormat: {
                type: 'price',
                precision: 4,
                minMove: 0.0001,
            },
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });
        candleSeries.setData(formattedData);

    }

    return (
        <>
            <div style={{
                "display": "flex",
                justifyContent: "center"
            }}>
                <SelectComponent label='Year' selectedItem={year} menuItems={yearList} handleOnChange={handleOnChangeYear} />
                <SelectComponent label='Month' selectedItem={month} menuItems={monthList} handleOnChange={handleOnChangeMonth} />
                <SelectComponent label='Day' selectedItem={day} menuItems={dayList} handleOnChange={handleOnChangeDay} />
                <Button variant="contained" onClick={handleOnClick} disabled={!(year && month && day)}>Confirmer</Button>
            </div>
            <div style={{
                "display": "flex",
                "flexDirection": "column",
                "flex": "1",
                "height": "50%",
                "justifyContent": "center",
            }}>

                <div ref={chartContainerRef} className="chart-container" style={{ 'flex': '1' }} />
            </div >
        </>
    );
};

export default Analysis;
