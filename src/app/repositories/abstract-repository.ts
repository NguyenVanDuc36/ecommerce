import mongoose, {
  Document,
  InsertManyOptions,
  Model,
  MongooseBaseQueryOptions,
  MongooseUpdateQueryOptions,
  PaginateOptions,
  ProjectionType,
  QueryOptions,
  RootFilterQuery,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';

export interface IRepository<TEntity> {
  findOne<ResultDoc = TEntity>(
    filter: RootFilterQuery<TEntity>,
    projection?: ProjectionType<TEntity>,
    options?: QueryOptions<TEntity> & { lean?: boolean },
  ): Promise<ResultDoc | null>;

  create(data: Partial<TEntity>): Promise<TEntity>;

  find<ResultDoc = TEntity>(
    filter: RootFilterQuery<TEntity>,
    projection?: ProjectionType<TEntity> | null | undefined,
    options?: QueryOptions<TEntity> | null | undefined,
  );

  exists<ResultDoc = TEntity>(
    filter: RootFilterQuery<ResultDoc>,
  ): Promise<boolean>;

  insertMany<ResultDoc = TEntity>(
    doc: Array<ResultDoc>,
    options?: InsertManyOptions & { ordered: false; rawResult: true },
  );

  paginate<ResultDoc = TEntity>(
    filter: RootFilterQuery<TEntity>,
    options: PaginateOptions,
  ): Promise<{
    docs: ResultDoc[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
  }>;
}

export abstract class AbstractRepository<TEntity extends Document>
  implements IRepository<TEntity>
{
  protected readonly _model: Model<TEntity>;

  constructor(model: Model<TEntity>) {
    this._model = model;
  }
  deleteOne(
    filter?: RootFilterQuery<TEntity>,
    options?: MongooseBaseQueryOptions<TEntity>,
  ) {
    this._model.deleteOne(filter, options);
  }

  create(data: Partial<TEntity>): Promise<TEntity> {
    return this._model.create(data);
  }

  findOne<ResultDoc = TEntity>(
    filter: RootFilterQuery<TEntity>,
    projection?: ProjectionType<TEntity>,
    options?: QueryOptions<TEntity> & { lean?: boolean },
  ): Promise<ResultDoc> {
    return this._model.findOne(filter, projection, options);
  }

  find<ResultDoc = TEntity>(
    filter: RootFilterQuery<TEntity>,
    options?: QueryOptions<TEntity> | null | undefined,
  ): Promise<ResultDoc[]> {
    return this._model.find(filter, options);
  }

  async exists<ResultDoc = TEntity>(
    filter: RootFilterQuery<ResultDoc>,
  ): Promise<boolean> {
    const exist = await this._model.exists(filter);
    return !!exist;
  }

  insertMany<ResultDoc = TEntity>(
    doc: Array<ResultDoc>,
    options?: InsertManyOptions & { ordered: false; rawResult: true },
  ) {
    return this._model.insertMany(doc, options);
  }

  async paginate<ResultDoc = TEntity>(
    filter: RootFilterQuery<TEntity>,
    options: PaginateOptions,
  ): Promise<{
    docs: ResultDoc[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
  }> {
    const { projection, page, limit, sort, populate, lean } = options;

    const result = await (
      this._model as mongoose.PaginateModel<TEntity>
    ).paginate(filter, {
      projection,
      page,
      limit,
      sort,
      populate,
      lean,
    });

    return {
      docs: result.docs as ResultDoc[],
      totalDocs: result.totalDocs,
      limit: result.limit,
      page: result.page,
      totalPages: result.totalPages,
    };
  }
}
