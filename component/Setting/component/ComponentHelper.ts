export const defaultFields = [
    'id',
    'state',
    'model_id',
    'modify_name',
    'create_id',
    'modify_id',
    'create_name',
    'modify_time',
    'create_time',
    'cls',
    'config_status',
    'engine_store_group',
    'config_name',
    'ui_properties'
  ];


  export function isDefaultField(key: string) {
    return defaultFields.includes(key);
  }