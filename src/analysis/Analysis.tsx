import axios from 'axios';
import { ColorType, CrosshairMode, IChartApi, UTCTimestamp, createChart } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

const Analysis = () => {
    const chartContainerRef = useRef({} as HTMLDivElement);
    const chart = useRef({} as IChartApi);
    const rendered = useRef(false);
    const [data, setData] = useState([]);

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
        }
    }, [data]);

    const getDataFromApi = async () => {
        const res = await axios.get('http://localhost:5000/');
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
