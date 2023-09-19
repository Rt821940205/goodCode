import { ModelInfoDialog } from '@/pages/component/Setting/component/ModelInfoDialog';

/**
 * 行为参数显示
 * @param title
 * @param name
 * @param key
 * @returns
 */
export function ActionParameters(title: string, name: string, key: string) {
  return {
    label: title,
    type: 'button',
    level: 'link',
    actionType: 'dialog',
    dialog: {
      closeOnEsc: true,
      closeOnOutside: true,
      size: 'lg',
      title: name,
      actions: [],
      body: ModelInfoDialog(key),
    },
  };
}
