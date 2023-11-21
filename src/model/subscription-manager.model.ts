import SubscriptionManagerInterface from "../interfaces/subscription-manager.interface";
import SubscriptionInterface from "../interfaces/subscription.interface";
import {SubscriptionAlreadyExistsException, SubscriptionNotFoundException} from "../exception/index";
import { NotificationCollection } from '../interfaces/publisher.interface';


/**
 * Define instance that can manage subscription collection
 */
export default class SubscriptionManager<N extends keyof NotificationCollection> implements SubscriptionManagerInterface<N> {
    private subscriptionsList: Record<string, N> = {};
    protected notificationsCollection: Partial<Record<N, Array<SubscriptionInterface>>> = {};
    protected nbSubscriptionRecorded: number = 0;
    private readonly id: string;

    constructor(id: string) {
        this.id = id;
    }

    /**
     * @inheritDoc
     */
    public getSubscriptions(): SubscriptionInterface[] {
        return ([] as SubscriptionInterface[]).concat.apply([], Object.values(this.notificationsCollection))
    }

    /**
     * @inheritDoc
     */
    public getNbSubscriptions(): number {
        return this.nbSubscriptionRecorded;
    }

    /**
     * @inheritDoc
     */
    public hasSubscription(subscriptionId: string): boolean {
        return typeof this.subscriptionsList[subscriptionId] !== 'undefined';
    }

    /**
     * Bind a subscription to a notification
     * @param subscriptionId - subscription id
     * @param notification - notification name
     */
    private recordSubscription(subscriptionId: string, notification: N): void {
        this.subscriptionsList[subscriptionId] = notification;
    }


    private findSubscriptionIndexById(subscriptionId: string): { index: number, notification: N } {
        const notificationName = this.subscriptionsList[subscriptionId];
        const subscriptionIndex = {
            index: -1,
            notification: notificationName ?? ''
        };


        if (typeof notificationName === 'undefined') {
            return subscriptionIndex;
        }

        const notifications = this.notificationsCollection[notificationName];

        if (Array.isArray(notifications)) {
            subscriptionIndex.index = notifications.findIndex(
                (recordedSubscription: SubscriptionInterface) => {
                    return recordedSubscription.id === subscriptionId;
                }
            );
        }

        return subscriptionIndex;
    }

    /**
     * @inheritDoc
     */
    public findSubscriptionById(subscriptionId: string): SubscriptionInterface | null {
        const subscriptionIndex = this.findSubscriptionIndexById(subscriptionId);

        return this.notificationsCollection[subscriptionIndex.notification]?.[subscriptionIndex.index] ?? null;
    }

    /**
     * @inheritDoc
     */
    public findSubscriptionsByNotification(notification: N): Array<SubscriptionInterface> {
        return this.notificationsCollection[notification] ?? [];
    }

    /**
     * Remove subscription from subscription list.
     * Cause subscription might involve memory leak you shouldn't invoke this method manually.
     * Let subclass implements properly its own logic and prevent memory leak at this time.
     * @param subscriptionId
     * @throws SubscriptionNotFoundException - when subscription was not found
     * @internal
     */
    public clearSubscription(subscriptionId: string): void {
        const subscriptionIndex = this.findSubscriptionIndexById(subscriptionId);

        const notifications = this.notificationsCollection[subscriptionIndex.notification];
        if (typeof notifications === 'undefined') {
            throw new SubscriptionNotFoundException(subscriptionId, this.getId());
        } else {
            const removedSubscription: SubscriptionInterface = notifications.splice(
                subscriptionIndex.index,
                1
            )[0];

            // handler may contain some references to existing objects.
            // by deleting reference to this function, all reference into function will be destroyed
            // it could prevent some memory leaks
            if (typeof removedSubscription.handler === 'function') {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                delete removedSubscription.handler;
            }

            delete this.subscriptionsList[subscriptionId];
            this.nbSubscriptionRecorded--;

            if (notifications.length === 0) {
                delete this.notificationsCollection[subscriptionIndex.notification];
            }
        }
    }

    /**
     * Add properly a subscription to subscription collection
     * @param notification
     * @param subscription
     * @throws SubscriptionAlreadyExistsException - when a subscription with same id was already added
     */
    protected addSubscription(notification: N, subscription: SubscriptionInterface): void {
        const notifications = this.notificationsCollection[notification] ?? [];

        if (!this.hasSubscription(subscription.id)) {
            notifications.push(subscription);
            notifications.sort((a, b) => {
                return b.priority - a.priority;
            })

            this.recordSubscription(subscription.id, notification);
            this.nbSubscriptionRecorded++;
            this.notificationsCollection[notification] = notifications;
        } else {
            throw new SubscriptionAlreadyExistsException(subscription.id, this.getId());
        }
    }

    /**
     * @inheritDoc
     */
    public getId(): string {
        return this.id;
    }

    /**
     * @inheritDoc
     */
    public is(id: string): boolean {
        return id === this.getId();
    }

    /**
     * Clear all subscriptions properly
     */
    public destroy(): void {
        (Object.values(this.notificationsCollection) as SubscriptionInterface[][])
            .forEach(subscriptionsType =>
                [ ...subscriptionsType].forEach(subscription => subscription.unsubscribe())
            );
    }
}
