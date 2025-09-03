/*
==================== NOTES ====================
File: apiResponse.js

Why use this file:
- Standardizes API responses for success cases.
- Makes it easier for frontend and other clients to parse and handle responses.
- Centralizes response formatting logic for maintainability.

How it works:
- Defines an ApiResponse class with statusCode, message, and data properties.
- Sets a 'success' flag based on the status code.
- Exported for use in controllers and routes.

What if we don't use this file:
- Response formats would be inconsistent across endpoints.
- Harder for clients to reliably handle API responses.
- More repetitive code in controllers for formatting responses.
==============================================
*/
// ApiResponse is a utility class for formatting successful API responses.
// It standardizes the structure of responses sent from your endpoints, making it easier for clients to parse.
// The 'success' property is true for status codes below 400, indicating a successful operation.

class ApiResponse {
    // The constructor takes statusCode, message, and data for the response
    constructor(statusCode, message = 'Success', data){
        // HTTP status code for the response (e.g., 200, 201)
        this.statusCode = statusCode,
        // Message describing the result (default: 'Success')
        this.message = message,
        // Data returned to the client (could be an object, array, etc.)
        this.data = data,
        // Indicates if the response is successful (statusCode < 400)
        this.sucess = statusCode < 400
    }
}

export {ApiResponse}