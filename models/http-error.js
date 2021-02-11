class HttpError extends Error {
    constructor(message, errorCode) {
        super(message) // Add a "message" property from default Error Class
        this.code = errorCode // Adds a "code" property that doesn't exist yet
    }
}

module.exports = HttpError