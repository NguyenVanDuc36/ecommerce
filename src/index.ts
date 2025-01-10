import moduleAlias from 'module-alias';

moduleAlias.addAliases({
  '@src': `${__dirname}`,
  '@src/*': `${__dirname}/*`,
});

import { ApiService, DbService } from '@src/app/services';
import redisService from './app/services/redis.service';

const main = async () => {
  ApiService.start();
  await DbService.connect();
  await DbService.initializeUser();
  await redisService.connect();
};

main().then((_) => {});
