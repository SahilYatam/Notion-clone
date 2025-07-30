class ApiError extends Error{
    constructor(statusCode, message="Somthing went wrong", errors = [], stack = ""){
        super(message);
        this.statusCode = statusCode;
        this.error = errors;
        
        this.success = false;
        this.data = null;

        if(stack){
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError }