import moduleAlias from 'module-alias';

moduleAlias.addAliases({
  '@src': `${__dirname}`,
  '@src/*': `${__dirname}/*`,
});

import { ApiService, DbService } from '@src/app/services';
import redisService from '@src/app/services/redis.service';
import { logger } from '@src/common/config/logger.config';

const main = async () => {
  ApiService.start();
  await DbService.connect();
  await DbService.initializeUser();
  await redisService.connect();
};

main()
  .then(() => {})
  .catch((err) => logger.error(err));
