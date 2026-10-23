/** Error con código HTTP, para responder de forma uniforme desde cualquier capa. */
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = HttpError;
