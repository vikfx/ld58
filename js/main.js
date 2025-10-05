import { Cosmos } from './cosmos.js'
import { Telescop } from './telescop.js'
import { Album } from './album.js'
const sft = {}
window.sft = sft

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
	})
}

//init le resize des canvas
function initCanvas() {
	resizeCanvas()
	window.addEventListener("resize", resizeCanvas)
	
	function resizeCanvas() {
		console.log('resize canvas')
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
		sft.json = output
		
		//contruction des instances
		sft.cosmos = new Cosmos(output.planets)
		sft.telescop = new Telescop(output.filters)

		//init les levels
		initLevels()

		//load du level
		loadLevel(0)
	})
}

//init les boutons de chargement des levels
function initLevels() {
	const $ul = document.querySelector('#level-selector > ul')
	if(!$ul) return
	sft.json.levels.forEach((lvl, i) => {
		const $li = document.createElement('li')
		$li.classList.add('button')
		$li.dataset.level = i
		$li.innerHTML = lvl.name
		$li.addEventListener('click', evt => {
			const ok = confirm('would you load a new level ' + lvl.name + ' ?')
			if(ok) loadLevel(i)	
		})

		$ul.appendChild($li)
	})
}

//charger un level
function loadLevel(i) {
	const lvls = sft.json.levels
	if(i < 0 || i >= lvls.length) throw new Error('impossible de trouver le level ' + i)
	sft.cosmos.loadLevel(lvls[i])
	sft.telescop.album = new Album(lvls[i].album)
}