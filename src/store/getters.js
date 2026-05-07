/*
 * @Author: sharpxiajun 
 * @Date: 2022-06-21 15:32:49 
 * @Last Modified by:   sharpxiajun 
 * @Last Modified time: 2022-06-21 15:32:49 
 */

const getters = {
  title: state => state.settings.title,
  theme: state => state.settings.theme,
  menus: state => state.settings.menus,
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions
}

export default getters