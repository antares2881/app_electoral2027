<template>
    <b-modal ref="modal-historico" hide-footer :title="'PUESTO: '+titulo" size="xl">
        <div>
            <b-card-group deck>
                <b-card bg-variant="light" header="Votantes 2015" class="text-center">
                    <b-card-text><strong>Potencial: </strong>{{ historico.potencial2015 }}</b-card-text>
                    <b-card-text><strong>Participacion: </strong>{{ historico.anio2015 }} <strong>( % {{ porcentajes.porcentaje2015 }} )</strong></b-card-text>
                    <b-card-text><strong>Mayor votacion: </strong>{{ historico.mayor2015 }}</b-card-text>
                </b-card>
                <b-card bg-variant="light" header="Votantes 2019" class="text-center">
                    <b-card-text><strong>Potencial: </strong>{{ historico.potencial2019 }}</b-card-text>
                    <b-card-text><strong>Participacion: </strong>{{ historico.anio2019 }} <strong>( % {{ porcentajes.porcentaje2019 }} )</strong></b-card-text>
                    <b-card-text><strong>Mayor votacion: </strong>{{ historico.mayor2019 }}</b-card-text>
                </b-card>
                <b-card bg-variant="light" header="Elecciones 2023" class="text-center">
                    <b-card-text><strong>Potencial: </strong>{{ elecciones2023.potencial }}</b-card-text>
                    <b-card-text>
                        <strong>Participacion proyectada: </strong> 
                        <span class="text-success">
                            <strong>{{ porcentajes.proyeccion2023 }}</strong>
                        </span>                        
                    </b-card-text>
                    <b-card-text>
                        <strong>Votantes ingresados: </strong>{{ elecciones2023.votantes }}
                        <span class="text-success">
                            <strong>( {{ Math.round(porcentajes.proyeccion2023 * 0.51 )}} )</strong>
                        </span>
                    </b-card-text>
                </b-card>
            </b-card-group>
        </div>
        <button class="btn btn-dark my-3" @click="cerrarModal">Cerrar</button>
    </b-modal>
</template>
<script>

import axios from "axios";

export default {
    data() {
        return{
            elecciones2023: {potencial: null, votantes: null},
            historico: {},
            porcentajes: {porcentaje2015: 0, porcentaje2019: 0, proyeccion2023: 0},
            render: false,
            titulo: ''
        }
    },
    methods: {
        cerrarModal(){
            this.$refs['modal-historico'].hide()
        },
        getHistoricoVotacion(item){
            // console.log(item)
            this.elecciones2023 = {
                potencial: item.potencial,
                votantes: item.votantes
            }
            const divipol = {
                'dpto': item.departamento_id,
                'mcpio': item.municipio_id,
                'zona': item.zona,
                'puesto': item.puesto,
                'corporacion': this.$store.state.user.candidato[0].corporacione_id 
            }
            axios.post(`api/historico-municipios`, divipol, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    console.log(res.data)
                    if(res.data.status === 'success'){
                        this.historico = Object.assign({}, res.data.historico)                        
                        this.titulo = this.historico.nombre_puesto
                        this.porcentajeParticipacion()
                        this.$refs['modal-historico'].show()
                    }else{
                        console.log(res.data)
                    }

                })
                .catch(err => {
                    console.log(err)
                })
        },
        porcentajeParticipacion(){
            let porcentaje2015 = (this.historico.anio2015 * 100) / this.historico.potencial2015
            let porcentaje2019 = (this.historico.anio2019 * 100) / this.historico.potencial2019
            let porcentaje2023 = ( parseFloat(porcentaje2015.toFixed(2)) + parseFloat(porcentaje2019.toFixed(2)) ) / 2
            let proyeccion2023 = (porcentaje2023 / 100) * this.elecciones2023.potencial
            this.porcentajes = {
                porcentaje2015: porcentaje2015.toFixed(2),
                porcentaje2019: porcentaje2019.toFixed(2),
                porcentaje2023: porcentaje2023.toFixed(2),
                proyeccion2023: Math.round(proyeccion2023)
            }
            
        }
    }
}
</script>
<style scoped>
    div.card-header{
        font-weight: bold;
    }
</style>