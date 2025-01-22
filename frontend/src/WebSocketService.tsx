import { Client, StompSubscription, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

type EventListeners = {
    [event: string]: Array<(payload: any) => void>;
};

class STOMPService {
    client: Client | null = null;
    private isConnected = false;
    private activeSubscriptions: Array<() => void> = [];
    private pendingSubscriptions: Array<() => void> = [];
    private eventListeners: EventListeners = {};

    connect(url: string): void {
        this.client = new Client({
            brokerURL: url,
            webSocketFactory: () => new SockJS(url),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            // debug: (str) => console.log('STOMP Debug:', str),
        });

        this.client.onConnect = () => {
            console.log('STOMP connected');
            this.isConnected = true;

            console.log("active", this.activeSubscriptions.length)
            console.log("pending", this.pendingSubscriptions.length)

            // Utfør alle abonnementer i køen
            this.activeSubscriptions.forEach((subscribe) => subscribe());
            this.pendingSubscriptions.forEach((subscribe) => {
                this.activeSubscriptions.push(subscribe)
                subscribe()
            });
            this.pendingSubscriptions = []; // Tøm køen
        };

        this.client.onDisconnect = () => {
            console.log('STOMP disconnected');
            this.isConnected = false;
        };

        this.client.activate();
    }

    subscribe<T>(
        topic: string,
        callback: (payload: T) => void
    ): StompSubscription | null {
        if (!this.client) {
            console.error('STOMP client is not initialized');
            return null;
        }

        const subscribeAction = () => {
            const subscription = this.client!.subscribe(topic, (message: IMessage) => {
                const payload = JSON.parse(message.body);
                callback(payload);
            });
            return subscription;
        };

        if (this.isConnected) {
            this.activeSubscriptions.push(subscribeAction)
            return subscribeAction();
        } else {
            console.log('STOMP client not connected, queuing subscription');
            this.pendingSubscriptions.push(subscribeAction);
            return null;
        }
    }

    unsubscribe(topic: string, subscription: StompSubscription): void {
        if (!this.client || !this.client.connected) return;

        subscription.unsubscribe();

        if (this.eventListeners[topic]) {
            delete this.eventListeners[topic];
        }
    }

}

export const stompService = new STOMPService();

