<template>
	<div>
		<a-modal 
			v-model="visible" 
			title="Agregar cita" 
			:bodyStyle="{paddingTop: '20px', paddingBottom: '8px'}"
			:width="600"
			:maskClosable="false"
			class="modal-agenda"
		>
			<a-form-item label="Fecha de la cita" :style="{marginBottom: '10px'}" class="form-item-custom">
				<a-date-picker 
					v-model="citaFechaMoment" 
					format="YYYY-MM-DD"
					placeholder="Seleccione fecha"
					style="width: 100%"
					size="large"
				/>
			</a-form-item>
			<a-form-item label="Lugar de la cita" :style="{marginBottom: '10px'}" class="form-item-custom">
				<a-input placeholder="Lugar" v-model="cita.lugar" size="large"/>
			</a-form-item>
			<a-form-item label="Con quien es la cita" :style="{marginBottom: '10px'}" class="form-item-custom">
				<a-input placeholder="Persona" v-model="cita.persona" size="large"/>
			</a-form-item>
			<a-form-item label="Observación de la cita" :style="{marginBottom: '10px'}" class="form-item-custom">
				<a-input 
					placeholder="Observacion" 
					v-model="cita.observacion" 
					type="textarea"
					:rows="3"
				/>
			</a-form-item>
			<a-alert type="error" v-if="messageError.length > 0" :style="{marginTop: '12px'}" showIcon>
				<template  #description>
					<p v-for="(text, index) in messageError.text" :key="index" style="margin: 4px 0;">{{text}}</p>					
				</template>
			</a-alert>
			<template #footer>
				<div class="modal-footer-custom">
					<a-button @click="visible=false" size="large">Cancelar</a-button>
					<a-button @click="actualizarCita" type="danger" size="large" v-if="cita.estado === 1">Actualizar</a-button>
					<a-button @click="grabarCita" type="primary" size="large" v-else>Guardar</a-button>
				</div>
			</template>
		</a-modal>
		<!-- Authors Table Card -->
		<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
			<template #title>
				<a-row type="flex">
					<a-col :span="24" :md="8">
						<div :style="{ width: '300px', border: '1px solid #d9d9d9', borderRadius: '4px' }">
							<a-calendar :fullscreen="false" :value="diaMoment" @select="onSelect" @panelChange="onPanelChange" />
						</div>
					</a-col>	
					<a-col :span="24" :md="16" style="padding-left: 20px;">
						<a-row type="flex" justify="space-between" align="middle" style="margin-bottom: 16px;">
							<a-col>
								<h4><strong>Compromisos: </strong>{{dia}}</h4>
							</a-col>
							<a-col>
								<button class="btn btn-success" @click="agregarNuevaCita">
									<b-icon icon="plus"></b-icon> Nueva Cita
								</button>
							</a-col>
						</a-row>
						<div class="tabla-agendas">
							<!-- Loader -->
							<div v-if="cargandoAgendas" class="loader-tabla">
								<a-spin size="large" tip="Cargando agendas...">
									<a-icon slot="indicator" type="loading" style="font-size: 36px" spin />
								</a-spin>
							</div>
							<!-- Tabla -->
							<table class="tabla-custom" v-else>
								<thead>
									<tr>
										<th>LUGAR</th>
										<th>PERSONA</th>
										<th>OBSERVACIÓN</th>
										<th>ACCIONES</th>
									</tr>
								</thead>
								<tbody>
									<tr v-if="data.length === 0">
										<td colspan="4" class="sin-datos">No hay agendas para esta fecha</td>
									</tr>
									<tr v-for="item in data" :key="item.id">
										<td>{{ item.lugar }}</td>
										<td>{{ item.persona }}</td>
										<td>{{ item.observacion }}</td>
										<td class="acciones-cell">
											<a-icon type="edit" theme="outlined" class="iconos editar" @click="editar(item)" title="Editar"/>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</a-col>
				</a-row>
			</template>
		</a-card>
	</div>
	<!-- / Authors Table Card -->

</template>

