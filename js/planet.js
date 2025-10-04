//classe planete
export class Planet {
	position				//position x/y dans le cosmos
	type					//le type de la planete
	collected				//si la planete est déjà collectionnée
	size					//la taille de la planete
	model					//le model visuel de la planete

	//init
	constructor(pos, type, size, model) {
		this.position = pos
		this.type = type
		this.size = size
		this.model = model
		this.collected = false
	}
}