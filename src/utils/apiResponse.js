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