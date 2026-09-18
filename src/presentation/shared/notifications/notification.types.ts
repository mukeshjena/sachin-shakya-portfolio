// presentation/shared/notifications/notification.types.ts
// Domain contracts for presentation-layer toast telemetry.

export interface INotificationService {
  success(message: string): void;
  error(message: string): void;
  info(message: string): void;
}
