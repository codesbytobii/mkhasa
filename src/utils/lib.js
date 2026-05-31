import { getCode } from "./currency";
import timezoneToCountry from "./timezones.json";

export const formatCurrency = (number, currency = "GHS") => {
  if (Number.isNaN(number)) return "";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency,
    currencyDisplay: "narrowSymbol",
  }).format(number);
};

export const format = (number) => {
  if (Number.isNaN(number)) return "";
  return new Intl.NumberFormat().format(number);
};

export const getUserCountry = () => {
  var userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  var tzArr = userTZ.split("/");
  return getCode(timezoneToCountry[tzArr[tzArr.length - 1]]);
};

export const prefix = (val, prefix = "mkhasa") => {
  if (typeof val !== "string" || typeof prefix !== "string")
    throw new Error("Invalid argument");
  return `${prefix}_${val}`;
};
