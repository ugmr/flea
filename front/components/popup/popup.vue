<template>
	<view v-if="valueSync">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:"popup",
		props: {
			value: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				valueSync: false
			};
		},
		created() {
			this.valueSync = this.value
			console.log(this.valueSync)
		},
		mounted() {
			this.valueSync = this.value
		},
 		watch: {
			 "value": function (val) {
				console.log(val)
				this.valueSync = val
			}
		}
	}
</script>

<style>

</style>
