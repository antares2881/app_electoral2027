<template>
    <b-modal ref="profesiones" size="xs" hide-footer title="Nueva profesion">
        <div class="row">
            
            <div class="col-md-12 mb-2">
                <label for="profesion">Profesion</label>
                <input type="text" id="profesion" class="form-control" v-model="profesion.profesion">
            </div>
            <div class="col-md-12" v-if="errors">
                <p class="alert alert-danger">{{ errores }}</p>
            </div>
            <div class="col-md-12 mt-3">
                <button class="btn btn-success mr-2" @click="create">Guardar</button>
            </div>
        </div>
    </b-modal>
</template>
<script>
    
    import axios from 'axios';
    export default{
        data(){
            return{
                errors: '',
                profesion: {}
            }
        },
        mounted(){
            
        },
        methods:{
            cancelar(){
                this.$refs['profesiones'].hide()
            },
            create(){
                this.errors = false
                
                axios.post(`api/profesiones`, this.profesion,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        // console.log(res.data)
                        if(res.data.status === 'success'){
                            this.$emit('profesion_id', res.data.profesion)
                            this.$refs['profesiones'].hide()
                        }else{
                            this.errores = res.data
                            this.errors = true
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            
            newProfesion(){
                this.$refs['profesiones'].show()
            },   
        },    
    }
</script>