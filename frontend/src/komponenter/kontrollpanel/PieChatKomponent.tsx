import {useEffect, useState} from "react";
import {stompService} from "../../WebSocketService.tsx";
import EChartsReact from "echarts-for-react";

type PieChart = {
    data: PieChartData[];
}

type PieChartData = {
    value: number;
    name: string;
}

type MessageProp = {
    komponentUUID: string
    komponentData: string
}

const PieChartKomponent: React.FC<MessageProp> = ({komponentUUID, komponentData}: MessageProp) => {
    const [data, setData] = useState<PieChartData[]>();

    const handleEvent = (pieChartData: PieChart): void => {
        try {
            setData(pieChartData.data);
        } catch (error) {
            console.error('Failed to parse message body:', pieChartData, error);
        }
    };

    useEffect(() => {
        let data = JSON.parse(komponentData) as PieChart
        setData(data.data)
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
                name: 'asd',
                type: 'pie',
                radius: '60%',
                data: data,
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

export const RedigerPieChartKomponent: React.FC<MessageProp> = () => {
    return (
        <div className="mb-3">
            <p>Ikke støttet</p>
        </div>
    );
};

export default PieChartKomponent

