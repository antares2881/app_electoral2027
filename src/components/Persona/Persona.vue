<template>
     <div>
        <div style="display: flex; gap: 8px; align-items: center;">
            <input type="number" id="cedula" class="form-control" v-model.number="cedula" @keypress.enter="buscarPersona" placeholder="No. de cedula" style="flex: 1;"> 
            <button @click="buscarPersona" class="btn btn-primary btn-search-mobile" title="Buscar persona">
                <b-icon icon="search"></b-icon>
            </button>
        </div>
        <b-spinner label="Spinning" v-if="spinner"></b-spinner>
        <span class="text-danger text-small" v-if="msnPersona">{{ msn }}</span>
    </div>
</template>
<script>
    import axios from 'axios'
    export default{
        components:{
        },
        data(){
            return{
                apiKey: 'S3CUR32025',
                cedula: null,
                hoy: null,
                msn: null,
                msnPersona: false,
                spinner: false
            }
        },
        mounted(){
            this.hoy = this.formatingDate(new Date());
        },
        methods:{
            //Metodo activado desde jurados
            activarBusqueda(){
                this.buscarPersona()
            },
            buscarCoordinador(){
                axios.get(`api/coordinadores-ingresados/${this.cedula}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        if(res.data.status === 'success'){
                            // console.log(typeof res.data.coordinador)
                            if(res.data.coordinador !== null){
                                const datos = {
                                    candidato: res.data.coordinador.candidato,
                                    coordinador: Object.assign({}, res.data.coordinador),
                                    coordinador_encontrado: true,
                                    lider_encontrado: false
                                }
                                
                                this.$store.commit('setPersona', datos)
                                this.$emit('setPersona')
                                this.spinner = false
                            }else{
                                this.buscarLideres()
                            }
                        }else{
                            Swal.fire({
                                icon: 'danger',
                                title: 'Error',
                                text: 'Cedula requerida'
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            buscarLideres(){
                axios.get(`api/lideres-ingresados/${this.cedula}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        if(res.data.status === 'success'){
                            // console.log(typeof res.data.coordinador)
                            if(res.data.lider !== null){
                                const datos = {
                                    candidato: res.data.lider.candidato,
                                    lider: Object.assign({}, res.data.lider),
                                    lider_encontrado: true
                                }
                                
                                this.$store.commit('setPersona', datos)
                                this.$emit('setPersona')
                                this.spinner = false
                            }else{
                                this.buscarPersona()
                            }
                        }else{
                            Swal.fire({
                                icon: 'danger',
                                title: 'Error',
                                text: 'Cedula requerida'
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            buscarPersona(){
                if(this.cedula === null || this.cedula === ''){
                    Swal.fire({
                        icon: 'warning',
                        title: 'Advertencia',
                        text: 'Debe ingresar un número de cédula'
                    })
                    return;
                } 
                this.spinner = true
                this.msnPersona = false
				axios.get(`https://apiserver.convexosit.co/personas?id=${encodeURIComponent(this.cedula)}`, {
					headers: {
						"Content-Type": "application/json",
                        "api_key": this.apiKey
					}
				})
				.then(res => {
                    const datos = {};
					// console.log(res.data)
					if(res.data.datosPersona.length > 0){
                        datos.cedula = res.data.datosPersona[0].cedula;
                        datos.nom1 = res.data.datosPersona[0].nom1;
                        datos.nom2 = res.data.datosPersona[0].nom2 === null ? '' : res.data.datosPersona[0].nom2;
                        datos.ape1 = res.data.datosPersona[0].ape1;
                        datos.ape2 = res.data.datosPersona[0].ape2 === null ? '' : res.data.datosPersona[0].ape2;
                        datos.fecha_nac = res.data.datosPersona[0].fecha_nac;
                        datos.edad = this.calcularEdad(datos.fecha_nac);
                        datos.estado = res.data.datosPersona[0].estado;
                        datos.desc_estado = res.data.datosPersona[0].desc_estado;                         
                        
					}else{

                        datos.cedula = this.cedula;
                        datos.nom1 = '';
                        datos.nom2 = '';
                        datos.ape1 = '';
                        datos.ape2 = '';
                        datos.fecha_nac = '';
                        datos.estado = '';
                        datos.desc_estado = '';
                        this.msnPersona = true;
						this.msn = 'Persona no encontrada';                      
                    }

                    if(res.data.lugar.length > 0){
                        datos.dpto = res.data.lugar[0].cod_dpto;
                        datos.desc_dpto = res.data.lugar[0].desc_dpto;
                        datos.mcpio = res.data.lugar[0].cod_mcpio;
                        datos.desc_mcpio = res.data.lugar[0].desc_mcpio;
                        datos.comuna = res.data.lugar[0].comuna;
                        datos.zona = res.data.lugar[0].zona;
                        datos.puesto = res.data.lugar[0].puesto;
                        datos.nombre_puesto = res.data.lugar[0].nombre_puesto;
                        datos.mesa = res.data.lugar[0].mesa;
                    }else{
                        datos.dpto = 0;
                        datos.desc_dpto = '';
                        datos.mcpio = 0;
                        datos.desc_mcpio = '';
                        datos.comuna = '';
                        datos.zona = '';
                        datos.puesto = '';
                        datos.nombre_puesto = '';
                        datos.mesa = '';
                        this.msnPersona = true
						this.msn = 'Persona no se encuentra en censo'
                    }
                    this.$store.commit('setPersona', datos)
                    this.$emit('setPersona');
                    this.spinner = false;
				})
				.catch(err => {
                    console.log(err)
					this.msnPersona = true
                    this.msn = err
                    this.spinner = false;
				})
			},
            buscarRegistros(){

                this.spinner = true

                if(this.$store.state.user.candidato[0].corporacione_id !== 5){
                    this.buscarLideres()
                }else{
                    this.buscarPersona()
                }
            },
            calcularEdad(fecha_nac){
				/* console.log(this.hoy);
				console.log(this.votante.fecha_nac); */
				var date_1 = new Date(fecha_nac);
				var date_2 = new Date(this.hoy);

				var day_as_milliseconds = 86400000;
				var diff_in_millisenconds = date_2 - date_1;
				var diff_in_days = diff_in_millisenconds / day_as_milliseconds;
				return parseInt(diff_in_days/365);

			},
            formatingDate(dateToFormat) {
                const d = new Date(dateToFormat);
                const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
                const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
                const year = d.getFullYear();
                return `${year}-${month}-${day}`;
            },
            formatFechaNac(fecha){
                const arrayFecha = fecha.split('/', 3);
                return arrayFecha[2]+'-'+arrayFecha[1]+'-'+arrayFecha[0];
            }
        }
    }
</script>
<style scoped>
.btn-search-mobile {
    display: none;
}

@media (max-width: 1199px) {
    .btn-search-mobile {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        height: 38px;
        padding: 0 12px;
    }
}
</style>