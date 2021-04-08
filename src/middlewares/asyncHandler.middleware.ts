export const asyncHandler = (fn: Function) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
