// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from "axios";
// @ts-ignore
import jwt from "jsonwebtoken";
type Data = {
  name: string;
}

export interface SrcValue {
  value:string;
}
export interface MediaPayload {
  mckey:string;
  mcpf?:string;
}
export interface WebtokenPayload {
  expt: number;
  cuid: string;
  mc: [MediaPayload]
}
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SrcValue>
) {
  const {cuid, mck, start, end} = req.query;

  const mediaPayload: MediaPayload = {
    mckey: mck as string
  };
  const webtokenPayload: WebtokenPayload = {
    expt : ((new Date()).getTime() / 1000 ) + 3600,
    cuid : cuid as string,
    mc: [mediaPayload]
  }
  const token : string = jwt.sign(webtokenPayload, "homenon");
  const url : string  = `https://v.kr.kollus.com/sr?jwt=${token}&custom_key=08f100b296895b2b83e3e0c13ad80342efd4013394f9f2a77a09ec52abe440b8&download`;
  axios.head(url, {maxRedirects: 0, validateStatus: null}).then(function (response) {
    const resSrc: SrcValue = {
      value : response.headers["location"]+ `&start=${start}&end=${end}`
    }
    return res.status(200).json(resSrc);
  });
}
