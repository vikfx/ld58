import { Cosmos } from './cosmos.js'
import { Filter } from './filter.js'

//telescope avec filtre et zoom 
export class Telescop {
	static instance				//singleton
	static canvasSize = 200		//taille du canvas
	zoom						//le zoom en cours
	zooms = [1, 2, 5, 10]		//les zooms possibles
	planetColor = '#333'		//la couleur de la planete sans filtre
	filters						//les filtres possibles
	filter						//le filtre en cours
	cosmos						//l'instance du cosmos

	//init
	constructor(filters) {
		if(Telescop.instance)	return Telescop.instance
		Telescop.instance = this

		this.cosmos = Cosmos.instance
		if(!cosmos) throw new Error('cosmos must be create before telescop')

		this.initFilters(filters)
		this.addListeners()

		this.reset()
	}

	//reset du telescope
	reset() {
		this.filter = null
		this.setZoom(this.zooms[0])
	}

	//ajouter les ecouteurs
	addListeners() {
		//deplacement du cosmos
		document.addEventListener('cosmosTranslate', evt => {
			this.posToHTML()
			this.draw()
		})

		//bouton zoom
		Telescop.$containers.zoom.addEventListener('click', evt => {
			let zi = this.zooms.indexOf(this.zoom)

			zi++
			if(zi >= this.zooms.length) zi = 0
			this.setZoom(this.zooms[zi])
		})
	}

	//definir un zoom
	setZoom(z) {
		this.zoom = z

		Telescop.$containers.zoom.innerHTML = 'zoom x' + this.zoom
		this.draw()
	}
	
	//afficher les coordonnées dans la barre d'action
	posToHTML() {
		const angle = (p, size) =>  Math.floor(p * 360 / size).toString().padStart(3, '0')
		let str = 'x ' + angle(this.center.x, this.cosmos.size.w)
		str += '   y ' + angle(this.center.y, this.cosmos.size.h)
		Telescop.$containers.pos.innerHTML = str
	}

	//creer les filtres
	initFilters(filters) {
		this.filters = []
		filters.forEach(f => {
			this.filters.push(new Filter(f.name, f.button, f.params))
		})
	}

	//convertir les coordonnees pixel du canvas en position dans le telescope 
	pixelToGrid(x, y) {
		return {
			x : Math.floor(x / this.zoom) + this.offset.x, 
			y : Math.floor(y / this.zoom) + this.offset.y
		}
	}

	//convertir la position x/y du telescope en coordonnées dans le canvas
	gridToPixel(x, y) {
		return {
			x : (x - this.offset.x) * this.zoom,
			y : (y - this.offset.y) * this.zoom
		}
	}

	//cloisoner une position dans l'espace [0, size]
	clampPos(x, y) {
		const mod = (n, m) => ((n % m) + m) % m
		return {
			x: mod(x, this.cosmos.size.w),
			y: mod(y, this.cosmos.size.h)
		}
	}

	//centre de la camera telescope
	get center() {
		const b = this.cosmos.bounds
		
		return {
			x : (b.left + b.width / 2) % this.cosmos.size.w,
			y : (b.top + b.height / 2) % this.cosmos.size.h
		}
	}

	//taille de la vision du telescope
	get size() {
		return Math.floor(Telescop.canvasSize / this.zoom)
	}

	//offset de la camera telescope
	get offset() {
		const x = Math.floor(this.center.x - this.size / 2)
		const y = Math.floor(this.center.y - this.size / 2)
		return this.clampPos(x, y)
	}

	//calcul du bounds du telescope
	get bounds() {
		const s = this.size
		const o = this.offset
		const rb = this.clampPos(o.x + s, o.y + s)

		return {
			left : o.x,
			right : rb.x,
			top : o.y,
			bottom : rb.y,
			width : this.size,
			height : this.size
		}
	}

	//dessiner dans le telescope
	draw() {
		const $canvas = Telescop.$containers.canvas
		const ctx = $canvas.getContext('2d')
	
		//clear
		ctx.clearRect(0, 0, $canvas.width, $canvas.height)
	
		//dessiner les planetes
		if(!this.cosmos.planets || !this.bounds) return
		const planets = Cosmos.getPlanetsInBounds(this.cosmos.planets, this.bounds)
		planets.forEach(p => {
			const s = p.size * this.zoom
			
			const pos = this.gridToPixel(p.position.x, p.position.y)
			
			if(pos.x > $canvas.width) pos.x -= this.cosmos.size.w * this.zoom
			if(pos.x < 0) pos.x += this.cosmos.size.w * this.zoom
			if(pos.y > $canvas.height) pos.y -= this.cosmos.size.h * this.zoom
			if(pos.y < 0) pos.y += this.cosmos.size.h * this.zoom
			
			ctx.fillStyle = (this.filter) ? this.filter.getFilterColor(p.type) : this.planetColor
			ctx.fillRect(pos.x - s / 2, pos.y - s / 2, s, s)
		})
	}

	//containers html
	static get $containers() {
		const $canvas = document.querySelector('#telescop canvas')
		if(!$canvas) throw new Error('#telescop canvas not found')
		
		const $zoom = document.querySelector('#zoom')
		if(!$zoom) throw new Error('#zoom button not found')
		
		const $pics = document.querySelector('#pics')
		if(!$pics) throw new Error('#pics button not found')
		
		const $form = document.querySelector('#picture')
		if(!$form) throw new Error('#picture modal not found')
		
		const $pos = document.querySelector('#position')
		if(!$pos) throw new Error('#position  not found')

		return {
			canvas : $canvas,
			zoom : $zoom,
			pics : $pics,
			modal : $form,
			pos : $pos
		}
	}
}