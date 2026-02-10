import {useEffect, useState} from "react";
import {stompService} from "../../WebSocketService.tsx";
import EChartsReact from "echarts-for-react";
import {KontrollpanelKomponent} from "./KomponentKontrollpanel.tsx";

type StackedAreaChart = {
    data: StackedAreaChartData[];
    legend: string[];
}

type StackedAreaChartData = {
    name: string;
    values: number[];
}

const StackedAreaChartKomponent: React.FC<KontrollpanelKomponent> = ({komponentUUID, data}: KontrollpanelKomponent) => {
    const [areachart, setAreachart] = useState<StackedAreaChart>();

    const handleEvent = (areachart: StackedAreaChart): void => {
        try {
            setAreachart(areachart);
        } catch (error) {
            console.error('Failed to parse message body:', areachart, error);
        }
    };

    useEffect(() => {
        const parsedata = JSON.parse(data) as StackedAreaChart
        setAreachart(parsedata)
        const topic = `/komponent/${komponentUUID}/data`;
        const subscription = stompService.subscribe<StackedAreaChart>(topic, handleEvent);

        return () => {
            if (subscription) {
                stompService.unsubscribe(topic, subscription);
            }
        };
    }, []);

    const option = {
        legend: {
            data: areachart?.data.map(it => it.name)
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: areachart?.legend ?? []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            ...(areachart?.data.map(it => ({
                name: it.name,
                type: 'line',
                stack: 'Total',
                data: it.values,
                areaStyle: {}
            })) ?? [])
        ]
    };

    return (
        <>
            <EChartsReact option={option} style={{height: 400, width: '100%'}}/>
        </>
    )

}

export const RedigerStackedAreaChartKomponent: React.FC<KontrollpanelKomponent> = () => {
    return (
        <div className="mb-3">
            <p>Ikke støttet</p>
        </div>
    );
};

export default StackedAreaChartKomponent

