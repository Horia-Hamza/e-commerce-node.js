export function asyncHandler(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(err => {
      console.log(err);

        next(new Error(err.message, { cause: 500 }))
        console.log(Error);
    })
}
}

export const globalError = (err, req, res, next) => {
  if (err) {
    console.log(err["cause"]);
    if (process.env.MOOD === "DEV") {
      res.status(err["cause"]).json({
        message: err.message,
        status: err["cause"],
        stack: err.stack,
      });
    } else {
      res.status(err["cause"]).json({
        message: err.message,
        status: err["cause"],
      });
    }
  }
};