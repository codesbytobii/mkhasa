import axios from "axios";
const DEFAULT_API_BASE = "https://mkhasa-bfdb6fabd978.herokuapp.com/api/v1";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_API_BASE;

export default axios.create({
  baseURL,
});
