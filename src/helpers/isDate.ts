import { Meta } from "express-validator";
import moment from "moment";

const isDate = (value: number, { }: Meta) => {

  if (!value) {
    return false;
  }

  const date = moment(value);
  return date.isValid();
};

export { isDate };

