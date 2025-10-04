import { Cosmos } from "./cosmos.js"
const sfc = {}
window.sfc = sfc

//init
document.addEventListener('DOMContentLoaded', (evt) => {
	console.log('hello main')

	initCanvas()
	loadJson()
})

function initCanvas() {
	resizeCanvas()
	window.addEventListener("resize", resizeCanvas)
	
	function resizeCanvas() {
		console.log('resize')
		const $canvases = document.querySelectorAll('#cosmos')
		$canvases.forEach($canvas => {
			//pour forcer le retrecissement du parent
			$canvas.width = 0
			$canvas.height = 0
	
			const $parent = $canvas.parentElement
			$canvas.width = $parent.clientWidth
			$canvas.height = $parent.clientHeight
	
			const detail = { width : $canvas.width, height: $canvas.height }
			//$canvas.dispatchEvent(new CustomEvent('canvasResized', { detail: detail }))
		})
		
	}
}

//loader le json
function loadJson() {
	fetch('./config/levels.json')
	.then(res => res.json())
	.then(output => {
		console.log(output)
		sfc.json = output
		sfc.cosmos = new Cosmos(output.planets)
		loadLevel(0)
	})
}

//charger un level
function loadLevel(i) {
	const lvls = sfc.json.levels
	if(i < 0 || i >= lvls.length) throw new Error('impossible de trouver le level ' + i)
	sfc.cosmos.loadLevel(lvls[i])
}