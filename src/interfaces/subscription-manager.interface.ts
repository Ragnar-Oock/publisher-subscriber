import IdentifiableInterface from "./identifiable.interface";
import SubscriptionInterface from "./subscription.interface";
import { NotificationCollection } from './publisher.interface';

export type NotificationNames<notifications extends NotificationCollection> = Exclude<keyof notifications, number | symbol>;

export default interface SubscriptionManagerInterface<notifications extends keyof NotificationCollection> extends IdentifiableInterface {
    /**
     * Check if an instance has a subscription
     * @param subscriptionId - subscription id
     * @return boolean - true if instance has a subscription with this id
     */
    hasSubscription(subscriptionId: string): boolean;

    /**
     * Get all subscriptions
     */
    getSubscriptions(): SubscriptionInterface[];

    /**
     * Get the number of subscriptions
     */
    getNbSubscriptions(): number;

    /**
     * Find all subscription bound to the following notification
     * @param notification
     */
    findSubscriptionsByNotification(notification: notifications): SubscriptionInterface[];

    /**
     * Find a subscription by id
     * @param subscriptionId
     * @return {SubscriptionInterface | null } - the subscription or null if no subscription was found
     */
    findSubscriptionById(subscriptionId: notifications): SubscriptionInterface | null;

    /**
     * Remove subscription from subscription list.
     * Cause subscription might involve memory leak you shouldn't invoke this method manually.
     * Let sub-class implements properly its own logic and prevent memory leak at this time.
     * @param subscriptionId
     * @throws SubscriptionNotFoundException - when subscription was not found
     * @internal
     */
    clearSubscription(subscriptionId: notifications): void;
}
