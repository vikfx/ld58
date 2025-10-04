document.addEventListener('DOMContentLoaded', (evt) => {
	console.log('hello main')

	loadJson()
})


function loadJson() {
	fetch('./config/levels.json')
	.then(res => res.json())
	.then(output => {
		console.log(output)
	})
}