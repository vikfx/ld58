import { Cosmos } from './cosmos.js'
import { Telescop } from './telescop.js'
const sfc = {}
window.sfc = sfc

//init
document.addEventListener('DOMContentLoaded', (evt) => {
	console.log('hello main')

	initTabs()
	initCanvas()
	loadJson()
})

//gerer les onglets
function initTabs() {
	const $btns = document.querySelectorAll('#tabs-nav a')
	$btns.forEach(($btn, i) => {
		$btn.addEventListener('click', (evt) => {
			evt.preventDefault()
			const url = new URL($btn.href)
			const id = url.hash.replace('#', '')

			console.log('open tab ' + id)
			$btns.forEach($b => {
				if($b == $btn)
					$b.classList.add('on')
				else
					$b.classList.remove('on')
			})

			document.querySelectorAll('#tabs .tab').forEach($tab => {
				if($tab.id == id + '-tab')
					$tab.classList.add('on')
				else
					$tab.classList.remove('on')
			})
		})

		if(i == 0) {
			$btn.click()
		}
	})
}

//init le resize des canvas
function initCanvas() {
	resizeCanvas()
	window.addEventListener("resize", resizeCanvas)
	
	function resizeCanvas() {
		console.log('resize')
		const $cosmos = Cosmos.$containers.canvas
		
		//pour forcer le retrecissement du parent
		$cosmos.width = 0
		$cosmos.height = 0
	
		const $parent = $cosmos.parentElement
		$cosmos.width = $parent.clientWidth
		$cosmos.height = $parent.clientHeight

		//recentrer le telescope
		const $telescop = Telescop.$containers.canvas
		$telescop.width = Telescop.canvasSize
		$telescop.height = Telescop.canvasSize
		const x = ($cosmos.width - $telescop.width) / 2
		const y = ($cosmos.height - $telescop.height) / 2
		$telescop.style.left = x + 'px'
		$telescop.style.top = y + 'px'
	}
}

//loader le json
function loadJson() {
	fetch('./config/levels.json')
	.then(res => res.json())
	.then(output => {
		console.log(output)
		sfc.json = output
		
		//contruction des instances
		sfc.cosmos = new Cosmos(output.planets)
		sfc.telescop = new Telescop(output.filters)

		//load du level
		loadLevel(0)
	})
}

//charger un level
function loadLevel(i) {
	const lvls = sfc.json.levels
	if(i < 0 || i >= lvls.length) throw new Error('impossible de trouver le level ' + i)
	sfc.cosmos.loadLevel(lvls[i])
}