export class ServiceResponse<T> {
    data?: T;
    success: boolean = true;
    message?: string = '';
  
    constructor(success: boolean = true, message: string = '', data?: T) {
      this.success = success;
      this.message = message;
      this.data = data;
    }
  
    response(success: boolean, message: string, data?: T): ServiceResponse<T> {
      this.data = data;
      this.success = success;
      this.message = message;
  
      return this;
    }
  }