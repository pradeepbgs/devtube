import { apiResponse } from "../utils/apiResponce.js";

const healthcheck = (req, res) => {
  return res.status(200).json(new apiResponse(200, "OK, everything seems fine"));
};

export {
  healthcheck
};

