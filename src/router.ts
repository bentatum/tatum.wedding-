import Vue from 'vue';
import Router from 'vue-router';
import Images from './views/Images.vue';
import Videos from './views/Videos.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/images'
    },
    {
      path: '/images',
      name: 'images',
      component: Images,
    },
    {
      path: '/videos',
      name: 'videos',
      component: Videos,
    }
  ],
});
