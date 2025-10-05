import { Glossary } from './glossary.js'
import { Planet } from './planet.js'

//classe Cosmos pour abriter les planetes
export class Cosmos {
	static instance				//singleton
	zoom = 1					//le zoom en cours
	sizes = [1, 5]				//les limites de taille de chaque planete à zoom 1
	planetColor = '#ffffff'		//la couleur de la planete sans filtre
	speeds = [10, 5, 2, 1]		//vitesses de deplacements
	speed = 5					//la vitesse de deplacement
	offset						//offset de la camera
	size						//les dimensions w/h du monde
	planets						//les planetes du cosmos

	//init
	constructor(references) {
		if(Cosmos.instance)	return Cosmos.instance
		Cosmos.instance = this

		//this.references = references
		if(!Glossary.instance) new Glossary(references)
		this.addListeners()
	}

	//ajouter les ecouteurs
	addListeners() {
		//deplacement avec les fleches
		window.addEventListener('keydown', evt => {
			let dirX = 0
			let dirY = 0
			switch(evt.key) {
				//touche gauche
				case 'ArrowLeft' :
					dirX ++
					break

				//touche droite
				case 'ArrowRight' :
					dirX --
					break

				//touche haut
				case 'ArrowUp' :
					dirY --
					break

				//touche droite
				case 'ArrowDown' :
					dirY ++
					break
			}

			this.translate(dirX, dirY)
			this.draw()
		})

		//definir la vitesse de deplacement
		Cosmos.$containers.speed.addEventListener('click', evt => {
			let si = this.speeds.indexOf(this.speed)

			si++
			if(si >= this.speeds.length) si = 0
			this.setSpeed(this.speeds[si])
		})
	}

	//reset un level
	loadLevel(level) {
		this.size = {
			w : Number(level.cosmos.width),
			h : Number(level.cosmos.height)
		}

		this.offset = this.clampPos(0, 0)
		this.setSpeed(this.speeds[0])

		this.planetsGeneration(level.planets)

		this.draw()
	}

	//definir la vitesse de balayage
	setSpeed(s) {
		this.speed = s
		Cosmos.$containers.speed.innerHTML = 'x' + this.speed
	}

	//generer des planetes
	planetsGeneration(planets) {
		this.planets = []

		this.planets.push(new Planet({x : 50, y : 50}, 'M', 50, ''))
		for(let p in planets) {
			const ref = Glossary.instance.getReference(p)
			for(let i = 0; i < planets[p]; i++) {
				const size = this.sizes[0] + Math.random() * (this.sizes[1] - this.sizes[0])
				const pos = {
					x : Math.random() * this.size.w,
					y : Math.random() * this.size.h
				}
				const model = ref.models[Math.floor(Math.random() * ref.models.length)]
				this.planets.push(new Planet(pos, ref.type, size, model))
			}
		}
	}

	//translation du cosmos dans les direction x/y
	translate(dirX, dirY) {
		const x = this.offset.x + dirX * this.speed
		const y = this.offset.y + dirY * this.speed
		this.offset = this.clampPos(x, y)

		const detail = { offset : this.offset }
		document.dispatchEvent(new CustomEvent('cosmosTranslate', { detail: detail }))
	}

	//cloisoner une position dans l'espace [0, size]
	clampPos(x, y) {
		const mod = (n, m) => ((n % m) + m) % m
		return {
			x: mod(x, this.size.w),
			y: mod(y, this.size.h)
		}
	}

	//convertir des coordonnées x/y dans le canvas en position dans le cosmos
	pixelToGrid(x, y) {
		return {
			x : Math.floor(x / this.zoom) + this.offset.x,
			y : Math.floor(y / this.zoom) + this.offset.y
		}
	}

	//convertir la position x/y du cosmos en coordonnées dans le canvas
	gridToPixel(x, y) {
		return {
			x : (x - this.offset.x) * this.zoom,
			y : (y - this.offset.y) * this.zoom
		}
	}

	//recuperer le bounds du cosmos
	get bounds() {
		const $canvas = Cosmos.$containers.canvas
		let br = this.pixelToGrid($canvas.offsetWidth, $canvas.offsetHeight)
		br = this.clampPos(br.x, br.y)

		return {
			left: this.offset.x,
			right : br.x,
			top : this.offset.y,
			bottom : br.y,
			width : (br.x > this.offset.x) ? br.x - this.offset.x : this.size.w - Math.abs(br.x - this.offset.x),
			height : (br.y > this.offset.y) ? br.y - this.offset.y : this.size.h - Math.abs(br.y - this.offset.y)
		}
	}

	//recuperer le planetes dans un bounds
	static getPlanetsInBounds(planets, bounds) {
		return planets.filter(p => {
			const inX = bounds.left <= bounds.right
			? p.position.x >= bounds.left && p.position.x <= bounds.right
			: p.position.x >= bounds.left || p.position.x <= bounds.right

			const inY = bounds.top <= bounds.bottom
			? p.position.y >= bounds.top && p.position.y <= bounds.bottom
			: p.position.y >= bounds.top || p.position.y <= bounds.bottom

			return inX && inY
		})
	}

	//dessinerle canvas cosmos
	draw() {
		const $canvas = Cosmos.$containers.canvas
		const ctx = $canvas.getContext('2d')

		//clear
		ctx.clearRect(0, 0, $canvas.width, $canvas.height)

		//dessiner les planetes
		if(!this.planets || !this.bounds) return
		const planets = Cosmos.getPlanetsInBounds(this.planets, this.bounds)
		planets.forEach(p => {
			const s = p.size * this.zoom

			const pos = this.gridToPixel(p.position.x, p.position.y)

			if(pos.x > $canvas.width) pos.x -= this.size.w * this.zoom
			if(pos.x < 0) pos.x += this.size.w * this.zoom
			if(pos.y > $canvas.height) pos.y -= this.size.h * this.zoom
			if(pos.y < 0) pos.y += this.size.h * this.zoom

			ctx.fillStyle = this.planetColor
			ctx.fillRect(pos.x - s / 2, pos.y - s / 2, s, s)
		})
	}

	//containers html
	static get $containers() {
		const $canvas = document.querySelector('#cosmos')
		if(!$canvas) throw new Error('#cosmos canvas not found')

		const $speed = document.querySelector('#speed')
		if(!$speed) throw new Error('#speed button not found')

		return {
			canvas : $canvas,
			speed : $speed
		}
	}

}

