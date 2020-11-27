//�Ĵ� ��ǰ�� Ŭ������ �����Ѵ�.

class Menu {
	constructor(cat = "", name = "", price = 0, image = "/static/picture/default.png", shot = false, cream = false, cinnamon = false) {
		this.cat = cat
		this.name = name
		this.price = price
		this.image = image
		this.shot = shot
		this.cream = cream
		this.cinnamon = cinnamon
	}

	getValue() {
		return {
			'cat': this.cat
			, 'name': this.name
			, 'price': this.price
			, 'image': this.image
			, 'shot' : this.shot
			, 'cream' : this.cream
			, 'cinnamon' : this.cinnamon
		}
	}
}

module.exports = Menu