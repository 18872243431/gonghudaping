import routes from "router/routes";
import { getMenuList } from "@/api/login";

const permission = {
  state: {
    theme: "skin-default",
    title: "",
    menus: [],
  },
  mutations: {
    SET_THEME: (state, theme) => {
      state.theme = theme;
    },
    SET_TITLE: (state, title) => {
      state.title = title;
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus;
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(async (resolve) => {
        // const res = await getMenuList();
        // commit("SET_TITLE", routes[0].meta.title);
        // if (res.code === 200) {
        //   const screenRoute = res.data.menusList.children.find(
        //     (item) => item.menuCode === "daping"
        //   );
        //   if (screenRoute?.children?.length > 0) {
        //     const asyncRoutes = createAsyncRoutes(
        //       routes[0].children,
        //       screenRoute.children
        //     );
        //     routes[0].children = asyncRoutes;
        //     routes[0].redirect = asyncRoutes[0].path;
        //     commit("SET_MENUS", asyncRoutes);
        //     resolve(asyncRoutes);
        //   }
        // } else {
        //   commit("SET_MENUS", routes[0].children);
        //   resolve(routes);
        // }
        commit("SET_TITLE", routes[0].meta.title);
        commit("SET_MENUS", routes[0].children);
        resolve(routes);
      });
    },
  },
};

function createAsyncRoutes(routes, menuList) {
  let asyncRoutes = [];
  menuList.forEach((menu) => {
    const route = routes.find((item) => item.menuCode === menu.menuCode);
    if (route) {
      let children = [];
      let redirect = "";
      if (route?.children?.length > 0) {
        children = createAsyncRoutes(route.children, menu.children);
        const visibleChildren = children.filter((item) => !item.meta.hidden);
        redirect = visibleChildren[0]?.path ?? "";
      }
      children.length > 0
        ? asyncRoutes.push({
            ...route,
            meta: {
              ...route.meta,
              title: menu.menuName,
              hidden: !menu.isVisible,
            },
            children,
            redirect,
          })
        : asyncRoutes.push({
            ...route,
            meta: {
              ...route.meta,
              title: menu.menuName,
              hidden: !menu.isVisible,
            },
            redirect,
          });
    }
  });
  return asyncRoutes;
}

export default permission;
