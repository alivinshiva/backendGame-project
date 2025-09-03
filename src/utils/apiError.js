// ApiError is a custom error class for handling API errors in a structured way.
// It extends the built-in Error class and allows you to specify status codes, messages, and error details.
// This helps in sending consistent error responses from your API endpoints.

class ApiError extends Error {
    // The constructor takes statusCode, message, errors array, and an optional stack trace.
    constructor(
        statusCode,
        message = 'Something went wrong',
        errors = [],
        stack = '',
    ){
        // Call the parent Error constructor with the message
        super(message)
        // HTTP status code for the error (e.g., 404, 500)
        this.statusCode = statusCode,
        // Data is set to null by default; can be used for extra error info
        this.data = null,
        // Error message for the client
        this.message = message,
        // Indicates the request was not successful
        this.success = false
        // Array of error details (validation errors, etc.)
        this.errors = errors

        // If a custom stack trace is provided, use it; otherwise, capture the stack
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

// Export the ApiError class for use in other modules
export {ApiError}