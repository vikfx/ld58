//classe planete
export class Planet {
	position				//position x/y dans le cosmos
	type					//le type de la planete
	collected				//si la planete est déjà collectionnée
	size					//la taille de la planete
	model					//le model visuel de la planete
	name

	//init
	constructor(pos, type, size, model) {
		this.position = pos
		this.type = type
		this.size = size
		this.model = model
		this.collected = false
		this.model = model
		this.name = this.randomName()
	}

	//nom aléatoire de la planète
	randomName() {
		const syllables = ['ar', 'zo', 'li', 'ta', 'ex', 'um', 'or', 'vi']
		const length = 2 + Math.floor(Math.random() * 2); // 2 ou 3 syllabes
		let name = ''
		for (let i = 0; i < length; i++) {
			name += syllables[Math.floor(Math.random() * syllables.length)]
		}

		const num = Math.ceil(Math.random() * 999)
		name += ' ' + num.toString().padStart(3, "0")
		
		return name
	}

}