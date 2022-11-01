import { END_POINT } from "@lib/constants";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    axios
      .post(`${END_POINT}/auth/login`, req.body, { withCredentials: true })
      .then((response) => {
        console.log(
          "response from auth login server",
          response.headers["set-cookie"]
        );
        res.setHeader("Set-Cookie", response.headers["set-cookie"] || []);
        res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response) {
          if (error?.response?.status === 401) {
            res.status(401).json(error.response.data);
          } else {
            res
              .status(error?.response?.status || 500)
              .json(error?.response?.data);
          }
        }
      });
  } else {
    res.status(200).json({ message: "Hello World from get method" });
  }
}

export default apiHandler;
