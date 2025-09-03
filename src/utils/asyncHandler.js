// asyncHandler is a higher-order function for handling async route handlers in Express.
// It wraps your request handler and automatically catches errors, passing them to Express error middleware.
// This avoids repetitive try-catch blocks in your controllers and keeps code clean.

// handler using promise
const asyncHandler = (requestHandler) => {
    // Returns a function that handles req, res, next
    (req, res, next) => {
        // Executes the requestHandler and catches any errors
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err)) // Passes errors to Express error middleware
    }
}

// Export the asyncHandler for use in routes/controllers
export {asyncHandler}


// const asyncHandler = () => {}
// const asyncHandler = (fnc) => {() => {}}
// const asyncHandler = (fnc) => () => {}
// const asyncHandler = (fnc) => async () => {}


    // handler using try catch
    // const asyncHandler = (fn) => async (req, res, next) => {
    //     try {
    //         await fn(req, res, next)
            
    //     } catch (error) {
    //         res.status(err.code || 500).json({
    //             success: false,
    //             message: err.message
    //         })
    //         console.log(`error connecting db: ${error}`);
            
    //         throw error
    //     }
    // }