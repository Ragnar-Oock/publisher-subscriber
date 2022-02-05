import PublisherSubscriberInterface from "../interfaces/publisher-subscriber.interface";
import SubscriptionInterface from "../interfaces/subscription.interface";
import PublisherInterface from "../interfaces/publisher.interface";
import NotificationRecord from "../interfaces/notification-record.interface";
/**
 * Define instance that can publish notification and handle notification from publisher
 */
declare class PublisherSubscriber implements PublisherSubscriberInterface {
    private readonly id;
    private readonly publisher;
    private readonly subscriber;
    private readonly removedSelfSubscription;
    constructor(id: string);
    /**
     * @inheritDoc
     */
    hasSubscription(subscriptionId: string): boolean;
    /**
     * @inheritDoc
     */
    addSubscriber(notification: string, subscription: SubscriptionInterface): void;
    /**
     * @inheritDoc
     */
    removeSubscriber(subscriptionId: string): void;
    /**
     * @inheritDoc
     */
    getNbSubscriptionsAsPublisher(): number;
    /**
     * @inheritDoc
     */
    getNbSubscriptionsAsSubscriber(): number;
    /**
     * @inheritDoc
     */
    publish(notification: string, data?: any): void;
    /**
     * @inheritDoc
     */
    getId(): string;
    /**
     * @inheritDoc
     */
    subscribe(publisher: PublisherInterface, notification: string, handler: (payload: any) => void): void;
    /**
     * @inheritDoc
     */
    getNbSubscriptions(): number;
    /**
     * @inheritDoc
     */
    removeSubscription(subscriptionId: string): void;
    /**
     * @inheritDoc
     */
    addSubscription(notification: string, subscription: SubscriptionInterface): void;
    /**
     * @inheritDoc
     */
    waitUntil(notifications: Array<NotificationRecord>): Promise<Array<any>>;
    /**
     * @inheritDoc
     */
    destroy(): void;
    /**
     * @inheritDoc
     */
    is(id: string): boolean;
    /**
     * @inheritDoc
     */
    findSubscriptionById(subscriptionId: string): SubscriptionInterface | null;
    /**
     * @inheritDoc
     */
    findSubscriptionsByNotificationAndPublisherId(notification: string, publisherId: string): SubscriptionInterface[];
    /**
     * @inheritDoc
     */
    findSubscriptionsByNotification(notification: string): SubscriptionInterface[];
    /**
     * @inheritDoc
     */
    getSubscriptions(): SubscriptionInterface[];
    /**
     * @inheritDoc
     */
    unsubscribeFromNotification(notification: string): void;
    /**
     * @inheritDoc
     */
    unsubscribeFromPublisherId(publisherId: string): void;
    /**
     * @inheritDoc
     */
    unsubscribeFromSubscriptionId(subscriptionId: string): void;
    /**
     * @inheritDoc
     */
    continuePublicationOnException(): void;
    /**
     * @inheritDoc
     */
    findSubscriptionByPublisherId(publisherId: string): SubscriptionInterface[];
    /**
     * @inheritDoc
     */
    findSubscriptionsByNotificationAndSubscriberId(notification: string, subscriberId: string): SubscriptionInterface[];
    /**
     * @inheritDoc
     */
    findSubscriptionBySubscriberId(subscriberId: string): SubscriptionInterface[];
    /**
     * @inheritDoc
     */
    stopPublicationOnException(): void;
    /**
     * @inheritDoc
     */
    clearSubscription(subscriptionId: string): void;
}
export default PublisherSubscriber;
//# sourceMappingURL=publisher-subscriber.model.d.ts.map