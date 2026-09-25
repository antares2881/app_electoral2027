import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import {initialize} from '../helpers/general'

Vue.use(VueRouter)
	let routes = [
		{
			// will match everything
			path: '*',
			component: () => import('../views/404.vue'),
		},
		{
			path: '/',
			name: 'Home',
			redirect: '/ingresar',
		},
		{
			path: '/change-password',
			name: 'ChangePassword',
			layout: 'dashboard',
			meta: {
				requiresAuth: true
			},
			component: () => import('../views/ChangePassword.vue'),
		},
		{
			path: '/coordinadores',
			name: 'coordinadores',
			layout: 'dashboard',
			meta: {
				requiresAuth: true,
				// isSuperAdmin: true
			},
			component: () => import('../views/Coordinadores.vue'),
		},
		{
			path: '/consultar',
			name: 'Consultar',
			layout: 'dashboard',
			meta: {
				requiresAuth: true
			},
			component: () => import('../views/ConsultaVotante.vue'),
		},
		{
			path: '/estadisticas',
			name: 'Estadisticas',
			layout: 'dashboard',
			meta: {
				requiresAuth: true
			},
			component: () => import('../views/Estadisticas.vue'),
		},		
		{
			path: '/estadisticas2019',
			name: 'EstadisticasLocales2019',
			layout: 'dashboard',
			meta: {
				requiresAuth: true
			},
			component: () => import('../views/Estadisticas2019.vue'),
		},
		{
			path: '/estadisticas2023',
			name: 'EstadisticasLocales2023',
			layout: 'dashboard',
			meta: {
				requiresAuth: true
			},
			component: () => import('../views/Estadisticas2023.vue'),
		},
		{
			path: '/informes',
			name: 'Informes',
			layout: 'dashboard',
			meta: {
				requiresAuth: true
			},
			component: () => import('../views/Informes.vue'),
		},
		{
			path: '/dashboard',
			name: 'Dashboard',
			layout: "dashboard",
			meta: {
				requiresAuth: true,
				isSuperAdmin: true
			},
			component: () => import(/* webpackChunkName: "dashboard" */ '../views/InicioConMapa.vue'),
		},
		{
			path: '/layout',
			name: 'Layout',
			layout: "dashboard",
			component: () => import('../views/Layout.vue'),
		},
		{
			path: '/programador',
			name: 'Programador',
			layout: 'dashboard',
			meta: {
				requiresAuth: true
			},
			component: () => import('../views/Programador.vue'),
		},
		{
			path: '/militantes',
			name: 'Militantes',
			layout: 'dashboard',
			meta: {
				requiresAuth: true
			},
			component: () => import('../views/Votantes.vue'),
		},
		{
			path: '/firmas',
			name: 'Firmas',
			layout: 'dashboard',
			meta: {
				requiresAuth: true,
				isFirm: true
			},
			component: () => import('../views/Firmas.vue'),
		},
		{
			path: '/juradostestigos',
			name: 'Juradostestigos',
			layout: 'dashboard',
			meta: {
				requiresAuth: true,
				isSuperAdmin: true
			},
			component: () => import('../views/JuradosTestigos.vue'),
		},
		{
			path: '/reportes',
			name: 'Reportes',
			layout: "dashboard",
			meta: {
				requiresAuth: true
			},
			component: () => import('../views/Reportes.vue'),
		},
		{
			path: '/asistencia',
			name: 'Asistencia',
			layout: "dashboard",
			meta: {
				requiresAuth: true
			},
			component: () => import('../views/Asistencia.vue'),
		},
		{
			path: '/configuracion',
			name: 'Configuracion',
			layout: "dashboard",
			meta: {
				requiresAuth: true,
				isSuperAdmin: true
			},
			component: () => import('../views/Configuracion.vue'),
		},
		{
			path: '/ipreportes',
			name: 'ipreportes',
			layout: "dashboard",
			meta: {
				requiresAuth: true,
				isSuperAdmin: true
			},
			component: () => import('../views/Ipreporte.vue'),
		},
		{
			path: '/comandos',
			name: 'Comandos',
			layout: "dashboard",
			meta: {
				requiresAuth: true
			},
			component: () => import('../views/Comandos.vue'),
		},
		{
			path: '/preconteo',
			name: 'Preconteo',
			layout: "dashboard",
			meta: {
				requiresAuth: true
			},
			component: () => import('../views/Preconteo.vue'),
		},
		{
			path: '/departamentos/:id',
			name: 'Departamentos',
			layout: "dashboard",
			meta: {
				requiresAuth: true
			},
			component: () => import('../components/Departamentos/Index.vue'),
		},
		{
			path: '/municipios/:id',
			name: 'Mcpios',
			layout: "dashboard",
			meta: {
				requiresAuth: true
			},
			component: () => import('../components/Municipios/Index.vue'),
		},
		{
			path: '/municipios',
			name: 'Municipios',
			layout: "default",
			meta: {
				requiresAuth: true
			},
			component: () => import('../components/Mapas/Municipios.vue'),
		},
		{
			path: '/ingresar',
			name: 'Ingresar',
			component: () => import('../views/Sign-In.vue'),
		},
		{
			path: '/Profile',
			name: 'Profile',
			layout: "dashboard",
			meta: {
				layoutClass: 'layout-profile',
				requiresAuth: true,
				isSuperAdmin: true
			},
			component: () => import('../views/Profile.vue'),
		},
	]



// Adding layout property from each route to the meta
// object so it can be accessed later.
function addLayoutToRoute( route, parentLayout = "default" )
{
	route.meta = route.meta || {} ;
	route.meta.layout = route.layout || parentLayout ;
	
	if( route.children )
	{
		route.children = route.children.map( ( childRoute ) => addLayoutToRoute( childRoute, route.meta.layout ) ) ;
	}
	return route ;
}

routes = routes.map( ( route ) => addLayoutToRoute( route ) ) ;

const router = new VueRouter({
	mode: 'hash',
	base: process.env.BASE_URL,
	routes,
	scrollBehavior (to, from, savedPosition) {
		if ( to.hash ) {
			return {
				selector: to.hash,
				behavior: 'smooth',
			}
		}
		return {
			x: 0,
			y: 0,
			behavior: 'smooth',
		}
	}
})

initialize(store, router);

export default router
