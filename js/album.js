export class Album {
	collected
	album				//tableau des planetes à collectionner

	//init
	constructor(album) {
		this.album = album
		this.collected = []
		this.createCatalogHTML()
	}

	//creation du html
	createCatalogHTML() {
		const $ul = Album.$containers.catalog
		//supprimer les enfants
		while($ul.firstChild) {
			$ul.firstChild.remove()
		}

		this.album.forEach(p => {
			const $li = document.createElement('li')
			$li.classList.add('box')
			$li.dataset.type = p
			$li.dataset.planet = ''
			$li.addEventListener('click', evt => {
				console.log('todo show planet')
			})
			
			const $img = document.createElement('img')
			const $h = document.createElement('h4')
			$h.innerHTML = '...'

			$li.appendChild($img)
			$li.appendChild($h)
			$ul.appendChild($li)
		});
	}

	//update le html d'un sticker
	updateHTML($el, planet) {
		if(!$el) return
		$el.dataset.planet = planet
		$el.querySelector('img').setAttribute('src', planet.model)
		$el.querySelector('h4').innerHTML = planet.name
	}	

	//collecter une planete
	collect(planet) {
		if(!planet) return
		
		const $sticker = this.findEmptySticker(planet.type)
		if(!$sticker) {
			alert('no empty sticker found')
			return
		}
		planet.collected = true
		this.updateHTML($sticker, planet)
	}

	//trouver un emplacement libre dans l'album
	findEmptySticker(type) {
		return [...Album.$containers.planets].find($p => $p.dataset.type == type && $p.dataset.planet == '')
	}

	//containers html
	static get $containers() {
		const $catalog = document.querySelector('#album-tab .catalog')
		if(!$catalog) throw new Error('#album-tab .catalog not found')
		
		const $planets = $catalog.querySelectorAll(':scope > li')
		
		return {
			catalog : $catalog,
			planets : $planets,
		}
	}
}