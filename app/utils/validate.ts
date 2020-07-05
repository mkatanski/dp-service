export const validate = (
  validator: (val: string) => boolean,
  message: string
) => (value: string): void => {
  if (!validator(value)) {
    throw new Error(message);
  }
};
