<template>
	
	<!-- Main Sidebar -->
	<a-layout-sider
		collapsible
		class="sider-primary"
		breakpoint="lg"
		collapsed-width="0"
		width="250px"
		:collapsed="sidebarCollapsed"
		@collapse="$emit('toggleSidebar', ! sidebarCollapsed)"
		:trigger="null"
		:class="['ant-layout-sider-' + sidebarColor, 'ant-layout-sider-' + sidebarTheme]"
		theme="dark"
		:style="{ backgroundColor: '#45556C',}">
			<div class="brand text-center"><img src="images/logo-ct-white.png" alt="Logo" class="image-center"></div>
			<hr>

			<!-- Sidebar Navigation Menu -->
			<a-menu theme="dark" mode="inline" :style="{ backgroundColor: '#45556C' }">
				<a-menu-item v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2 || $store.state.user.role_id === 4">
					<router-link to="/dashboard">
						<span class="icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" fill="#FFFFFF"/>
							</svg>
						</span>
						<span class="label">Dashboard</span>
					</router-link>
				</a-menu-item>
				<!-- <a-menu-item v-if="$store.state.user.role_id !== 3">
					<router-link to="/asistencia">
						<span class="icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z" fill="#111827"/>
							</svg>
						</span>
						<span class="label">Asistencia</span>
					</router-link>
				</a-menu-item>
				<a-menu-item v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2 || $store.state.user.role_id === 7 ">
					<router-link to="/preconteo">
						<span class="icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z" fill="#111827"/>
								<path d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z" fill="#111827"/>
								<path d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z" fill="#111827"/>
							</svg>
						</span>
						<span class="label">Preconteo</span>
					</router-link>
				</a-menu-item> -->
				
				<!-- <a-menu-item >
					<router-link to="/consultar">
						<span class="icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z" fill="#111827"/>
							</svg>
						</span>
						<span class="label">Consultar</span>
					</router-link>
				</a-menu-item> -->
				<a-menu-item-group key="estadisticas-informes" class="submenu-militantes" v-if="[1, 2, 4, 8].includes($store.state.user.role_id)">
                    <button slot="title" type="button" class="titulo-militantes titulo-estadisticas-informes" :aria-expanded="String(menuAbierto.includes('estadisticas-informes'))" @click="menuAbierto = menuAbierto.includes('estadisticas-informes') ? [] : ['estadisticas-informes']">
                        <span class="icon"><b-icon icon="bar-chart"></b-icon></span>
                        <span class="label">Estadísticas e informes</span>
                        <span class="flecha-militantes" aria-hidden="true">{{ menuAbierto.includes('estadisticas-informes') ? '▾' : '▸' }}</span>
                    </button>
                    <a-menu-item key="submenu-estadisticas" v-if="menuAbierto.includes('estadisticas-informes') && [1, 2, 8].includes($store.state.user.role_id)">
                        <router-link class="enlace-submenu-militantes" to="/estadisticas" active-class="opcion-activa">Estadísticas</router-link>
                    </a-menu-item>
                    <a-menu-item key="submenu-informes" v-if="menuAbierto.includes('estadisticas-informes') && [1, 2, 4].includes($store.state.user.role_id)">
                        <router-link class="enlace-submenu-militantes" to="/informes" active-class="opcion-activa">Informes</router-link>
                    </a-menu-item>
                </a-menu-item-group>				
				<a-menu-item-group key="programador" class="submenu-militantes" v-if="[1, 2, 4].includes($store.state.user.role_id)">
                    <button slot="title" type="button" class="titulo-militantes" :aria-expanded="String(menuAbierto.includes('programador'))" @click="menuAbierto = menuAbierto.includes('programador') ? [] : ['programador']">
                        <span class="icon"><b-icon icon="calendar"></b-icon></span>
                        <span class="label">Programador</span>
                        <span class="flecha-militantes" aria-hidden="true">{{ menuAbierto.includes('programador') ? '▾' : '▸' }}</span>
                    </button>
                    <a-menu-item key="programador-agendas" v-if="menuAbierto.includes('programador')">
                        <router-link class="enlace-submenu-militantes" :to="{ path: '/programador', query: { opcion: 'agendas' } }" active-class="" exact-active-class="" :class="{ 'opcion-activa': $route.path === '/programador' && $route.query.opcion !== 'calendario' }">Agendas</router-link>
                    </a-menu-item>
                    <a-menu-item key="programador-calendario" v-if="menuAbierto.includes('programador')">
                        <router-link class="enlace-submenu-militantes" :to="{ path: '/programador', query: { opcion: 'calendario' } }" active-class="" exact-active-class="" :class="{ 'opcion-activa': $route.path === '/programador' && $route.query.opcion === 'calendario' }">Calendario electoral</router-link>
                    </a-menu-item>
                </a-menu-item-group>
                <a-menu-item-group key="militantes" class="submenu-militantes" v-if="$store.state.user.role_id !== 3 && $store.state.user.role_id !== 10 && $store.state.user.role_id !== 11">
                    <button slot="title" type="button" class="titulo-militantes" :aria-expanded="String(menuAbierto.includes('militantes'))" @click="menuAbierto = menuAbierto.includes('militantes') ? [] : ['militantes']"><span class="icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" fill="#FFFFFF"/>
							</svg>
						</span>
						<span class="label">Militantes</span><span class="flecha-militantes" aria-hidden="true">{{ menuAbierto.includes('militantes') ? '▾' : '▸' }}</span></button>
                    <a-menu-item key="militantes-agregar" v-if="menuAbierto.includes('militantes')">
                        <router-link class="enlace-submenu-militantes" :to="{ path: '/militantes', query: { opcion: 'agregar' } }" active-class="" exact-active-class="" :class="{ 'opcion-activa': $route.path === '/militantes' && !['ver', 'gestionar'].includes($route.query.opcion) }">Agregar militante</router-link>
                    </a-menu-item>
                    <a-menu-item key="militantes-ver" v-if="menuAbierto.includes('militantes') && ($store.state.user.role_id === 1 || $store.state.user.role_id === 2)">
                        <router-link class="enlace-submenu-militantes" :to="{ path: '/militantes', query: { opcion: 'ver' } }" active-class="" exact-active-class="" :class="{ 'opcion-activa': $route.path === '/militantes' && $route.query.opcion === 'ver' }">Ver militantes</router-link>
                    </a-menu-item>
                    <a-menu-item key="militantes-gestionar" v-if="menuAbierto.includes('militantes') && ($store.state.user.role_id === 1 || $store.state.user.role_id === 2)">
                        <router-link class="enlace-submenu-militantes" :to="{ path: '/militantes', query: { opcion: 'gestionar' } }" active-class="" exact-active-class="" :class="{ 'opcion-activa': $route.path === '/militantes' && $route.query.opcion === 'gestionar' }">Gestionar militantes</router-link>
                    </a-menu-item>
                </a-menu-item-group>
				<a-menu-item v-if="$store.state.user.role_id !== 10 && $store.state.user.role_id !== 11 && $store.state.user.role_id !== 7 && $store.state.user.role_id !== 3">
					<router-link to="/coordinadores">
						<span class="icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" fill="#FFFFFF"/>
							</svg>
						</span>
						<span class="label">{{ ($store.state.user.role_id === 5) ? 'Lideres' : 'Coordinadores' }}</span>
					</router-link>
				</a-menu-item>
				
				<!-- <a-menu-item v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2">
					<router-link to="/juradostestigos">
						<span class="icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" fill="#FFFFFF"/>
							</svg>
						</span>
						<span class="label">Jurados-Testigos</span>
					</router-link>
				</a-menu-item> -->
				<a-menu-item-group key="reportes" class="submenu-militantes" v-if="[1, 2, 4, 5, 6].includes($store.state.user.role_id)">
                    <button slot="title" type="button" class="titulo-militantes" :aria-expanded="String(menuAbierto.includes('reportes'))" @click="menuAbierto = menuAbierto.includes('reportes') ? [] : ['reportes']">
                        <span class="icon"><b-icon icon="clipboard-data"></b-icon></span>
                        <span class="label">Reportes</span>
                        <span class="flecha-militantes" aria-hidden="true">{{ menuAbierto.includes('reportes') ? '▾' : '▸' }}</span>
                    </button>
                    <a-menu-item key="reportes-usuarios" v-if="menuAbierto.includes('reportes') && ![5, 6].includes($store.state.user.role_id)">
                        <router-link class="enlace-submenu-militantes" :to="{ path: '/reportes', query: { opcion: 'usuarios' } }" active-class="" exact-active-class="" :class="{ 'opcion-activa': $route.path === '/reportes' && (!['ingresados', 'repetidos'].includes($route.query.opcion) && ![5, 6].includes($store.state.user.role_id)) }">Estadísticas x usuario</router-link>
                    </a-menu-item>
                    <a-menu-item key="reportes-ingresados" v-if="menuAbierto.includes('reportes')">
                        <router-link class="enlace-submenu-militantes" :to="{ path: '/reportes', query: { opcion: 'ingresados' } }" active-class="" exact-active-class="" :class="{ 'opcion-activa': $route.path === '/reportes' && (($route.query.opcion === 'ingresados' || ([5, 6].includes($store.state.user.role_id) && $route.query.opcion !== 'repetidos'))) }">Militantes ingresados</router-link>
                    </a-menu-item>
                    <a-menu-item key="reportes-repetidos" v-if="menuAbierto.includes('reportes')">
                        <router-link class="enlace-submenu-militantes" :to="{ path: '/reportes', query: { opcion: 'repetidos' } }" active-class="" exact-active-class="" :class="{ 'opcion-activa': $route.path === '/reportes' && ($route.query.opcion === 'repetidos') }">Militantes repetidos</router-link>
                    </a-menu-item>
                </a-menu-item-group>
				<a-menu-item class="menu-item-header" v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2 "  >
					<span class="title-config">Opciones de Configuracion</span>
				</a-menu-item>			
				
				<a-menu-item-group key="personal" class="submenu-militantes" v-if="opcionesPersonal.length">
                    <button slot="title" type="button" class="titulo-militantes" :aria-expanded="String(menuAbierto.includes('personal'))" @click="menuAbierto = menuAbierto.includes('personal') ? [] : ['personal']">
                        <span class="icon"><b-icon icon="gear-fill"></b-icon></span>
                        <span class="label">Personal</span>
                        <span class="flecha-militantes" aria-hidden="true">{{ menuAbierto.includes('personal') ? '▾' : '▸' }}</span>
                    </button>
                    <template v-if="menuAbierto.includes('personal')">
                        <a-menu-item v-for="opcion in opcionesPersonal" :key="'personal-' + opcion.clave">
                            <router-link class="enlace-submenu-militantes" :to="{ path: '/configuracion', query: { opcion: opcion.clave } }" active-class="" exact-active-class="" :class="{ 'opcion-activa': $route.path === '/configuracion' && opcion.clave === opcionPersonalActiva }">{{ opcion.texto }}</router-link>
                        </a-menu-item>
                    </template>
                </a-menu-item-group>
				<!-- <a-menu-item v-if="$store.state.user.role_id === 1">

					<router-link to="/ipreportes">
						<span class="icon">
							<svg height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" fill="#FFFFFF"/>
							</svg>
						</span>
						<span class="label">IP</span>
					</router-link>
				</a-menu-item> -->
				
				<!-- <a-menu-item v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2">
					<router-link to="/comandos">
						<span class="icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z" fill="#111827"/>
								<path d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z" fill="#111827"/>
								<path d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z" fill="#111827"/>
							</svg>
						</span>
						<span class="label">Comandos</span>
					</router-link>
				</a-menu-item> -->
			</a-menu>

	</a-layout-sider>
	<!-- / Main Sidebar -->

