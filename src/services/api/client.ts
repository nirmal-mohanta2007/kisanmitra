export const apiClient = {
  async get<T>(url: string): Promise<T> {
    await this.delay(500);
    return {} as T;
  },

  async post<T>(url: string, data?: any): Promise<T> {
    await this.delay(500);
    return {} as T;
  },

  async put<T>(url: string, data?: any): Promise<T> {
    await this.delay(500);
    return {} as T;
  },
  
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};
