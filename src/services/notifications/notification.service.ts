export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    // Mock implementation for requesting permissions
    console.log('Requesting notification permissions...');
    return true;
  },

  async scheduleLocalNotification(payload: NotificationPayload): Promise<void> {
    console.log(`[Push Notification] ${payload.title}: ${payload.body}`);
    if (payload.data) {
      console.log('Data:', payload.data);
    }
  },
  
  async cancelAllNotifications(): Promise<void> {
    console.log('Canceling all local notifications...');
  }
};