</template>

<script>

	export default ({
		props: {
			// Sidebar collapsed status.
			sidebarCollapsed: {
				type: Boolean,
				default: false,
			},
			
			// Main sidebar color.
			sidebarColor: {
				type: String,
				default: "primary",
			},
			
			// Main sidebar theme : light, white, dark.
			sidebarTheme: {
				type: String,
				default: "light",
			},
		},
        computed: {
            opcionesPersonal() {
                const usuario = this.$store.state.user;
                const candidato = (usuario.candidato || [])[0] || {};
                const admin = [1, 2].includes(usuario.role_id);
                const permiteUsuarios = Number(candidato.corporacione_id) !== 5;
                return [
                    { clave: 'candidatos', texto: 'Candidatos', valor: 5, visible: admin && permiteUsuarios },
                    { clave: 'coordinadores', texto: 'Coordinadores', valor: 4, visible: admin },
                    { clave: 'lideres', texto: 'Líderes', valor: 2, visible: admin },
                    { clave: 'usuarios', texto: 'Usuarios', valor: 1, visible: [1, 2, 6].includes(usuario.role_id) && permiteUsuarios }
                ].filter(opcion => opcion.visible);
            },
            opcionPersonalActiva() {
                const opcion = this.opcionesPersonal.find(item => item.clave === this.$route.query.opcion) || this.opcionesPersonal[0];
                return opcion ? opcion.clave : null;
            }
        },
        watch: {
            '$route.path'(path) {
                if (path === '/configuracion' && !this.menuAbierto.includes('personal')) this.menuAbierto.push('personal');
                if (path === '/reportes' && !this.menuAbierto.includes('reportes')) this.menuAbierto.push('reportes');
                if (path === '/programador' && !this.menuAbierto.includes('programador')) this.menuAbierto.push('programador');
                if (path === '/militantes' && !this.menuAbierto.includes('militantes')) this.menuAbierto.push('militantes');
                if (['/estadisticas', '/informes'].includes(path) && !this.menuAbierto.includes('estadisticas-informes')) this.menuAbierto.push('estadisticas-informes');
            }
        },
		data() {
			return {
				menuAbierto: this.$route.path === '/configuracion' ? ['personal'] : this.$route.path === '/reportes' ? ['reportes'] : this.$route.path === '/programador' ? ['programador'] : this.$route.path === '/militantes' ? ['militantes'] : (['/estadisticas', '/informes'].includes(this.$route.path) ? ['estadisticas-informes'] : []),
			}
		},
	})

