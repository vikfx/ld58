export class Glossary {
	static instance			//singleton
	references				//les references de chaque planete

	//init
	constructor(references) {
		if(Glossary.instance) return Glossary.instance
		Glossary.instance = this
		
		this.references = references
		this.createHTML()
	}

	//creation du html du catalogue
	createHTML() {
		this.references.forEach(r => {
			const $lib = document.createElement('li')
			$lib.classList.add('box')

			const $h = document.createElement('h3')
			$h.innerHTML = 'planet class ' + r.type
			
			const $ul = document.createElement('ul')
			$ul.classList.add('attributes')
			
			Object.keys(r.attributes).forEach(p => {
				const $li = document.createElement('li')
		
				const $label = document.createElement('label')
				$label.innerHTML = p + ' : ' + r.attributes[p]
		
				$li.appendChild($label)
				$ul.appendChild($li)
			})
		
			$lib.appendChild($h)
			$lib.appendChild($ul)
			Glossary.$containers.catalog.appendChild($lib)
		})
	}

	//renvoyer une reference de planete
	getReference(type) {
		const ref = this.references.find(ref => ref.type == type)
		if(!ref) throw new Error('no reference from this type')
		return ref
	}

	//containers html
	static get $containers() {
		const $catalog = document.querySelector('#glossary-tab .catalog')
		if(!$catalog) throw new Error('#glossary-tab .catalog not found')
		
		return {
			catalog : $catalog,
		}
	}
}