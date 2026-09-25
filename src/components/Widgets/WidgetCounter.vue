<template>

	<a-card :bordered="false" class="widget-1" v-if="render">
		<a-statistic
		
			:title="title"
			:value="metas"
			:precision="0"
			class="text-success"
			:class="'text-' + status"
		>
			
		</a-statistic>
		<div class="icon" v-html="icon"></div>
	</a-card>

</template>

<script>

	export default ({
		props: {
			title: {
				type: String,
				default: "",
			},
			valores: {
				type: String,
				default: 0,
			},
			prefix: {
				type: String,
				default: "",
			},
			suffix: {
				type: String,
				default: "",
			},
			icon: {
				type: String,
				default: "",
			},
			status: {
				type: String,
				default: "success",
			},
		},
		data() {
			return {
				render: false,
				metas: 0
			}
		},
		mounted() {
			this.setData()
		},
		methods:{
			setData(){
				this.render = true
				console.log(this.value)

			}
		}
		
	})

</script>