import axios from 'axios';
import { useEffect, useRef } from 'react';

const Stats = () => {
    const loaded = useRef(false);

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
        console.log({ data })
    }

    return (
        <div style={{
            display: 'flex',
            height: '100%',
        }}>
            stats
        </div>
    )
}

export default Stats
