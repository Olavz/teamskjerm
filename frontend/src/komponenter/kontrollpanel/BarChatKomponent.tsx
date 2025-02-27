import {useEffect, useState} from "react";
import {stompService} from "../../WebSocketService.tsx";
import EChartsReact from "echarts-for-react";
import {KontrollpanelKomponent} from "./KomponentKontrollpanel.tsx";

type BarChart = {
    data: BarChartData[];
}

type BarChartData = {
    value: number;
    name: string;
}

const BarChartKomponent: React.FC<KontrollpanelKomponent> = ({komponentUUID, data}: KontrollpanelKomponent) => {
    const [chartdata, setChartdata] = useState<BarChartData[]>();

    const handleEvent = (barChartData: BarChart): void => {
        try {
            setChartdata(barChartData.data);
        } catch (error) {
            console.error('Failed to parse message body:', barChartData, error);
        }
    };

    useEffect(() => {
        const parsedata = JSON.parse(data) as BarChart
        setChartdata(parsedata.data)
        const topic = `/komponent/${komponentUUID}`;
        const subscription = stompService.subscribe<BarChart>(topic, handleEvent);

        return () => {
            if (subscription) {
                stompService.unsubscribe(topic, subscription);
            }
        };
    }, []);

    const option = {
        xAxis: {
            type: 'category',
            data: chartdata?.map(item => item.name)
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'BarChartKomponent',
                type: 'bar',
                data: chartdata?.map(item => item.value),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    return (
        <>
            <EChartsReact option={option} style={{height: 400, width: '100%'}}/>
        </>
    )

}

export const RedigerBarChartKomponent: React.FC<KontrollpanelKomponent> = () => {
    return (
        <div className="mb-3">
            <p>Ikke støttet</p>
        </div>
    );
};

export default BarChartKomponent

