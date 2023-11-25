import { Button, SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { ColorType, CrosshairMode, SeriesMarkerPosition, SeriesMarkerShape, UTCTimestamp, createChart } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import SelectComponent from '../components/selectComponent';

type TradeModel = {
    is_available: boolean
    price: number
    take_profit: number
    stop_loss: number
    type: 'buy' | 'sell'
    close: number
    profit: number
    opened_at: string
    closed_at: string
}

type Marker = {
    time: UTCTimestamp
    position: SeriesMarkerPosition,
    color: string,
    shape: SeriesMarkerShape,
    text: string,
    size: number
}

const Chart = () => {
    const chartCandlesContainerRef = useRef({} as HTMLDivElement);
    const chartRsiContainerRef = useRef({} as HTMLDivElement);
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
        const res = await axios.get(`http://localhost:5000/days_list`);
        setYearsWithMonthsAndDays(res.data);
        setYearList(res.data.map((d: any) => ({ name: d.value, value: d.value })));
    };

    const getDataFromApi = async () => {
        const { data } = await axios.get(`http://localhost:5000/candles?year=${year}&month=${month}&day=${day}`);
        const formattedCandlesData = data.candles.map((d: any) => ({
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
            time: Math.round(d.start_timestamp / 1000)
        }));
        const formattedRsiData = {
            "5min": data.rsi.five_min.map((d: any) => ({
                value: d.rsi,
                time: Math.round(d.start_timestamp / 1000)
            })),
            "30min": data.rsi.thirty_min.map((d: any) => ({
                value: d.rsi,
                time: Math.round(d.start_timestamp / 1000)
            })),
            "1h": data.rsi.one_hour.map((d: any) => ({
                value: d.rsi,
                time: Math.round(d.start_timestamp / 1000)
            })),
            "4h": data.rsi.four_hours.map((d: any) => ({
                value: d.rsi,
                time: Math.round(d.start_timestamp / 1000)
            }))
        };
        const tradeMarkers = getTradeMarkers(data.trades);
        renderGraph(formattedCandlesData, tradeMarkers);
        renderRsiLines(formattedRsiData, tradeMarkers);
    };

    const getTradeMarkers = (trades: TradeModel[]): Marker[] => {
        const markers = [];
        for (const trade of trades) {
            const closedAt = new Date(trade.closed_at);
            const openedAt = new Date(trade.opened_at);
            markers.push(...[
                {
                    time: Math.round(openedAt.getTime() / 1000) as UTCTimestamp,
                    position: 'aboveBar' as SeriesMarkerPosition,
                    color: trade.profit > 0 ? "green" : "red",
                    shape: 'arrowDown' as SeriesMarkerShape,
                    text: trade.type.toUpperCase(),
                    size: 2
                }, {
                    time: Math.round(closedAt.getTime() / 1000) as UTCTimestamp,
                    position: 'aboveBar' as SeriesMarkerPosition,
                    color: trade.profit > 0 ? "green" : "red",
                    shape: 'arrowDown' as SeriesMarkerShape,
                    text: 'CLOSED',
                    size: 2
                }
            ]);
        };
        return markers;
    }

    const renderGraph = (formattedData: {
        open: number;
        high: number;
        low: number;
        close: number;
        time: UTCTimestamp;
    }[], tradeMarkers: Marker[]) => {
        chartCandlesContainerRef.current.innerHTML = '';
        const chart = createChart(chartCandlesContainerRef.current, {
            width: chartCandlesContainerRef.current.clientWidth,
            height: chartCandlesContainerRef.current.clientHeight,
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
        candleSeries.setMarkers(tradeMarkers);
    }

    const renderRsiLines = (rsiData: {
        "5min": { value: number, time: UTCTimestamp }[],
        "30min": { value: number, time: UTCTimestamp }[],
        "1h": { value: number, time: UTCTimestamp }[],
        "4h": { value: number, time: UTCTimestamp }[]
    }, tradeMarkers: Marker[]) => {
        chartRsiContainerRef.current.innerHTML = '';
        const chart = createChart(chartRsiContainerRef.current, {
            width: chartCandlesContainerRef.current.clientWidth,
            height: chartCandlesContainerRef.current.clientHeight / 2,
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
        const lineSeriesFiveMin = chart.addLineSeries({ color: 'blue' });
        lineSeriesFiveMin.setData(rsiData["5min"]);
        const lineSeriesThirtyMin = chart.addLineSeries({ color: 'red' });
        lineSeriesThirtyMin.setData(rsiData["30min"])
        const lineSeriesOneHour = chart.addLineSeries({ color: 'green' });
        lineSeriesOneHour.setData(rsiData["1h"]);
        const lineSeriesFourHours = chart.addLineSeries({ color: 'purple' });
        lineSeriesFourHours.setData(rsiData["4h"]);
        lineSeriesFiveMin.setMarkers(tradeMarkers);
        chart.timeScale().fitContent();
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

                <div ref={chartCandlesContainerRef} className="chart-container" style={{ 'flex': '1' }} />
            </div >
            <div style={{
                "display": "flex",
                "flexDirection": "column",
                "flex": "1",
                "height": "50%",
                "justifyContent": "center",
            }}>

                <div ref={chartRsiContainerRef} className="chart-container" style={{ 'flex': '1' }} />
            </div >
        </>
    );
};

export default Chart;
