import {useEffect, useState} from "react";
import {stompService} from "../../WebSocketService.tsx";
import EChartsReact from "echarts-for-react";
import {KontrollpanelKomponent} from "./KomponentKontrollpanel.tsx";

type StackedLineChart = {
    data: StackedLineChartData[];
    legend: string[];
}

type StackedLineChartData = {
    name: string;
    values: number[];
}

const LineChartKomponent: React.FC<KontrollpanelKomponent> = ({komponentUUID, data}: KontrollpanelKomponent) => {
    const [linechart, setLinechart] = useState<StackedLineChart>();

    const handleEvent = (linechart: StackedLineChart): void => {
        try {
            setLinechart(linechart);
        } catch (error) {
            console.error('Failed to parse message body:', linechart, error);
        }
    };

    useEffect(() => {
        const parsedata = JSON.parse(data) as StackedLineChart
        setLinechart(parsedata)
        const topic = `/komponent/${komponentUUID}/data`;
        const subscription = stompService.subscribe<StackedLineChart>(topic, handleEvent);

        return () => {
            if (subscription) {
                stompService.unsubscribe(topic, subscription);
            }
        };
    }, []);

    const option = {
        legend: {
            data: linechart?.data.map(it => it.name)
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: linechart?.legend ?? []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            ...(linechart?.data.map(it => ({
                name: it.name,
                type: 'line',
                data: it.values
            })) ?? [])
        ]
    };

    return (
        <>
            <EChartsReact option={option} style={{height: 400, width: '100%'}}/>
        </>
    )

}

export const RedigerLineChartKomponent: React.FC<KontrollpanelKomponent> = () => {
    return (
        <div className="mb-3">
            <p>Ikke støttet</p>
        </div>
    );
};

export default LineChartKomponent

