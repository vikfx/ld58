import { Glossary } from './glossary.js'
import { Telescop } from './telescop.js'

//les filtres avec le bouton et la legende
export class Filter {
	name			//nom du filtre
	src				//source de l'image
	params			//parametres du filtre
	cosmos			//reference du cosmos
	$btn			//le bouton html

	//init
	constructor(name, src, params) {
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
		const $lib = document.createElement('li')
		$lib.classList.add('box')

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

		$lib.appendChild($h)
		$lib.appendChild($ul)
		Filter.$containers.catalog.appendChild($lib)
	}

	//renvoyer la couleur de la planete avec le filtre actif
	getFilterColor(type) {
		const ref = Glossary.instance.getReference(type)
		const val = ref.attributes[this.name]

		return this.params[val]
	}

	//activer le filtre
	setActive() {
		const $lis = Filter.$containers.btns.lis
		$lis.forEach($l => {
			if($l == this.$btn) {
				$l.classList.add('on')
				const telescop = Telescop.instance
				telescop.filter = this
				telescop.draw()
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

		const $catalog = document.querySelector('#legend-tab .catalog')
		if(!$catalog) throw new Error('#legend-tab .catalog not found')

		return {
			btns : {
				ul : $btnsContainer,
				lis : $btns
			},
			catalog : $catalog
		}
	}

}