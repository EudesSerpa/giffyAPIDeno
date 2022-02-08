export default ({ response }: { response: any }) => {
  response.status = 404;
  response.body = {
    error: "404 - Not found",
  };
};
