export type PageBody = {
  id?: number;
  page_name?: string;
  app_id?: number;
  title?: string;
  module_id?: number;
  body?: string;
  hide?: number;
};

export type PageModule = {
  id?: number;
  module_name?: string;
  hide?: number;
};
