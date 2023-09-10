import axios from 'axios';
import { ColorType, CrosshairMode, IChartApi, createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

const priceData = [
    {
        time: '2018-10-19',
        open: 180.34,
        high: 180.99,
        low: 178.57,
        close: 179.85
    },
    {
        time: '2018-10-22',
        open: 180.82,
        high: 181.4,
        low: 177.56,
        close: 178.75
    },
];

const Analysis = () => {
    const chartContainerRef = useRef({} as HTMLDivElement);
    const chart = useRef({} as IChartApi);
    const rendered = useRef(false);

    useEffect(() => {
        if (!rendered.current) {
            rendered.current = true;
            getDataFromApi();
        }
    }, [rendered]);

    const getDataFromApi = async () => {
        const res = await axios.get('http://localhost:5000/');
        console.log(res);
        renderGraph();
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
            },
        });

        const candleSeries = chart.current.addCandlestickSeries({
            upColor: '#4bffb5',
            downColor: '#ff4976',
            borderDownColor: '#ff4976',
            borderUpColor: '#4bffb5',
            wickDownColor: '#838ca1',
            wickUpColor: '#838ca1',
        });

        candleSeries.setData(priceData);
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
