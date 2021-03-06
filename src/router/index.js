import Vue from 'vue';
import VueRouter from 'vue-router';
import { store, getAuthorization } from '@/store';
import { isDevelop, setWechatTitle, isInWechat } from '@/utils/util';
// Module Route
import indexRoute from '@/router/basic/index';
import popupRoute from '@/router/basic/popup';
import msgRoute from '@/router/basic/msg';
import secretRoute from '@/router/basic/secret';
import userRoute from '@/router/basic/user';
import ProgressBar from '@/components/progressbar';
import { WECHAT_LOGIN_URL } from '@/config';

// install ProgressBar
const bar = new Vue(ProgressBar).$mount();
document.body.appendChild(bar.$el);
// added alias for vue vm $bar!
Vue.prototype.$bar = bar;

Vue.use(VueRouter);
const routes = [].concat(
  popupRoute, msgRoute, secretRoute, userRoute,
  indexRoute,
);

const router = new VueRouter({
  base: __dirname,
  // base: 'test',
  routes,
  mode: 'hash',
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeResolve((to, from, next) => {
  const matched = router.getMatchedComponents(to);
  const prevMatched = router.getMatchedComponents(from);
  let diffed = false;
  const activated = matched.filter((c, i) => diffed || (diffed = (prevMatched[i] !== c)));
  // Deal with Vue.use() of current component.
  activated.map(c => c.uses).filter(_ => _).forEach((uses) => {
    Object.values(uses).forEach(entity => Vue.use(entity));
  });
  // Deal with async data of current component.
  const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _);
  if (!asyncDataHooks.length) {
    bar.finish();
    next();
  } else {
    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to }))).then(() => {
      bar.finish();
      next();
    }).catch(next);
  }
});

router.beforeEach(async (to, from, next) => {
  if (to.name !== 'popup') {
    bar.start();
  }
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const requiresDevelop = to.matched.some(record => record.meta.requiresDevelop);
  let redirect;
  const user = (requiresAuth || requiresGuest) ? await getAuthorization() : null;
  if (requiresDevelop && !isDevelop()) {
    redirect = { name: 'index' };
  } else if (!user && requiresAuth) {
    if (isInWechat() && WECHAT_LOGIN_URL) {
      window.location = WECHAT_LOGIN_URL;
    } else {
      redirect = { name: 'user_login', query: { redirect: to.fullPath } };
    }
  } else if (user && requiresGuest) {
    redirect = { name: 'user' };
  } else if (user && to.query.redirect) {
    redirect = { path: to.query.redirect };
  }
  next(redirect);
});

router.afterEach((route) => {
  if (route.meta.title) {
    setWechatTitle(route.meta.title);
  }
});
// router.onError((callback) => {
//   console.log(callback);
// });
//
export default router;
