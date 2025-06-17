
import { logger } from './logger';

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export class ErrorHandler {
  static handle(error: any, context?: string): AppError {
    const errorMessage = error?.message || 'An unexpected error occurred';
    const errorCode = error?.code || 'UNKNOWN_ERROR';
    
    logger.error(`Error in ${context || 'Unknown context'}`, error);
    
    return {
      message: errorMessage,
      code: errorCode,
      details: error,
    };
  }

  static getDisplayMessage(error: AppError): string {
    // Map technical errors to user-friendly messages
    const errorMap: Record<string, string> = {
      'invalid_credentials': 'Invalid email or password',
      'email_not_confirmed': 'Please check your email and confirm your account',
      'user_not_found': 'User not found',
      'weak_password': 'Password must be at least 6 characters',
      'email_already_in_use': 'This email is already registered',
    };

    return errorMap[error.code || ''] || error.message;
  }
}
