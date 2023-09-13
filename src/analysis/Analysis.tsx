import { Button, SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { ColorType, CrosshairMode, UTCTimestamp, createChart } from 'lightweight-charts';
import { useRef, useState } from 'react';
import SelectComponent from '../components/selectComponent';

const Analysis = () => {
    const chartContainerRef = useRef({} as HTMLDivElement);
    const [year, setYear] = useState('2001');
    const [month, setMonth] = useState('1');
    const [day, setDay] = useState('2');

    const handleOnChangeYear = (event: SelectChangeEvent) => {
        setYear(event.target.value);
    };

    const handleOnChangeMonth = (event: SelectChangeEvent) => {
        setMonth(event.target.value);
    };

    const handleOnChangeDay = (event: SelectChangeEvent) => {
        setDay(event.target.value);
    };

    const handleOnClick = () => {
        getDataFromApi();
    };

    const getAllDaysFromApi = async () => {
        const res = await axios.get(`http://localhost:5000/daysList`);
        console.log('all day res : ', res);
    };

    const getDataFromApi = async () => {
        const res = await axios.get(`http://localhost:5000/candles?year=${year}&month=${month}&day=${day}`);
        const formattedData = res.data.map((d: any) => ({
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
            time: Math.trunc(d.start_timestamp / 1000) as UTCTimestamp
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
            <SelectComponent label='Year' selectedItem={year} menuItems={[{ name: '2001', value: '2001' }]} handleOnChange={handleOnChangeYear} />
            <SelectComponent label='Month' selectedItem={year} menuItems={[{ name: '2001', value: '2001' }]} handleOnChange={handleOnChangeMonth} />
            <SelectComponent label='Day' selectedItem={year} menuItems={[{ name: '2001', value: '2001' }]} handleOnChange={handleOnChangeDay} />
            <Button variant="contained" onClick={handleOnClick}>Confirmer</Button>
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
