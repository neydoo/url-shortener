export type UrlData = {
  shortUrl?: string;
  code: string;
  longUrl: string;
};

export enum StatusCode {
  Success = 200,
  Failure = 400,
}

export type EncodeBody = {
  url: string;
};
