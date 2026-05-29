/**
 * Error handling utilities for server actions
 * Provides consistent error responses and user-friendly messages
 */

import { ZodError } from 'zod';

export interface ActionError {
  success: false;
  error: string;
  details?: any;
}

export interface ActionSuccess<T = any> {
  success: true;
  data: T;
}

export type ActionResponse<T = any> = ActionSuccess<T> | ActionError;

/**
 * Handle server action errors with user-friendly messages
 */
export function handleActionError(
  error: unknown,
  context: string = 'operation'
): ActionError {
  console.error(`Error in ${context}:`, error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return {
      success: false,
      error: 'Invalid input data. Please check your fields and try again.',
      details: error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    };
  }

  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: any };
    
    switch (prismaError.code) {
      case 'P2002':
        // Unique constraint violation
        const target = prismaError.meta?.target?.[0] || 'value';
        return {
          success: false,
          error: `This ${target} is already in use. Please choose a different one.`,
        };
      
      case 'P2025':
        // Record not found
        return {
          success: false,
          error: 'The requested item could not be found. It may have been deleted.',
        };
      
      case 'P2003':
        // Foreign key constraint violation
        return {
          success: false,
          error: 'Cannot complete operation due to related data constraints.',
        };
      
      case 'P2016':
        // Query interpretation error
        return {
          success: false,
          error: 'Invalid query. Please check your search criteria.',
        };
      
      default:
        return {
          success: false,
          error: 'A database error occurred. Please try again later.',
        };
    }
  }

  // Network/timeout errors
  if (error instanceof Error) {
    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      return {
        success: false,
        error: 'Request timed out. Please check your connection and try again.',
      };
    }
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      return {
        success: false,
        error: 'Unable to connect to the server. Please try again later.',
      };
    }
    
    // Return the error message if it's descriptive enough
    if (error.message.length > 5 && !error.message.includes('undefined')) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Generic fallback
  return {
    success: false,
    error: `Failed to complete ${context}. Please try again or contact support.`,
  };
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(data: T): ActionSuccess<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Create error response
 */
export function createErrorResponse(
  error: string,
  details?: any
): ActionError {
  return {
    success: false,
    error,
    details,
  };
}

/**
 * Validate admin authorization
 * Throws error if not admin (to be caught by handleActionError)
 */
export function assertAdmin(session: any): void {
  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized. Admin access required.');
  }
}
