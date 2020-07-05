type SuccessBodySingle<T> = {
  status: "OK";
  item: T;
};

type FailBodySingle = {
  status: "FAILED";
  message: string;
};

type ResponseBodySingle<T> = SuccessBodySingle<T> | FailBodySingle;
