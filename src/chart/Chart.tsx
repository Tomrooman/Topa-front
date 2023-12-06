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
    const [render, setRender] = useState(true);
    const chartCandlesContainerRef = useRef({} as HTMLDivElement);
    const chartRsiContainerRef = useRef({} as HTMLDivElement);
    const getResponse = useRef(false);
    const year = useRef('');
    const month = useRef('');
    const day = useRef('');
    const yearList = useRef<{ name: string, value: string }[]>([]);
    const monthList = useRef<{ name: string, value: string }[]>([]);
    const dayList = useRef<{ name: string, value: string }[]>([]);
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

    const getNumberFromCsvName = (name: string) => name.indexOf('.csv') !== -1 ? name.substring(0, name.indexOf('.csv')) : name

    const handleOnChangeYear = (event: SelectChangeEvent, mustRender = true) => {
        year.current = event.target.value;
        const selectedYear = yearsWithMonthsAndDays.find((y: any) => y.value === event.target.value);
        if (selectedYear) {
            monthList.current = selectedYear.months.map((m: any) => ({ name: m.value, value: m.value }));
        }
        if (mustRender) {
            setRender(!render);
        }
    };

    const handleOnChangeMonth = (event: SelectChangeEvent, mustRender = true) => {
        month.current = event.target.value;
        const selectedYear = yearsWithMonthsAndDays.find((y: any) => y.value === year.current);
        if (selectedYear) {
            const selectedMonth = selectedYear.months.find((m: any) => m.value === event.target.value);
            if (selectedMonth) {
                dayList.current = selectedMonth.days.map((m: any) => ({
                    name: getNumberFromCsvName(m.value),
                    value: getNumberFromCsvName(m.value)
                }));
            }
        }
        if (mustRender) {
            setRender(!render);
        }
    };

    const handleOnChangeDay = (event: SelectChangeEvent, mustRender = true) => {
        day.current = event.target.value;
        if (mustRender) {
            setRender(!render);
        }
    };

    const handlePrevDay = async () => {
        const dayIndex = dayList.current.findIndex((d: any) => d.value === day.current);
        if (dayIndex > 0) {
            const prevDay = dayList.current[dayIndex - 1];
            handleOnChangeDay({ target: { value: prevDay.value } } as any, false);
        }
        if (dayIndex === 0) {
            const prevMonth = monthList.current.findIndex((m: any) => Number(m.value) === Number(month.current) - 1);
            if (prevMonth !== -1) {
                handleOnChangeMonth({ target: { value: monthList.current[prevMonth].value } } as any, false);
                handleOnChangeDay({ target: { value: dayList.current[dayList.current.length - 1].value } } as any, false);
            } else {
                const prevYear = yearList.current.findIndex((y: any) => Number(y.value) === Number(year.current) - 1);
                if (prevYear !== -1) {
                    handleOnChangeYear({ target: { value: yearList.current[prevYear].value } } as any, false);
                    handleOnChangeMonth({ target: { value: monthList.current[monthList.current.length - 1].value } } as any, false);
                    handleOnChangeDay({ target: { value: dayList.current[dayList.current.length - 1].value } } as any, false);
                }
            }
        }
        getDataFromApi();
        setRender(!render);
    }

    const handleNextDay = () => {
        const dayIndex = dayList.current.findIndex((d: any) => d.value === day.current);
        if (dayIndex < dayList.current.length - 1) {
            const nextDay = dayList.current[dayIndex + 1];
            handleOnChangeDay({ target: { value: nextDay.value } } as any, false);
        }
        if (dayIndex === dayList.current.length - 1) {
            const nextMonth = monthList.current.findIndex((m: any) => Number(m.value) === Number(month.current) + 1);
            if (nextMonth !== -1) {
                handleOnChangeMonth({ target: { value: monthList.current[nextMonth].value } } as any, false);
                handleOnChangeDay({ target: { value: dayList.current[0].value } } as any, false);
            } else {
                const nextYear = yearList.current.findIndex((y: any) => Number(y.value) === Number(year.current) + 1);
                if (nextYear !== -1) {
                    handleOnChangeYear({ target: { value: yearList.current[nextYear].value } } as any, false);
                    handleOnChangeMonth({ target: { value: monthList.current[0].value } } as any, false);
                    handleOnChangeDay({ target: { value: dayList.current[0].value } } as any, false);
                }
            }
        }
        getDataFromApi();
        setRender(!render);
    }



    const handleOnClick = () => {
        getDataFromApi();
    };

    const getAllDaysFromApi = async () => {
        const res = await axios.get(`http://localhost:5000/days_list`);
        setYearsWithMonthsAndDays(res.data);
        yearList.current = res.data.map((d: any) => ({ name: getNumberFromCsvName(d.value), value: getNumberFromCsvName(d.value) }));
    };

    const getDataFromApi = async () => {
        const { data } = await axios.get(`http://localhost:5000/candles?year=${year.current}&month=${month.current}&day=${day.current}`);
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
                <SelectComponent label='Year' selectedItem={year.current} menuItems={yearList.current} handleOnChange={handleOnChangeYear} />
                <SelectComponent label='Month' selectedItem={month.current} menuItems={monthList.current} handleOnChange={handleOnChangeMonth} />
                <SelectComponent label='Day' selectedItem={day.current} menuItems={dayList.current} handleOnChange={handleOnChangeDay} />
                <Button variant="contained" onClick={handleOnClick} disabled={!(year.current && month.current && day.current)}>Confirmer</Button>
                <Button onClick={handlePrevDay}>Prev</Button>
                <Button onClick={handleNextDay}>Next</Button>
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
