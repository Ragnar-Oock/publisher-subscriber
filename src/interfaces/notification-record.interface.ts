import PublisherInterface from "./publisher.interface";

/**
 * Definition of NotificationRecord
 */
export default interface NotificationRecord<notification extends string, payload extends Record<string, any>> {
    from: PublisherInterface<{[name in notification]: payload}>;
    name: notification;
    handler?: (payload: payload) => void
}
