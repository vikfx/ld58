import { Cosmos } from './cosmos.js'
import { Telescop } from './telescop.js'

//les filtres avec le bouton et la legende
export class Filter {
	name			//nom du filtre
	src				//source de l'image
	params			//parametres du filtre
	cosmos			//reference du cosmos
	telescop		//reference du telescope
	$btn			//le bouton html

	constructor(name, src, params) {
		this.cosmos = Cosmos.instance
		if(!cosmos) throw new Error('cosmos must be create before telescop')

		this.telescop = Telescop.instance
		if(!telescop) throw new Error('telescop must be create before filter')
		
		this.name = name
		this.src = src
		this.params = params

		this.createBtnHTML()
		this.createLegendHTML()
	}

	//creation html des boutons
	createBtnHTML() {
		const $li = document.createElement('li')
		$li.classList.add('button')
		$li.dataset.filter = this.name
		$li.innerHTML = this.name
		$li.style.backgroundImage = this.src
		$li.addEventListener('click', evt => {
			this.setActive()
		})

		this.$btn = $li
		Filter.$containers.btns.ul.appendChild($li)
	}

	//creation html de la legende
	createLegendHTML() {
		const $lif = document.createElement('li')
		$lif.classList.add('filter')

		const $h = document.createElement('h3')
		$h.innerHTML = this.name

		const $ul = document.createElement('ul')
		$ul.classList.add('attributes')

		Object.keys(this.params).forEach(p => {
			const $li = document.createElement('li')

			const $label = document.createElement('label')
			$label.innerHTML = p

			const $color = document.createElement('span')
			$color.classList.add('color')
			$color.style.backgroundColor = this.params[p]

			$li.appendChild($color)
			$li.appendChild($label)
			$ul.appendChild($li)
		})

		$lif.appendChild($h)
		$lif.appendChild($ul)
		Filter.$containers.legend.appendChild($lif)
	}

	//renvoyer la couleur de la planete avec le filtre actif
	getFilterColor(type) {
		const ref = this.cosmos.getReference(type)
		const val = ref.attributes[this.name]

		return this.params[val]
	}

	//activer le filtre
	setActive() {
		const $lis = Filter.$containers.btns.lis
		$lis.forEach($l => {
			if($l == this.$btn) {
				$l.classList.add('on')
				this.telescop.filter = this
				this.telescop.draw()
			} else {
				$l.classList.remove('on')
			}
		})
	}

	
	//containers html
	static get $containers() {
		const $btnsContainer = document.querySelector('#filters')
		if(!$btnsContainer) throw new Error('#filters ul not found')

		const $btns = $btnsContainer.querySelectorAll('li')

		const $legendContainer = document.querySelector('#legend-tab > ul')
		if(!$legendContainer) throw new Error('#legend > ul not found')

		return {
			btns : {
				ul : $btnsContainer,
				lis : $btns
			},
			legend : $legendContainer
		}
	}

}