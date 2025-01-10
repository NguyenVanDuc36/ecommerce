export type SuccessResult<Result> = {
    result?: Result;
    success: true;
    statusCode: number;
  };
  
  export type FailedResult = {
    success: false;
    result?: undefined;
    message?: string;
    statusCode?: number;
  };
  
  export type ResponseSumType<Result> =
    | SuccessResult<Result>
    | FailedResult;
  
  export type EntityList<Entity> = {
    list: Entity[];
    count: number;
  };
  