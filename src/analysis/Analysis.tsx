import axios from 'axios';
import { ColorType, CrosshairMode, IChartApi, UTCTimestamp, createChart } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

const Analysis = () => {
    const chartContainerRef = useRef({} as HTMLDivElement);
    const chart = useRef({} as IChartApi);
    const rendered = useRef(false);
    const [data, setData] = useState([]);
    const [year, setYear] = useState(2021);
    const [month, setMonth] = useState(1);
    const [day, setDay] = useState(1);

    useEffect(() => {
        if (!rendered.current) {
            rendered.current = true;
            getDataFromApi();
        }
    }, [rendered]);

    useEffect(() => {
        if (data.length) {
            console.log('data : ', data)
            renderGraph();
            getAllDaysFromApi();
        }
    }, [data]);

    const getAllDaysFromApi = async () => {
        const res = await axios.get(`http://localhost:5000/daysList`);
        console.log('all day res : ', res);
    };

    const getDataFromApi = async () => {
        const res = await axios.get(`http://localhost:5000?year=${year}&month=${month}&day=${day}`);
        setData(res.data.map((d: any) => ({
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
            time: Math.trunc(d.start_timestamp / 1000) as UTCTimestamp
        })));
    };

    const renderGraph = () => {
        chart.current = createChart(chartContainerRef.current, {
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
        chart.current.timeScale().fitContent();
        const candleSeries = chart.current.addCandlestickSeries({
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
        candleSeries.setData(data);
    }

    return (
        <div style={{
            "display": "flex",
            "flexDirection": "column",
            "flex": "1",
            "height": "50%",
            "justifyContent": "center",
        }}>

            <div ref={chartContainerRef} className="chart-container" style={{ 'flex': '1' }} />
        </div >
    );
};

export default Analysis;
