import PublisherInterface, { NotificationCollection } from "./publisher.interface";
import { NotificationNames } from './subscription-manager.interface';

/**
 * Interface describing a publisher that can repeat notification published by another publisher
 */
export default interface PublisherProxyInterface<notifications extends NotificationCollection> extends PublisherInterface<notifications> {
    addProxy<notification extends NotificationNames<notifications>>(publisher: PublisherInterface<notifications>, notification: notification, hook: (payload: notifications[notification]) => any): this;
    removeProxy<notifications extends NotificationCollection>(publisher: PublisherInterface<notifications>, notification: NotificationNames<notifications>): this;
}