<script>
	import axios from 'axios';
	import moment, { Moment } from 'moment';
	export default {
		data() {
			return {
				cita: {lugar: null, persona: null, id: null},
				columns: [
					{
						title: 'Lugar',
						dataIndex: 'lugar',
						key: 'lugar',
						width: 150
					},
					{
						title: 'Persona',
						dataIndex: 'persona',
						key: 'persona',
						width: 250
					},
					{
						title: 'Observación',
						dataIndex: 'observacion',
						key: 'observacion'
					},
					{
						title: 'Acciones',
						key: 'acciones',
						scopedSlots: { customRender: 'acciones' },
						width: 100,
						align: 'center',
						fixed: 'right'
					}
				],
				data: [],			
				dia: null,
				diaMoment: null,
				citaFechaMoment: null,
				fecha: null,
				messageError: {length: 0, text: []},
				turnos: [],
				vacios: false,
				visible: false,
				cargandoAgendas: false
			}
		},
		mounted() {
			const fechaActual = moment(new Date()).format('YYYY-MM-DD');
			this.dia = fechaActual;
			this.diaMoment = moment(new Date());
			this.fecha = fechaActual;
			this.obtenerAgendasPorFecha(fechaActual);
		},
		methods: {	
			actualizarCita(){
				this.messageError = {
					length: 0,
					text: []
				}
				if(this.cita.lugar === null){
					this.messageError.length++
					this.messageError.text.push('El lugar es requerido')
					return
				}
				if(this.cita.persona === null){
					this.messageError.length++
					this.messageError.text.push(' La persona es requerida')
					return
				}
				// Sincronizar fecha desde el date picker
				if(this.citaFechaMoment){
					this.cita.fecha = moment(this.citaFechaMoment).format('YYYY-MM-DD');
				}
				axios.put(`/api/agendas/${this.cita.id}`, this.cita, 
					{
						headers: {
							"Authorization": `Bearer ${this.$store.state.user.token}`
						}
					})
					.then(res => {
						if(res.data.code === 200){
							this.visible = false;
							this.obtenerAgendasPorFecha(this.fecha);
						}else{
							this.messageError = {
								length: 1,
								text: res.data
							}
						}
					})
					.catch(err => {
						console.log(err)
					})
			},
			editar(data){
				console.log('Editando registro:', data);
				this.messageError = {
					length: 0,
					text: []
				}
				this.cita = {
					id: data.id,
					lugar: data.lugar,
					persona: data.persona,
					observacion: data.observacion,
					fecha: data.fecha,
					estado: 1
				}
				this.citaFechaMoment = moment(data.fecha);
				this.visible = true
			},
			agregarNuevaCita(){
				this.cita = {
					lugar: null, 
					persona: null, 
					observacion: null,
					id: null,
					fecha: this.fecha,
					estado: 0
				}
				this.citaFechaMoment = moment(this.fecha);
				this.messageError = {
					length: 0,
					text: []
				}
				this.visible = true
			},
			formatingDate(dateToFormat){
				const d = new Date(dateToFormat);
				const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
				const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
				const year = d.getFullYear();
				this.fecha = `${year}-${month}-${day}`
			},
		obtenerAgendasPorFecha(fecha){
			console.log('Consultando agendas para la fecha:', fecha);
			this.cargandoAgendas = true;
			axios.get(`/api/agendas/${fecha}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				.then(res => {
					console.log('Respuesta completa de agendas:', res.data);
					// La API devuelve un array directamente
					if(Array.isArray(res.data.agendas)){
						this.data = res.data.agendas;
						console.log('Agendas cargadas:', this.data.length);
					} else {
						this.data = [];
						console.warn('La respuesta no es un array');
					}
				})
				.catch(err => {
					console.error('Error al obtener agendas:', err);
					this.data = [];
				})
				.finally(() => {
					this.cargandoAgendas = false;
				});
			},  
			grabarCita(){
				this.messageError = {
					length: 0,
					text: []
				}
				if(this.cita.lugar === null){
					this.messageError.length++
					this.messageError.text.push('El lugar es requerido')
					return
				}
				if(this.cita.persona === null){
					this.messageError.length++
					this.messageError.text.push(' La persona es requerida')
					return
				}
				// Sincronizar fecha desde el date picker
				if(this.citaFechaMoment){
					this.cita.fecha = moment(this.citaFechaMoment).format('YYYY-MM-DD');
				}
				axios.post(`/api/agendas`, this.cita, 
					{
						headers: {
							"Authorization": `Bearer ${this.$store.state.user.token}`
						}
					})
					.then(res => {
						if(res.data.code === 200){
							this.visible = false;
							this.obtenerAgendasPorFecha(this.fecha);
						}else{
							this.messageError = {
								length: 1,
								text: res.data
							}
						}
					})
					.catch(err => {
						console.log(err)
					})
			},
			onSelect(e){
				const fecha = moment(e).format('YYYY-MM-DD');		
				this.dia = fecha;
				this.diaMoment = moment(e);
				this.fecha = fecha;
				this.obtenerAgendasPorFecha(fecha);
			},
			onPanelChange(e){
				const fecha = moment(e).format('YYYY-MM-DD');		
				this.dia = fecha;
				this.diaMoment = moment(e);
				this.fecha = fecha;
				this.obtenerAgendasPorFecha(fecha);
			},
		},
		computed: {
		},
	}
</script>
<style scoped>
	.editar{
		color: orange;
		cursor: pointer;
		font-size: 18px;
		transition: all 0.3s;
	}
	
	.editar:hover {
		color: #ff8c00;
		transform: scale(1.2);
	}
	
	.guardar{
		color: green;
	}
	
	.iconos{
		font-size: 16pt;
		margin-right: 5px;
	}
	
	/* Tabla personalizada */
	.tabla-agendas {
		width: 100%;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		min-height: 200px;
	}
	
	/* Loader */
	.loader-tabla {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 200px;
		padding: 40px;
	}
	
	.loader-tabla :deep(.ant-spin-text) {
		color: #0C9E4D;
		font-weight: 500;
		margin-top: 12px;
	}
	
	.loader-tabla :deep(.anticon-loading) {
		color: #0C9E4D;
	}
	
	.tabla-custom {
		width: 100%;
		table-layout: fixed;
		border-collapse: collapse;
		font-size: 14px;
	}
	
	.tabla-custom thead {
		background: linear-gradient(135deg, #0C9E4D 0%, #4EB037 100%);
		color: white;
	}
	
	.tabla-custom thead th {
		padding: 12px 8px;
		text-align: left;
		font-weight: 600;
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.3px;
		border: none;
		white-space: nowrap;
	}
	
	.tabla-custom thead th:nth-child(1) {
		width: 12%;
	}
	
	.tabla-custom thead th:nth-child(2) {
		width: 25%;
	}
	
	.tabla-custom thead th:nth-child(3) {
		width: 53%;
	}
	
	.tabla-custom thead th:last-child {
		text-align: center;
		width: 10%;
	}
	
	.tabla-custom tbody tr {
		border-bottom: 1px solid #e8e8e8;
		transition: background-color 0.3s;
	}
	
	.tabla-custom tbody tr:hover {
		background-color: #f5f7fa;
	}
	
	.tabla-custom tbody td {
		padding: 14px 12px;
		vertical-align: top;
		color: #333;
		line-height: 1.6;
		word-wrap: break-word;
		word-break: break-word;
		white-space: normal;
		overflow-wrap: break-word;
	}
	
	.tabla-custom tbody td:first-child {
		font-weight: 500;
		color: #0C9E4D;
	}
	
	.acciones-cell {
		text-align: center;
		vertical-align: middle !important;
	}
	
	.sin-datos {
		text-align: center;
		padding: 40px !important;
		color: #999;
		font-style: italic;
	}
	
	/* Responsive */
	@media (max-width: 768px) {
		.tabla-custom {
			font-size: 12px;
		}
		
		.tabla-custom thead th,
		.tabla-custom tbody td {
			padding: 10px 8px;
		}
	}
	
	/* Estilos para el modal */
	:deep(.modal-agenda .ant-modal-header) {
		background: linear-gradient(135deg, #0C9E4D 0%, #4EB037 100%);
		border-bottom: none;
		padding: 16px 24px;
	}
	
	:deep(.modal-agenda .ant-modal-title) {
		color: white;
		font-size: 18px;
		font-weight: 700;
	}
	
	:deep(.modal-agenda .ant-modal-close-x) {
		color: white;
		font-size: 18px;
		line-height: 48px;
		opacity: 0.9;
		transition: opacity 0.3s;
	}
	
	:deep(.modal-agenda .ant-modal-close-x:hover) {
		opacity: 1;
	}
	
	:deep(.modal-agenda .ant-modal-body) {
		background: #fafafa;
		padding: 16px 24px;
	}
	
	:deep(.modal-agenda .ant-modal-footer) {
		border-top: 1px solid #e8e8e8;
		padding: 12px 24px;
		background: white;
	}
	
	.form-item-custom :deep(.ant-form-item-label > label) {
		font-weight: 700;
		color: #333;
		font-size: 14px;
	}
	
	.form-item-custom :deep(.ant-input),
	.form-item-custom :deep(.ant-picker) {
		border-radius: 6px;
		border: 1px solid #d9d9d9;
		transition: all 0.3s;
	}
	
	.form-item-custom :deep(.ant-input:focus),
	.form-item-custom :deep(.ant-picker-focused) {
		border-color: #0C9E4D;
		box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
	}
	
	.form-item-custom :deep(textarea.ant-input) {
		resize: none;
	}
	
	.modal-footer-custom {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
	}
	
	.modal-footer-custom .ant-btn {
		border-radius: 6px;
		font-weight: 500;
		min-width: 100px;
	}
	
	.modal-footer-custom .ant-btn-primary {
		background: #0C9E4D;
		border-color: #0C9E4D;
	}
	
	.modal-footer-custom .ant-btn-primary:hover {
		background: #4EB037;
		border-color: #4EB037;
	}
	
	.modal-footer-custom .ant-btn-danger:hover {
		background: #0C9E4D;
		border-color: #0C9E4D;
	}
</style>