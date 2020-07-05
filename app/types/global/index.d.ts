type SuccessBodySingle<T> = {
  status: "OK";
  item: T;
};

type SuccessBodyList<T> = {
  status: "OK";
  items: T[];
  totalCount: number;
  limit: number;
  offset: number;
};

type FailBodySingle = {
  status: "FAILED";
  message: string;
};

type FailBodyList = {
  status: "FAILED";
  message: string;
};

type ListBasicQuery = {
  offset?: string;
  limit?: string;
};

type ResponseBodySingle<T> = SuccessBodySingle<T> | FailBodySingle;
type ResponseBodyList<T> = SuccessBodyList<T> | FailBodyList;
