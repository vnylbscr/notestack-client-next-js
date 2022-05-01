import { END_POINT } from "@lib/constants";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const apiHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    axios
      .post(`${END_POINT}/auth/logout`, req.body)
      .then((response) => {
        console.log(
          "response from auth logout server",
          response.headers["set-cookie"]
        );
        res.setHeader("Set-Cookie", response.headers["set-cookie"] || []);
        res.status(200).json(response.data);
      })
      .catch((error) => {
        if (error.response) {
          res.status(401).json(error.response.data);
        }
      });
  }
};

export default apiHandler;
