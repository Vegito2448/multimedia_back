import { ITopicPermissions } from '../types/index.ts';

const topicValidation = (value: ITopicPermissions) => {

  const keys = ['images', 'videos', 'texts'];

  const permissionsKeys = Object.keys(value);

  if (typeof value !== 'object' || !value || permissionsKeys.length === 0 || permissionsKeys.length !== keys.length
    || !keys.every(key => permissionsKeys.includes(key))
  ) {
    throw new Error('Permissions must be an object of 3 specific keys and cannot be empty');
  }


  const { images, videos, texts } = value;
  if (typeof images !== 'boolean') {
    throw new Error('Images permission must be a boolean');
  }
  if (typeof videos !== 'boolean') {
    throw new Error('Videos permission must be a boolean');
  }
  if (typeof texts !== 'boolean') {
    throw new Error('Texts permission must be a boolean');
  }
  return true;
};

export { topicValidation };

