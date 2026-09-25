<template>
	<div class="sign-in">
		<div class="login-container">
			<div class="col-form">
				<!-- Logo -->
				<div class="logo-container">
					<img src="images/logo-ct-black.png" alt="Logo" class="logo-img">
				</div>

				<h2 class="mb-15">PLATAFORMA ELECTORAL</h2>
				<h5 class="font-regular text-muted">Digita tu usuario y clave para ingresar.</h5>

				<!-- Sign In Form -->
				<a-form
					id="components-form-demo-normal-login"
					:form="form"
					class="login-form"
					@submit="handleSubmit"
					:hideRequiredMark="true"
				>
					<a-form-item class="mb-10" label="Usuario" :colon="false">
						<a-input 
						v-decorator="[
						'username',
						{ rules: [{ required: true, message: 'Digita un usuario!' }] },
						]" placeholder="Usuario" />
					</a-form-item>
					<a-form-item class="mb-5" label="Clave" :colon="false">
						<a-input
						v-decorator="[
						'password',
						{ rules: [{ required: true, message: 'Digita tu password!' }] },
						]" type="password" placeholder="Clave" />
					</a-form-item>
					
					<a-form-item>
						<a-button type="primary" block html-type="submit" class="login-form-button" :loading="loading">
							<span v-if="!loading">ENTRAR</span>
							<span v-else>VALIDANDO...</span>
						</a-button>
					</a-form-item>
				</a-form>

				<!-- Error Alert -->
				<a-alert :message="authError" v-if="authError" type="error" show-icon class="error-alert" />
			</div>
		</div>
	</div>
</template>

<script>
	
	import {login} from '../helpers/auth';
	export default ({
		data() {
			return {
			}
		},
		beforeCreate() {
			// Creates the form and adds to it component's "form" property.
			this.form = this.$form.createForm(this, { name: 'normal_login' });
		},
		created() {
		},
		methods: {
			estadisticas(){
				this.$router.push('/estadisticas2023')
			},
			// Handles input validation after submission.
			handleSubmit(e) {
				e.preventDefault();
				this.$store.commit('authError')
				this.form.validateFields((err, values) => {
					// console.log(values)
					// return
					if ( !err ) {
						this.$store.dispatch("login")		
						login(values)
							.then((res) => {
								// console.log(res)
								if(res.code === 400){
									const err = 'credenciales incorrectas'
									this.$store.commit('loginFail', {err})
									this.danger = true
								}else{
									this.$store.commit('loginSuccess', res)/* 
									this.$store.dispatch('getUrlApi', this.$store.state.user.token);
									this.$store.dispatch("getTokenApi", values) */

									this.redirect(res)
									
								}
							})
							.catch((err) => {
								this.$store.commit('loginFail', {err})
							})				
					}					
				});
			},
			redirect(res){
				// console.log(res)
				switch (res.user.role_id) {
					case 1: 
						this.$router.push('/dashboard');
						break;
					case 2: 
						this.$router.push('/dashboard');
						break;
					case 3:
						this.$router.push('/consultar');
						break;
					case 4: 
						this.$router.push('/dashboard');
						break;
					case 8: 
						this.$router.push('/estadisticas2019');
						break;
					case 10 : 
						this.$router.push('/asistencia');
						break;
					case 11 : 
						this.$router.push('/asistencia');
						break;
					default:
						this.$router.push('/militantes');
						break;
				}
			}
		},
		computed: {
			authError(){
				return this.$store.getters.auth_error;
			},
			loading(){
				return this.$store.getters.isLoading
			}
		}
	})

</script>

<style lang="scss" scoped>

.sign-in {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 !important;
	margin: 0 !important;
	background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.login-container {
	width: 100%;
	max-width: 480px;
	margin: 0 auto;
}

.col-form {
	background: #ffffff;
	padding: 45px 40px;
	border-radius: 20px;
	box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
	width: 100%;

	.logo-container {
		text-align: center;
		margin-bottom: 25px;
	}

	.logo-img {
		max-width: 120px;
		height: auto;
		display: inline-block;
	}

	h2 {
		font-size: 26px;
		font-weight: 700;
		color: #2c3e50;
		margin-bottom: 10px;
		text-align: center;
		letter-spacing: -0.5px;
	}

	h5 {
		text-align: center;
		margin-bottom: 30px;
		font-size: 14px;
		color: #7f8c8d;
	}
}

.login-form {
	margin-top: 20px;

	.ant-form-item-label {
		label {
			font-weight: 600;
			color: #333;
		}
	}

	.ant-input {
		padding: 12px 15px;
		border-radius: 8px;
		border: 1px solid #e0e0e0;
		transition: all 0.3s ease;

		&:focus {
			border-color: #667eea;
			box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
		}
	}
}

.login-form-button {
	height: 50px;
	border-radius: 10px;
	font-size: 15px;
	font-weight: 600;
	margin-top: 10px;
	background: linear-gradient(135deg, #4EB037 0%, #0C9E4D 100%);
	border: none;
	transition: all 0.3s ease;
	letter-spacing: 0.5px;

	&:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(44, 62, 80, 0.4);
		background: linear-gradient(135deg, #0C9E4D 0%, #0C9E4D 100%);
	}

	&:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
}

.error-alert {
	border-radius: 10px;
	margin-top: 20px;
	animation: slideDown 0.3s ease;
}

@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* Responsive Design */
@media (max-width: 768px) {
	.sign-in {
		padding: 15px;
	}

	.login-container {
		max-width: 100%;
	}

	.col-form {
		padding: 35px 25px;

		.logo-img {
			max-width: 100px;
		}

		h2 {
			font-size: 22px;
		}

		h5 {
			font-size: 13px;
		}
	}

	.login-form-button {
		height: 44px;
		font-size: 15px;
	}

	.ant-col img {
		margin-top: 30px;
		max-width: 80%;
	}
}

@media (max-width: 480px) {
	.sign-in {
		padding: 10px;
	}

	.col-form {
		padding: 30px 20px;

		.logo-img {
			max-width: 90px;
		}

		h2 {
			font-size: 20px;
			margin-bottom: 8px;
		}

		h5 {
			font-size: 12px;
			margin-bottom: 20px;
		}
	}

	.login-form {
		.ant-input {
			padding: 10px 12px;
			font-size: 14px;
		}
	}

	.login-form-button {
		height: 42px;
		font-size: 14px;
	}

	.ant-form-item-label label {
		font-size: 13px;
	}
}
</style>

<style lang="scss">
	body {
		padding: 0 !important;
		background-color: #2c3e50 !important;
	}
	
	.layout-default .ant-layout-content {
		padding: 0 !important;
	}
</style>