import { Telescop } from "./telescop.js"

//la popup de la photo de la planete
export class Popup {
	static instance
	planet			//la planete affichée
	
	//init
	constructor() {
		if(Popup.instance) return Popup.instance
		Popup.instance = this	
		
		this.planet = null
		this.addListeners()
	}

	//peupler la popup
	populate(planet) {
		const $img = Popup.$containers.img
		const $input = Popup.$containers.input

		const src = (planet && planet.model) ? planet.model : ''
		const val = (planet && planet.name) ? planet.name : ''
		$img.setAttribute('src', src)
		$input.value = val

		this.planet = planet
	}

	//ajouter les ecouteurs
	addListeners() {
		const $containers = Popup.$containers
		
		$containers.buttons.forEach($btn => {
			$btn.addEventListener('click', evt => {
				evt.preventDefault()
				const album = Telescop.instance.album
				if(!album) return

				switch($btn.dataset.action) {
					case 'ok' : 
						if(!this.planet) break 
						if(album.findEmptySticker(this.planet.type)) {
							this.planet.name = $containers.input.value
							album.collect(this.planet)
							this.close()
						}
						break

					case 'cancel' :
						this.close()
				}
			})
		})
	}

	//ouvrir la popup
	open() {
		Popup.$containers.form.classList.add('on')
	}

	//fermer la popup
	close() {
		Popup.$containers.form.classList.remove('on')
		this.populate(null)
	}

	//containers html
	static get $containers() {
		const $form = document.querySelector('#picture')
		if(!$form) throw new Error('#picture not found')
			
		const $input = $form.querySelector('input[name=planet-name]')
		if(!$input) throw new Error('#input not found in #picture')
		
		const $img = $form.querySelector('img')
		if(!$img) throw new Error('img not found in #picture')
		
		const $btns = $form.querySelectorAll('button')

		return {
			form : $form,
			input : $input,
			img : $img,
			buttons : $btns
		}
	}
}
