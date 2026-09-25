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
				<a-menu-item v-if="$store.state.user.role_id !== 3">
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
				</a-menu-item>
				
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
				<a-menu-item v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2 || $store.state.user.role_id === 4">
					<router-link to="/informes">
						<span class="icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v2a1 1 0 102 0v-2zm2-3a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1zm4-1a1 1 0 10-2 0v6a1 1 0 102 0V8z" fill="#FFFFFF"/>
							</svg>
						</span>
						<span class="label">Informes</span>
					</router-link>
				</a-menu-item>
				<a-menu-item v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2 || $store.state.user.role_id === 8">
					<router-link to="/estadisticas">
						<span class="icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" fill="#FFFFFF"/>
							</svg>
						</span>
						<span class="label">Estadisticas</span>
					</router-link>
				</a-menu-item>				
				<a-menu-item v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2 || $store.state.user.role_id === 4">
					<router-link to="/programador">
						<span class="icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C5.44772 2 5 2.44772 5 3V4H4C2.89543 4 2 4.89543 2 6V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V6C18 4.89543 17.1046 4 16 4H15V3C15 2.44772 14.5523 2 14 2C13.4477 2 13 2.44772 13 3V4H7V3C7 2.44772 6.55228 2 6 2ZM6 7C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H14C14.5523 9 15 8.55228 15 8C15 7.44772 14.5523 7 14 7H6Z" fill="#FFFFFF"/>
							</svg>
						</span>
						<span class="label">Programador</span>
					</router-link>
				</a-menu-item>
				<a-menu-item v-if="$store.state.user.role_id !== 3 && $store.state.user.role_id !== 10 && $store.state.user.role_id !== 11">
					<router-link to="/militantes">
						<span class="icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" fill="#FFFFFF"/>
							</svg>
						</span>
						<span class="label">Militantes</span>
					</router-link>
				</a-menu-item>
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
				<a-menu-item v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2 || $store.state.user.role_id === 4 || $store.state.user.role_id === 5 || $store.state.user.role_id === 6 ">
					<router-link to="/reportes">
						<span class="icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M9 2C8.44772 2 8 2.44772 8 3C8 3.55228 8.44772 4 9 4H11C11.5523 4 12 3.55228 12 3C12 2.44772 11.5523 2 11 2H9Z" fill="#FFFFFF"/>
								<path fill-rule="evenodd" clip-rule="evenodd" d="M4 5C4 3.89543 4.89543 3 6 3C6 4.65685 7.34315 6 9 6H11C12.6569 6 14 4.65685 14 3C15.1046 3 16 3.89543 16 5V16C16 17.1046 15.1046 18 14 18H6C4.89543 18 4 17.1046 4 16V5ZM7 9C6.44772 9 6 9.44772 6 10C6 10.5523 6.44772 11 7 11H7.01C7.56228 11 8.01 10.5523 8.01 10C8.01 9.44772 7.56228 9 7.01 9H7ZM10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11H13C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9H10ZM7 13C6.44772 13 6 13.4477 6 14C6 14.5523 6.44772 15 7 15H7.01C7.56228 15 8.01 14.5523 8.01 14C8.01 13.4477 7.56228 13 7.01 13H7ZM10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15H13C13.5523 15 14 14.5523 14 14C14 13.4477 13.5523 13 13 13H10Z" fill="#FFFFFF"/>
							</svg>
						</span>
						<span class="label">Reportes</span>
					</router-link>
				</a-menu-item>
				<a-menu-item class="menu-item-header" v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2 "  >
					<span class="title-config">Opciones de Configuracion</span>
				</a-menu-item>			
				
				<a-menu-item v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2 || $store.state.user.role_id === 4 || $store.state.user.role_id === 6 ">
					<router-link to="/configuracion">
						<span class="icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" fill="#FFFFFF"/>
							</svg>
						</span>
						<span class="label">Personal</span>
					</router-link>
				</a-menu-item>
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
		data() {
			return {
				// sidebarCollapsedModel: this.sidebarCollapsed,
			}
		},
	})

</script>
<style>
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
