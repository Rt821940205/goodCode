import { modelFieldPrefix } from '@/pages/app/datasource/util/modelField';

export class chinaolyAuth {
  public AUTH_URL = modelFieldPrefix.URL_FIELD_PREFIX.toString() + 'url';
  public AUTH_APP_KEY = modelFieldPrefix.URL_FIELD_PREFIX.toString() + 'appKey';
  public AUTH_APP_SECRET = modelFieldPrefix.URL_FIELD_PREFIX.toString() + 'appSecret';
}
