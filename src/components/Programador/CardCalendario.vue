<template>
	<a-card :bordered="false" class="header-solid h-full calendario-card" :bodyStyle="{padding: '24px',}">
		<template #title>
			<h5 class="titulo-principal">Calendario Electoral</h5>
		</template>
		<a-row type="flex" :gutter="[24, 24]">
			<a-col :span="24" :md="6">
				<div class="filtros-container">
					<h6 class="filtros-titulo">Seleccionar periodo</h6>
					<div class="select-wrapper">
						<label class="select-label">Año</label>
						<a-select 
							v-model="anio" 
							placeholder="Seleccione año" 
							size="large"
							class="select-custom"
							@change="onChangeFilters"
						>
							<a-select-option :value="2025">2025</a-select-option>
							<a-select-option :value="2026">2026</a-select-option>
							<a-select-option :value="2027">2027</a-select-option>
						</a-select>
					</div>
					<div class="select-wrapper">
						<label class="select-label">Mes</label>
						<a-select 
							v-model="mes" 
							placeholder="Seleccione mes"
							size="large" 
							class="select-custom"
							@change="onChangeFilters"
						>
							<a-select-option value="01">Enero</a-select-option>
							<a-select-option value="02">Febrero</a-select-option>
							<a-select-option value="03">Marzo</a-select-option>
							<a-select-option value="04">Abril</a-select-option>
							<a-select-option value="05">Mayo</a-select-option>
							<a-select-option value="06">Junio</a-select-option>
							<a-select-option value="07">Julio</a-select-option>
							<a-select-option value="08">Agosto</a-select-option>
							<a-select-option value="09">Septiembre</a-select-option>
							<a-select-option value="10">Octubre</a-select-option>
							<a-select-option value="11">Noviembre</a-select-option>
							<a-select-option value="12">Diciembre</a-select-option>
						</a-select>
					</div>
				</div>
			</a-col>	
			<a-col :span="24" :md="18">
				<div class="eventos-container">
					<div class="eventos-header">
						<h6 class="eventos-titulo">
							<span class="titulo-icono">📆</span>
							Eventos de {{nombreMes(mes)}} {{anio}}
						</h6>
						<div class="leyenda-container">
							<div 
								:class="['leyenda-item', { 'leyenda-active': filtroEstado === 'pasado' }]"
								@click="toggleFiltroEstado('pasado')"
							>
								<span class="leyenda-dot evento-pasado"></span>
								<span class="leyenda-text">Finalizado</span>
							</div>
							<div 
								:class="['leyenda-item', { 'leyenda-active': filtroEstado === 'hoy' }]"
								@click="toggleFiltroEstado('hoy')"
							>
								<span class="leyenda-dot evento-hoy"></span>
								<span class="leyenda-text">Hoy</span>
							</div>
							<div 
								:class="['leyenda-item', { 'leyenda-active': filtroEstado === 'proximo' }]"
								@click="toggleFiltroEstado('proximo')"
							>
								<span class="leyenda-dot evento-proximo"></span>
								<span class="leyenda-text">Próximo</span>
							</div>
						</div>
					</div>
					
					<a-timeline class="timeline-custom" v-if="eventosFiltrados.length > 0">
						<a-timeline-item 
							v-for="(calendar, index) in eventosFiltrados" 
							:key="index"
							:color="getEventColor(calendar.fecha)"
						>	
							<template #dot>
								<span :class="['timeline-dot', getEventClass(calendar.fecha)]"></span>
							</template>
							<div :class="['evento-card', getEventClass(calendar.fecha)]">
								<div class="evento-header-card">
									<h6 class="evento-titulo">{{calendar.evento}}</h6>
									<span :class="['estado-badge', getEventClass(calendar.fecha)]">
										{{getEstadoEvento(calendar.fecha)}}
									</span>
								</div>
								<p class="evento-detalle">{{calendar.observacion}}</p>	
								<div class="evento-footer">
									<span class="fecha-texto">
										<span class="fecha-icon">📅</span> 
										{{formatearFecha(calendar.fecha)}}
									</span>
								</div>
							</div>
						</a-timeline-item>
					</a-timeline>
					<div v-else class="sin-eventos">
						<a-alert type="info" show-icon message="Sin eventos">
							<template #description>
								<span v-if="filtroEstado">
									No hay eventos {{ filtroEstado === 'pasado' ? 'finalizados' : filtroEstado === 'hoy' ? 'para hoy' : 'próximos' }} en {{nombreMes(mes)}} de {{anio}}
								</span>
								<span v-else>
									No hay eventos programados para {{nombreMes(mes)}} de {{anio}}
								</span>
							</template>
						</a-alert>
					</div>
				</div>
			</a-col>			
		</a-row>
	</a-card>
