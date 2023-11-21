import SubscriptionInterface from "./subscription.interface";
import PublisherInterface, { NotificationCollection } from "./publisher.interface";
import NotificationRecord from "./notification-record.interface";
import SubscriptionManagerInterface, { NotificationNames } from "./subscription-manager.interface";

/**
 * Define how any subscriber should behave
 */
interface SubscriberInterface<notifications extends NotificationCollection> extends SubscriptionManagerInterface<NotificationNames<notifications>> {
    /**
     * Add a subscription between subscriber and publisher
     * @param publisher - publisher to subscribe
     * @param notification - notification whose trigger subscription handler
     * @param handler - callback to handle when publisher publish the right notification
     * @param priority
     * @throws InvalidArgumentException - When priority is not a valid number (like NaN)
     */
    subscribe<notification extends NotificationNames<notifications>>(
        publisher: PublisherInterface<notifications>,
        notification: notification,
        handler: (payload: notifications[notification]) => void,
        priority?: number
    ): SubscriptionInterface;

    /**
     * Remove a subscription by id
     * @param subscriptionId - subscription id
     */
    unsubscribeFromSubscriptionId(subscriptionId: string): void;

    /**
     * Remove all subscription from a publisher
     * @param publisherId - publisher id
     */
    unsubscribeFromPublisherId(publisherId: string): void;

    /**
     * Remove all subscription bind to the following notification name
     * @param notification - notification name
     */
    unsubscribeFromNotification(notification: NotificationNames<notifications>): void;

    /**
     * Find all subscriptions from a publisher
     * @param publisherId - publisher id
     * @return  SubscriptionInterface[] - subscriptions found
     */
    findSubscriptionByPublisherId(publisherId: string): SubscriptionInterface[];

    /**
     * @return number - number of subscription as subscriber
     */
    getNbSubscriptions(): number;

    /**
     * Add a subscription to subscription list
     * @param notification - notification name
     * @param subscription
     */
    addSubscription(notification: NotificationNames<notifications>, subscription: SubscriptionInterface): void;

    /**
     * Remove subscription from subscriber's subscription list.
     * Note that this method won't remove subscription to publisher's subscription list.
     * That's why you shouldn't call it manually. To properly remove a subscription, prefer {@link unsubscribeFromSubscriptionId}
     * @param subscriptionId
     * @internal
     */
    removeSubscription(subscriptionId: string): void;

    /**
     * Wait until one or several notications are published. If only one notification publication is pending, it is equivalent to "subscribeOnce".
     * Subscription will be removed after first trigger.
     * @param notifications - List of notifications that must be published to trigger handler
     * @return Promise
     */
    waitUntil(notifications: Array<NotificationRecord>): Promise<Array<any>>;

    /**
     * Find all subscriptions with a publisher and a specified notification
     * @param notification
     * @param publisherId
     */
    findSubscriptionsByNotificationAndPublisherId(notification: string, publisherId: string): SubscriptionInterface[];


    /**
     * Properly clear all subscriptions. Always use it before delete your instance in order to avoid memory leaks.
     */
    destroy(): void;
}

export default SubscriberInterface;
