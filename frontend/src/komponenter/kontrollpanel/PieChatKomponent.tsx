import {useEffect, useState} from "react";
import {stompService} from "../../WebSocketService.tsx";
import EChartsReact from "echarts-for-react";
import {KontrollpanelKomponent} from "./KomponentKontrollpanel.tsx";

type PieChart = {
    data: PieChartData[];
}

type PieChartData = {
    value: number;
    name: string;
}

const PieChartKomponent: React.FC<KontrollpanelKomponent> = ({komponentUUID, data}: KontrollpanelKomponent) => {
    const [chartdata, setChartdata] = useState<PieChartData[]>();

    const handleEvent = (pieChartData: PieChart): void => {
        try {
            setChartdata(pieChartData.data);
        } catch (error) {
            console.error('Failed to parse message body:', pieChartData, error);
        }
    };

    useEffect(() => {
        let parsedata = JSON.parse(data) as PieChart
        setChartdata(parsedata.data)
        const topic = `/komponent/${komponentUUID}`;
        const subscription = stompService.subscribe<PieChart>(topic, handleEvent);

        return () => {
            if (subscription) {
                stompService.unsubscribe(topic, subscription);
            }
        };
    }, []);

    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: 'PieChartKomponent',
                type: 'pie',
                radius: '60%',
                data: chartdata,
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

export const RedigerPieChartKomponent: React.FC<KontrollpanelKomponent> = () => {
    return (
        <div className="mb-3">
            <p>Ikke støttet</p>
        </div>
    );
};

export default PieChartKomponent

