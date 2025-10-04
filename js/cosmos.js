import { Planet } from "./planet.js"

//classe Cosmos pour abriter les planetes
export class Cosmos {
	$canvas 				//le canvas pour dessiner le cosmos
	zoom					//le zoom en cours
	zooms = [1, 5, 10]		//les zooms possibles
	sizes = [1, 5]			//les limites de taille de chaque planete à zoom 1
	planetColor = '#ffffff'	//la couleur de la planete sans filtre
	offset					//offset de la camera
	size					//les dimensions w/h du monde 
	planets					//les planetes du cosmos
	references				//les references de chaque planete

	//init
	constructor(references) {
		this.references = references
		
	}

	addListeners() {
		if(!this.$canvas) return

	}
	
	//reset un level
	loadLevel(level) {
		this.size = {
			w : Number(level.cosmos.width),
			h : Number(level.cosmos.height)
		}

		this.zoom = this.zooms[0]
		this.offset = {x : 0, y : 0}
		
		this.planetsGeneration(level.planets)

		this.draw()
	}

	//renvoyer une reference de planete
	getReference(type) {
		const ref = this.references.find(ref => ref.type == type)
		if(!ref) throw new Error('no reference from this type')
		return ref
	}

	//generer des planetes
	planetsGeneration(planets) {
		this.planets = []

		for(let p in planets) {
			const ref = this.getReference(p)
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

	static getPlanetsInBounds(planets, bounds) {
		return planets.filter(p => {
			return (
				p.position.x >= bounds.left
				&& p.position.x <= bounds.right
				&& p.position.y >= bounds.top
				&& p.position.y <= bounds.bottom
			)
		})
	}

	get bounds() {
		return {
			left : this.offset.x,
			top : this.offset.y,
			right : this.size.w - this.offset.x,
			bottom : this.size.h - this.offset.y,
			width : this.size.w,
			height :this.size.h
		}
	}

	draw() {
		const $canvas = Cosmos.$containers.canvas
		if(!$canvas) return

		const ctx = $canvas.getContext('2d')

		//clear
		ctx.clearRect(0, 0, $canvas.width, $canvas.height)

		//dessiner les etoiles
		const planets = Cosmos.getPlanetsInBounds(this.planets, this.bounds)
		planets.forEach(p => {
			const s = p.size * this.zoom
			const pos = p.position

			ctx.fillStyle = this.planetColor
			ctx.fillRect(pos.x, pos.y, s, s)
		})
	}

	static $containers() {
		const $canvas = document.querySelector('#cosmos')
		if(!$canvas) throw new Error('cosmos canvas not found')

		return {
			canvas : $canvas
		}
	}

}

