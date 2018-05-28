import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import MainLayout from '../common/main-layout.vue'

import SchemaSchemes from '../modules/schema/Schemes.vue'
import SchemaSchemeUpdate from '../modules/schema/SchemeUpdate.vue'
import SchemaSchemeView from '../modules/schema/Scheme.vue'

export default new Router({
  routes: [
    {
      path: '/schema', component: MainLayout,
      redirect: { name: 'schema.schemes' },
      children: [
        {path: 'schemes', name: 'schema.schemes', component: SchemaSchemes},
        {path: 'schemes/create', name: 'schema.schemes.create', component: SchemaSchemeUpdate},
        {path: 'schemes/update-:id', name: 'schema.schemes.update', component: SchemaSchemeUpdate},
        {path: 'schemes/view-:id', name: 'schema.schemes.view', component: SchemaSchemeView}
      ]
    },
    {
      path: '*',
      redirect: '/schema'
    }
  ]
})

