export function debounce(callback,time){
	let timer;
	return function(){
		const context = this
		clearTimeout(timer)
		timer = setTimeout(function(){
			callback.call(context)
		}, time)
	}
}
