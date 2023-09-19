/**
 * 小标题
 * author rencj@chinaoly.com
 */

import './SubTitle.less';
import { getCustomIcon } from './CustomIcon';

type props = {
  icon: string;
  title: string;
  linkName?: string;
  url?: string;
  blank?: boolean;
  isTab?:boolean
};

export function getSubTitle({ icon, title, linkName, url, blank ,isTab = true}: props) {
  const link: any = {
    type: 'container',
    body: [],
  };
  linkName &&
    link.body.push({
      type: 'action',
      level: 'link',
      className: 'subtitle-link',
      label: linkName + '>',
      actionType: 'link',
      link: url,
      blank: blank,
    });
  return {
    type: 'flex',
    justify: 'space-between',
    alignItems: 'center',
    className: `subtitle-wrapper ${isTab ? "subtitle-wrapper-tab":""}`,
    items: [
      {
        type: 'container',
        className:`${isTab ? "subtitle-text-tab" :""}`,
        body: [
          getCustomIcon(icon),
          // { type: 'html', html: "<svg class='icon' aria-hidden='true'><use xlink:href=#"+ icon +"></use></>" },
          // { type: 'html', html: "<span class='iconfont " + icon +"'></span>" },
          // { type: 'icon', icon: icon || 'fa fa-home'},
          { type: 'tpl', tpl: title, className: 'subtitle' },
        ],
      },
      link,
    ],
  };
}