</template>

<script>
	import moment from 'moment';
	import axios from 'axios'
	export default {
		data() {
			return {				
				anio: 2025,
				calendars: [],
				mes: '12',
				filtroEstado: null // null = todos, 'pasado', 'hoy', 'proximo'
			}
		},
		computed: {
			eventosFiltrados() {
				if (!this.filtroEstado) {
					return this.calendars;
				}

				return this.calendars.filter(calendar => {
					const estado = this.getEventClass(calendar.fecha);
					return estado === `evento-${this.filtroEstado}`;
				});
			}
		},
		mounted() {
			const fechaActual = new Date()
			this.anio = fechaActual.getFullYear()
			this.mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0')
			this.getCalendars(this.anio, this.mes)
		},
		methods: {			
			async getCalendars(anio, mes){
				try {
					const response = await axios.get(`/api/calendarios/${anio}/${mes}`, {
						headers: {
							"Authorization": `Bearer ${this.$store.state.user.token}`,
							"Accept": "application/json; charset=utf-8",
							"Content-Type": "application/json; charset=utf-8"
						}
					})
					this.calendars = response.data.calendarios
					console.log('Calendarios cargados:', this.calendars)
				} catch (error) {
					console.error('Error al cargar calendarios:', error)
					this.calendars = []
				}
			},
			nombreMes(mes){
				const meses = {
					'01': 'Enero',
					'02': 'Febrero',
					'03': 'Marzo',
					'04': 'Abril',
					'05': 'Mayo',
					'06': 'Junio',
					'07': 'Julio',
					'08': 'Agosto',
					'09': 'Septiembre',
					'10': 'Octubre',
					'11': 'Noviembre',
					'12': 'Diciembre'
				}
				return meses[mes] || 'Mes'
			},
			formatearFecha(fecha) {
				return moment(fecha).format('DD/MM/YYYY')
			},
			getEventColor(fechaEvento) {
				const hoy = moment().startOf('day')
				const evento = moment(fechaEvento).startOf('day')
				const diffDias = evento.diff(hoy, 'days')

				if (diffDias < 0) {
					return '#9E9E9E' // Gris - Pasado
				} else if (diffDias === 0) {
					return '#4CAF50' // Verde - Hoy
				} else {
					return '#2196F3' // Azul - Próximo
				}
			},
			getEventClass(fechaEvento) {
				const hoy = moment().startOf('day')
				const evento = moment(fechaEvento).startOf('day')
				const diffDias = evento.diff(hoy, 'days')

				if (diffDias < 0) {
					return 'evento-pasado'
				} else if (diffDias === 0) {
					return 'evento-hoy'
				} else {
					return 'evento-proximo'
				}
			},
			getEstadoEvento(fechaEvento) {
				const hoy = moment().startOf('day')
				const evento = moment(fechaEvento).startOf('day')
				const diffDias = evento.diff(hoy, 'days')

				if (diffDias < 0) {
					return 'Finalizado'
				} else if (diffDias === 0) {
					return 'HOY'
				} else {
					return 'Próximo'
				}
			},
			onChangeFilters() {
				if (this.anio && this.mes) {
					this.getCalendars(this.anio, this.mes)
				}
			},
			toggleFiltroEstado(estado) {
				// Si el filtro ya está activo, lo desactivamos (mostrar todos)
				// Si es diferente, activamos el nuevo filtro
				if (this.filtroEstado === estado) {
					this.filtroEstado = null;
				} else {
					this.filtroEstado = estado;
				}
			}
		},
	}
