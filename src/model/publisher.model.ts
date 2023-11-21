import SubscriptionInterface from "../interfaces/subscription.interface";
import PublisherInterface, { NotificationCollection } from "../interfaces/publisher.interface";
import SubscriptionManager from "./subscription-manager.model";
import {findSubscriptionByRoleAndComponentId, ROLE} from "../helper/subscription-manager.helper";
import { NotificationNames } from '../interfaces/subscription-manager.interface';

/**
 * Define instance that can publish notification
 */
class Publisher<N extends NotificationCollection> extends SubscriptionManager<Exclude<keyof N, number | symbol>> implements PublisherInterface<N> {
    private shouldIStopPublicationOnException: boolean = false;

    /**
     * @inheritDoc
     */
    public stopPublicationOnException(): void {
        this.shouldIStopPublicationOnException = true;
    }

    /**
     * @inheritDoc
     */
    public continuePublicationOnException(): void {
        this.shouldIStopPublicationOnException = false;
    }

    /**
     * @inheritDoc
     */
    public publish<notificationName extends NotificationNames<N>>(notification: notificationName, data: N[notificationName]): void {
        const subscriptions = this.notificationsCollection[notification];

        if (Array.isArray(subscriptions)) {
            // shallow copy in order to avoid iteration on modifiable collection
            subscriptions.slice(0).forEach(
                (subscription: SubscriptionInterface) => {
                    try {
                        subscription.handler(data);
                    } catch (error) {
                        if (this.shouldIStopPublicationOnException) {
                            throw error;
                        }
                    }
                }
            );
        }
    }

    /**
     * @inheritDoc
     */
    public findSubscriptionBySubscriberId(subscriberId: string): SubscriptionInterface[] {
        return findSubscriptionByRoleAndComponentId(
            this,
            ROLE.SUBSCRIBER_ID,
            subscriberId
        );
    }

    /**
     * @inheritDoc
     */
    public findSubscriptionsByNotificationAndSubscriberId(notification: NotificationNames<N>, subscriberId: string): SubscriptionInterface[] {
        return this.findSubscriptionsByNotification(notification).filter(subscription => {
            return subscription.subscriber_id === subscriberId;
        })
    }

    /**
     * @inheritDoc
     */
    public addSubscriber(notification: NotificationNames<N>, subscription: SubscriptionInterface): void {
        this.addSubscription(notification, subscription);
    }

    /**
     * @inheritDoc
     */
    public removeSubscriber(subscriberId: string): void {
        const subscriptions = this.findSubscriptionBySubscriberId(subscriberId);
        subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}

export default Publisher;
