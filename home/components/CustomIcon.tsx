/**
 * 自定义icon
 * author rencj@chinaoly.com
 */
import './CustomIcon.less'

export function getCustomIcon(icon: string, className?: string){
  return { type: 'html', html: "<svg class='"+ (className || "icon-rencj") +"' aria-hidden='true'><use xlink:href=#"+ icon +"></use></>" }
}