</script>
<style scoped>
	/* Card principal */
	.calendario-card {
		background: #ffffff;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
	}

	.titulo-principal {
		margin: 0;
		font-size: 20px;
		font-weight: 700;
		color: #1a1a1a;
		border-bottom: 2px solid #e8e8e8;
		padding-bottom: 12px;
	}

	/* Contenedor de filtros */
	.filtros-container {
		background: linear-gradient(135deg, #4EB037 0%, #0C9E4D 100%);
		border-radius: 12px;
		padding: 24px;
		box-shadow: 0 4px 16px rgba(78, 176, 55, 0.3);
	}

	.filtros-titulo {
		margin: 0 0 20px 0;
		font-size: 16px;
		font-weight: 600;
		color: #ffffff;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.select-wrapper {
		margin-bottom: 16px;
	}

	.select-wrapper:last-child {
		margin-bottom: 0;
	}

	.select-label {
		display: block;
		margin-bottom: 8px;
		font-size: 13px;
		font-weight: 500;
		color: #ffffff;
		opacity: 0.9;
	}

	.select-custom {
		width: 100%;
		border-radius: 8px;
	}

	.select-custom :deep(.ant-select-selector) {
		border-radius: 8px !important;
		border: 2px solid rgba(255, 255, 255, 0.3) !important;
		background: rgba(255, 255, 255, 0.95) !important;
		font-weight: 500;
		transition: all 0.3s ease;
	}

	.select-custom :deep(.ant-select-selector:hover) {
		border-color: #ffffff !important;
		background: #ffffff !important;
	}

	/* Contenedor de eventos */
	.eventos-container {
		background: #fafbfc;
		border-radius: 12px;
		padding: 20px;
		min-height: 500px;
	}

	.eventos-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		padding-bottom: 16px;
		border-bottom: 2px solid #e8e8e8;
	}

	.eventos-titulo {
		margin: 0;
		font-size: 18px;
		font-weight: 700;
		color: #2c3e50;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.titulo-icono {
		font-size: 22px;
	}

	/* Leyenda */
	.leyenda-container {
		display: flex;
		gap: 16px;
		align-items: center;
	}

	.leyenda-item {
		display: flex;
		align-items: center;
		gap: 6px;
		cursor: pointer;
		padding: 6px 12px;
		border-radius: 20px;
		transition: all 0.3s ease;
		user-select: none;
	}

	.leyenda-item:hover {
		background: rgba(0, 0, 0, 0.05);
		transform: scale(1.05);
	}

	.leyenda-item.leyenda-active {
		background: rgba(78, 176, 55, 0.15);
		box-shadow: 0 2px 8px rgba(78, 176, 55, 0.2);
		font-weight: 600;
	}

	.leyenda-item.leyenda-active .leyenda-text {
		color: #0C9E4D;
		font-weight: 600;
	}

	.leyenda-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2px solid;
	}

	.leyenda-dot.evento-pasado {
		background: #9E9E9E;
		border-color: #757575;
	}

	.leyenda-dot.evento-hoy {
		background: #4CAF50;
		border-color: #2E7D32;
		animation: pulse-leyenda 2s infinite;
	}

	.leyenda-dot.evento-proximo {
		background: #2196F3;
		border-color: #1565C0;
	}

	@keyframes pulse-leyenda {
		0%, 100% {
			box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
		}
		50% {
			box-shadow: 0 0 0 4px rgba(76, 175, 80, 0);
		}
	}

	.leyenda-text {
		font-size: 12px;
		font-weight: 500;
		color: #5a6c7d;
	}

	/* Timeline personalizado */
	.timeline-custom {
		margin-top: 0;
		padding: 20px 0;
		max-height: 550px;
		overflow-y: auto;
		padding-right: 8px;
	}

	.timeline-custom :deep(.ant-timeline-item) {
		padding-bottom: 24px;
	}

	.timeline-custom :deep(.ant-timeline-item-content) {
		margin-left: 28px;
		min-height: auto;
	}

	/* Scrollbar personalizado */
	.timeline-custom::-webkit-scrollbar {
		width: 6px;
	}

	.timeline-custom::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 10px;
	}

	.timeline-custom::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 10px;
	}

	.timeline-custom::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}

	/* Timeline dots personalizados */
	.timeline-dot {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		display: inline-block;
		border: 3px solid;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	.timeline-dot.evento-pasado {
		background: #9E9E9E;
		border-color: #757575;
	}

	.timeline-dot.evento-hoy {
		background: #4CAF50;
		border-color: #2E7D32;
		animation: pulse-green 2s infinite;
	}

	.timeline-dot.evento-proximo {
		background: #2196F3;
		border-color: #1565C0;
	}

	@keyframes pulse-green {
		0%, 100% {
			box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
		}
		50% {
			box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
		}
	}

	/* Tarjetas de eventos */
	.evento-card {
		padding: 20px;
		border-radius: 10px;
		background: #ffffff;
		border-left: 5px solid;
		margin-bottom: 12px;
		transition: all 0.3s ease;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
	}

	.evento-card:hover {
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
		transform: translateX(4px);
	}

	/* Estados de eventos */
	.evento-card.evento-pasado {
		border-left-color: #9E9E9E;
		background: #f9f9f9;
	}

	.evento-card.evento-hoy {
		border-left-color: #4CAF50;
		background: linear-gradient(to right, #f1f8f4 0%, #ffffff 100%);
		box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
	}

	.evento-card.evento-proximo {
		border-left-color: #2196F3;
		background: linear-gradient(to right, #f3f8ff 0%, #ffffff 100%);
	}

	/* Header de la tarjeta */
	.evento-header-card {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 12px;
		margin-bottom: 12px;
	}

	.evento-titulo {
		margin: 0;
		font-size: 16px;
		font-weight: 700;
		color: #2c3e50;
		line-height: 1.4;
		flex: 1;
	}

	/* Badge de estado */
	.estado-badge {
		display: inline-block;
		padding: 4px 12px;
		border-radius: 16px;
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.estado-badge.evento-pasado {
		background: #E0E0E0;
		color: #616161;
	}

	.estado-badge.evento-hoy {
		background: #4CAF50;
		color: white;
		animation: pulse-badge 2s infinite;
		box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
	}

	.estado-badge.evento-proximo {
		background: #2196F3;
		color: white;
		box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
	}

	@keyframes pulse-badge {
		0%, 100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.85;
			transform: scale(1.02);
		}
	}

	/* Detalle del evento */
	.evento-detalle {
		margin: 0 0 12px 0;
		color: #5a6c7d;
		font-size: 14px;
		line-height: 1.6;
		border-left: 3px solid #e8e8e8;
		padding-left: 12px;
	}

	/* Footer del evento */
	.evento-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 12px;
		border-top: 1px solid #f0f0f0;
	}

	.fecha-texto {
		display: flex;
		align-items: center;
		gap: 6px;
		color: #7f8c8d;
		font-size: 13px;
		font-weight: 500;
		white-space: nowrap;
		flex-wrap: nowrap;
	}

	.fecha-icon {
		font-size: 16px;
	}

	/* Sin eventos */
	.sin-eventos {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 300px;
		padding: 40px;
	}

	.sin-eventos :deep(.ant-alert) {
		max-width: 500px;
		border-radius: 8px;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.filtros-container {
			margin-bottom: 24px;
		}
		
		.eventos-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 16px;
		}

		.leyenda-container {
			width: 100%;
			justify-content: space-between;
		}

		.leyenda-text {
			font-size: 11px;
		}

		.timeline-custom {
			max-height: 450px;
		}

		.evento-header-card {
			flex-direction: column;
			gap: 8px;
		}

		.estado-badge {
			align-self: flex-start;
		}
	}

	@media (max-width: 480px) {
		.titulo-principal {
			font-size: 18px;
		}

		.eventos-titulo {
			font-size: 16px;
		}

		.evento-card {
			padding: 16px;
		}

		.evento-titulo {
			font-size: 15px;
		}

		.leyenda-container {
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;
		}
	}
</style>