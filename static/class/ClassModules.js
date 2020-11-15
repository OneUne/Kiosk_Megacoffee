/* JH 
 * Ŭ���̾�Ʈ ������ require�� ����ؼ� Ŭ������ �ҷ��� �� ��� �ӽ÷� Ŭ�������� �����ؼ� �ٿ��־����ϴ�
 * �ϴ� �� js������ html(pug)�� ���Խ��Ѽ� Ŭ������ ����ϰ� ���߿� ���ȭ�ҰԿ�
 * */

class Menu {
	constructor(cat = "", name = "", price = 0, image = "/static/picture/default.png") {
		this.cat = cat
		this.name = name
		this.price = price
		this.image = image
	}

	getValue() {
		return {
			'cat': this.cat
			, 'name': this.name
			, 'price': this.price
			, 'image': this.image
		}
	}
}

class ShoppingCart {
	//����īƮ�� ���Ǵ� Ŭ�����̴�. ���õ� �޴��� �����Ͽ� �ֹ� ������ ��ü�� ����� ��ȯ�Ѵ�. 
	//�� ��ü�� DB�� ��������� �ʰ� �� Ŭ������ �����ϴ� �ֹ� ���� ��ü�� DB�� ����ȴ�. 

	constructor(storeNum, orderNum) {
		this.storeNum = storeNum
		this.orderNum = orderNum

		this.menus = []
		this.price = 0
		this.quantity = 0
	}

	//����īƮ �ʱ�ȭ
	initiate() {
		this.menus = []
		this.price = 0
		this.quantity = 0
	}

	//�޴� �߰�/����
	insertOrder(menu) {
		this.menus.push(menu)
		this.price += menu.getValue()['price']
		this.quantity += 1
	}
	deleteOrder(idx) {
		const target = this.menus[idx].getValue()
		this.menus.splice(idx, 1)
		this.price -= target['price']
		this.quantity -= 1
	}

	constructOrderList() {
		const ret = new orderList(this.storeNum, this.orderNum, this.menus, this.price, this.quantity)

		this.orderNum++
		if (this.orderNum / 100 == 0) orderNum -= 100 //ex) 600������ 699������ ��ȯ �� 700���� �θ� ���ʰ� �Ǹ� 100�� ���� 600������ ���ư�����
		initiate()

		return ret.getValue()
	}
}

class OrderList {
	constructor(storeNum, orderNum, menus, price, quantity) {
		this.storeNum = storeNum
		this.orderNum = orderNum
		this.menus = menus
		this.price = price
		this.quantity = quantity

		this.orderTime = new Time()
		this.id = this.orderTime.getTimeString() + String(this.storeNum)//�ð� 14�ڸ� + �����ȣ 4�ڸ�
	}

	setIdArb(input_id) {
		//���Ƿ�(arbitrary) id�� �ο��Ѵ�.
		//id�� 18�ڸ� ���ڿ��̸� ���ǿ� �������� ���� ��� 000000000000000000���� �Ѵ�
		if (input_id.length != 18) {
			console.error("Invalid ID. returning default ID: 000000000000000000")
			this.id = "000000000000000000"
		}
		this.storeNum = parseInt(input_id.slice(14))
		this.orderTime = new Time(input_id.slice(0, 14))
	}
	getValue() {
		return {
			"id": this.id
			, "orderTime": this.orderTime
			, "storeNum": this.storeNum
			, "orderNum": this.orderNum
			, "menus": this.menus
			, "price": this.price
			, "quantity": this.quantity
		}
	}
}

class Stamp {
	constructor(id, ph, stamp, date, exp_date) {
		this.id = id
		this.ph = ph
		this.stamp = stamp
		this.date = date
		this.exp_date = exp_date
	}
	getValue() {
		return {
			"id": this.id
			, "ph": this.ph
			, "stamp": this.stamp
			, "date": this.date
			, "exp_date": this.exp_date
		}
	}
}

class Store {
	constructor(id = 0, pw = 0, name = "", addr = "") {
		//���� id�� db���� ������ ������ id�� �޾ƿ� �װͿ� 1�� ���� ���� �� id�� �Ѵ�.
		this.id = id
		this.name = name
		this.addr = addr
	}

	getValue() {
		return {
			"id": this.id
			, "name": this.name
			, "addr": this.addr
		}
	}
}

class Time extends Date {
	/*�Ͽ����ú��ʸ� ������ �ð� Ŭ���� 
	*
    * 14�ڸ� ���ڿ�, Ȥ�� ��,��,��,��,��,�ʸ� �Ű������� �־ ������ �ð� ����
    * Ȥ�� �ƹ��͵� ���� �ʾƼ� ������ �ð� ����
    * 
    * ������ ��ü�� 14�ڸ� string���� ��ȯ�� �� ����
    */

	constructor(y, m, d, hr, min, sec) {
		if (typeof (y) === typeof ("")) {
			//ù��° �Ű������� Ÿ���� ""�̶� ����(string��) ��� 14�ڸ��� �Ͽ����ú��ʷ� parse�Ͽ� �ð� ����
			let time = y

			y = parseInt(time.slice(0, 4))
			m = parseInt(time.slice(4, 6)) - 1
			d = parseInt(time.slice(6, 8))
			hr = parseInt(time.slice(8, 10))
			min = parseInt(time.slice(10, 12))
			sec = parseInt(time.slice(12, 14))

			super(y, m, d, hr, min, sec)
		}
		else if (typeof (y) === typeof (1)) {
			//ù ��° �Ű������� Ÿ���� 1�̶� ���� ���(������ ���) �״�� �Է��ؼ� �ð� ����
			super(y, m - 1, d, hr, min, sec)
		}
		else {
			//�Ű������� ���� ��� ���� �ð� ����
			super()
		}
		this.year = (y === undefined ? this.getFullYear() : y)
		this.month = (m === undefined ? this.getMonth() + 1 : m)
		this.date = (d === undefined ? this.getDate() : d)
		this.hour = (hr === undefined ? this.getHours() : hr)
		this.minute = (min === undefined ? this.getMinutes() : min)
		this.second = (sec === undefined ? this.getSeconds() : sec)
	}

	getTimeString() {
		let time = "" + this.year
		if (this.month >= 10)
			time += "" + this.month
		else
			time += "0" + this.month
		if (this.date >= 10)
			time += "" + this.date
		else
			time += "0" + this.date
		if (this.hour >= 10)
			time += "" + this.hour
		else
			time += "0" + this.hour
		if (this.minute >= 10)
			time += "" + this.minute
		else
			time += "0" + this.minute
		if (this.second >= 10)
			time += "" + this.second
		else
			time += "0" + this.second

		return time
	}
}