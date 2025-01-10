import * as models from '@src/app/models';
import { randomNum } from './randomString';

export const uniqueStringGenerator = async (
  type: string,
  model: string,
  value: string = '',
  field?: string,
): Promise<string> => {
  switch (type) {
    case 'iId':
      const doc = await models[model].findOne({}).sort({ id: -1 });
      let newIId =
        doc && doc.id ? parseInt(doc.id) : value ? parseInt(value) : 1000000000;
      while (
        await models[model].exists(
          field ? { [field]: newIId.toString() } : { id: newIId.toString() },
        )
      ) {
        newIId = newIId + randomNum(1);
      }
      return newIId.toString();
  }
};
