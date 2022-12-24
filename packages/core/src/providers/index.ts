

export type ProviderRouteResponse<T> = {
  type:"redirect";
  path:string;
} | {
  type?:"response",
  success:boolean;
  message?:T;
};