</script>
<style>
    .titulo-estadisticas-informes .label { white-space: normal; line-height: 1.35; flex: 1; }
    .titulo-estadisticas-informes .icon { flex-shrink: 0; }

    .ant-layout-sider.sider-primary .ant-menu-item a.enlace-submenu-militantes,
    .ant-layout-sider.sider-primary .ant-menu-item a.enlace-submenu-militantes:visited {
        white-space: normal;
        overflow-wrap: anywhere;
        display: block;
        color: #ffffff !important;
        padding: 10px 12px 10px 18px !important;
        margin: 3px 8px 3px 48px !important;
        width: calc(100% - 56px) !important;
        box-sizing: border-box;
        border-left: 2px solid #a9bdcf;
        border-radius: 0 6px 6px 0;
        font-size: 13px;
        line-height: 1.5;
    }
    .ant-layout-sider.sider-primary .ant-menu-item a.enlace-submenu-militantes:hover,
    .ant-layout-sider.sider-primary .ant-menu-item a.enlace-submenu-militantes.opcion-activa {
        color: #ffffff !important;
        background: #2f3f56 !important;
        border-left-color: #ffffff;
    }

    .submenu-militantes > .ant-menu-item-group-title { padding: 0; }
    .submenu-militantes .titulo-militantes { width: 100%; padding: 10px 16px; background: transparent; border: 0; cursor: pointer; text-align: left; min-height: 52px; }
    .submenu-militantes .titulo-militantes:hover { background: #2f3f56; }
    .submenu-militantes .titulo-militantes:focus-visible { outline: 2px solid white; outline-offset: -2px; }
    .submenu-militantes .flecha-militantes { margin-left: auto; }
    .layout-dashboard .sider-primary .submenu-militantes .ant-menu-item a { display: block; padding: 10px 12px 10px 42px; color: #fff !important; }

    .submenu-militantes .titulo-militantes { display: inline-flex; align-items: center; gap: 10px; color: #fff; font-weight: 600; }
    .submenu-militantes .titulo-militantes .icon { display: inline-flex; background: transparent; box-shadow: none; }
    .submenu-militantes .ant-menu-item a { font-size: 13px; border-radius: 6px; }
    .submenu-militantes .opcion-activa { background: #2F3F56; color: #fff; font-weight: 700; }

	/* Estilos básicos */
	a {
		text-decoration: none !important;	
	}
	.image-center {
		height: 80px !important;
	}
	.title-config {
		color: #FFFFFF;
		font-weight: 700;
	}
	
	/* Sobrescribir el #2b2a2a del SCSS con máxima especificidad */
	.layout-dashboard .ant-layout-sider.sider-primary.ant-layout-sider-dark {
		background-color: #45556C !important;
	}
	
	/* Forzar #45556C en todos los elementos del sidebar */
	.ant-layout-sider {
		background-color: #45556C !important;
	}
	
	.ant-menu {
		background-color: #45556C !important;
	}
	
	.ant-layout-sider-children {
		background-color: #45556C !important;
	}
	
	/* Iconos sin fondo gris */
	.ant-menu-item .icon {
		background-color: transparent !important;
		box-shadow: none !important;
	}
	
	/* Estado hover - fondo más claro */
	.ant-menu-item:hover {
		background-color: #5A6A81 !important;
	}
	
	/* Estado seleccionado - fondo más oscuro */
	.ant-menu-item-selected,
	.ant-menu-item .router-link-active {
		background-color: #2F3F56 !important;
	}
	
	/* Hover en elemento seleccionado */
	.ant-menu-item-selected:hover {
		background-color: #2F3F56 !important;
	}
</style>
