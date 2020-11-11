function HeadersManagerMiddleware (req, res, next) {
  const authToken = req.cookies.token;
  if (authToken) {
    Object.assign(req.headers, {'access-token': authToken});
  };
  return next();
}

module.exports = HeadersManagerMiddleware;
