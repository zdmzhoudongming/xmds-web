import router from "./index";
import store from "@/store/index";
// import { checkLogin } from "@/api/login";
import { removeToken } from "@/utils/auth";

let isGet = false;

router.beforeEach(async (to: any, _: any, next: any) => {
  const token = localStorage.getItem("token");
  if(token){
    if(to.path == `/login?redirect=${to.path}`){
      next(to.path)
    }else{
      next()
    }
  }else{
    if(to.path == "/login" || to.path=="/"){
      next('/login')
    }else{
      next(`/login?redirect=${to.path}`);
    }
  }
  // if (token && to.path != "/login") {
  //   if ((store.state as any).permission.routers.length == 0 && isGet == true) {
  //     await store.dispatch("permission/getRoute", {
  //       id: (store.state as any).user.id,
  //     });
  //     isGet = true;
  //     const userInfo = JSON.parse(localStorage.getItem("userInfo") as string)
  //     store.commit('user/SET_USER_INFO',userInfo)
  //     const routers = (store.state as any).permission.routers.map(
  //       (item: any) => {
  //         return {
  //           path: `/${item.routeName}`,
  //           name: item.routeName,
  //           component: () =>
  //             import(
  //               /* webpackChunkName: item.routeName */ `@/${item.filePath}`
  //             ),
  //           meta: {
  //             nameZh: item.menuName,
  //           },
  //         };
  //       }
  //     );
  //     const rootRouter: any = {
  //       path: `/`,
  //       name: "layout",
  //       component: () =>
  //         import(/* webpackChunkName: "about" */ "@/layout/index.vue"),
  //       meta: {
  //         nameZh: "主页",
  //       },
  //       children: [],
  //     };
  //     rootRouter.children = routers;
  //     router.addRoute(rootRouter);
  //     next({ ...to, replace: true });
  //   } else {
  //     next();
  //   }
  // } else if (to.path == "/login") {
    // if (token) {
    //   const userInfo: any = JSON.parse(
    //     localStorage.getItem("userInfo") as string
    //   );
    //   if (
    //     res.data &&
    //     userInfo.account == res.data.account &&
    //     userInfo.userName == res.data.userName
    //   ) {
    //     store.commit("user/SET_USER_INFO", res.data);
    //     next({ path: "/" });
    //   } else {
    //     removeToken();
    //     next();
    //   }
    // } else {
    //   removeToken();
    //   next();
    // }
  //   next();
  // } else {
  //   next(`/login?redirect=${to.path}`);
  // }
});
