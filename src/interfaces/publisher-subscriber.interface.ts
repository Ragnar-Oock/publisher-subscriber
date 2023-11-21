import PublisherInterface, { NotificationCollection } from "./publisher.interface";
import SubscriberInterface from "./subscriber.interface";

/**
 * Combine Publisher and Subscriber behavior and add some method to properly use your instance
 */
interface PublisherSubscriberInterface<notifications extends NotificationCollection> extends PublisherInterface<notifications>, SubscriberInterface<notifications> {
    /**
     * @return number - number of subscription as subscriber
     */
    getNbSubscriptionsAsSubscriber(): number;
    /**
     * @return number - number of subscription as publisher
     */
    getNbSubscriptionsAsPublisher(): number;
}

export default PublisherSubscriberInterface;
