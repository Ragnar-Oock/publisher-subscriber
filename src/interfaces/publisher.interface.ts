import SubscriptionInterface from "./subscription.interface";
import SubscriptionManagerInterface, { NotificationNames } from "./subscription-manager.interface";


export type NotificationCollection = {
    [name in string]:  Record<string, any> | never
}

/**
 * Behavior expected by an instance who's publish some notification to subscribers
 */
interface PublisherInterface<notifications extends NotificationCollection> extends SubscriptionManagerInterface<NotificationNames<notifications>> {
    /**
     * Publish a notification to subscribers
     * @param notification - notification name
     * @param data - additional data to send on publish
     */
    publish<event extends NotificationNames<notifications>>(notification: event, data: notifications[event]): void;


    /**
     * Add a subscription whose handler will be triggered when publisher will publish expected notification
     * @param notification - notification name whose trigger handler
     * @param subscription - subscription including the handler to trigger
     */
    addSubscriber(notification: NotificationNames<notifications>, subscription: SubscriptionInterface): void;

    /**
     * Remove all subscriptions between publisher and the subscriber with id `subscription_id`
     * @param subscriberId - id of a potential subscriber
     */
    removeSubscriber(subscriberId: string): void;

    /**
     * Find all subscriptions between publisher and the subscriber with id `subscription_id`
     * @param subscriberId  - id of a potential subscriber
     * @return SubscriptionInterface[] - all subscriptions found
     */
    findSubscriptionBySubscriberId(subscriberId: string): SubscriptionInterface[];


    /**
     * Find all subscriptions between publisher and the subscriber with id `subscription_id` for a specified notification
     * @param notification  - notification name
     * @param subscriberId  - id of a potential subscriber
     * @return SubscriptionInterface[] - all subscriptions found
     */
    findSubscriptionsByNotificationAndSubscriberId(notification: NotificationNames<notifications>, subscriberId: string): SubscriptionInterface[];

    /**
     * Update the behavior of publisher in order to stop publication workflow if one exception is thrown by a subscriber
     */
    stopPublicationOnException(): void;

    /**
     * Update the behavior of publisher in order to continue publication workflow if one exception is thrown by a subscriber. Note it is the default behavior.
     */
    continuePublicationOnException(): void;

    /**
     * Properly clear all subscriptions. Always use it before delete your instance in order to avoid memory leaks.
     */
    destroy(): void;
}

export default PublisherInterface;
