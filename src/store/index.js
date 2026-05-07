/*
 * @Author: sharpxiajun
 * @Date: 2022-06-21 15:33:15
 * @Last Modified by:   sharpxiajun
 * @Last Modified time: 2022-06-21 15:33:15
 */

import { createStore } from "vuex";
import app from "./modules/app";
import user from "./modules/user";
import settings from "./modules/settings";
import getters from "./getters";
import page from "./modules/page";

export default createStore({
  getters,
  modules: {
    app,
    user,
    settings,
    page,
  },
});
