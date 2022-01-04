export function promisify(func) {
  return new Promise((resolve, reject) => {
    func((err, result) => {
      if (err) return reject(err);

      resolve(result);
    });
  });
}
