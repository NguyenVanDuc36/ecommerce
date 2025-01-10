export class PaginateDto {
  limit?: number = 10;
  page?: number = 1;
  sort?: object | string | undefined;
}
