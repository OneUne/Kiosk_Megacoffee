const Menu = require("./static/class/Menu")
const OrderList = require("./static/class/ShoppingCart")
const Time = require("./static/class/Time")
const Category = require("./static/class/Category")
const mysql = require("mysql")

const ServerLog = require("./static/class/ServerLog")
const Log = new ServerLog

const DB = mysql.createConnection({
	host: 'localhost'
	, port: 3306
	, user: 'root'
	, password: '1234'
	, database: 'megacoffeedb'
})

class DB_adapter {
	//����� ����, DB���� ��û�� ����� object�� �����ؼ� ��ȯ
	constructor() {
		DB.connect((err) => {
			if (err) throw err
			Log.tell(`DATABASE CONNECTED`)
		})
	}

	getCategoryCore() {
		return new Promise((resolve, reject) => {
			DB.query(`select * from category `, (err, result) => {
				return (err) ? reject(err) : resolve(result)
			})
		})
	}

	async getCategory() {
		let ret = []
		let catListRaw = []

		await this.getCategoryCore().then((result) => { catListRaw = result })
		for (const i of catListRaw) {
			ret.push(new Category(
				i.Cat
			))
		}
		//console.log(ret);
		return ret
	}

	addCategoryCore(cat) {
		return new Promise(async (resolve, reject) => {
			DB.query(`insert into category values('${cat}')`, (err, result) => {
				return (err) ? reject(err) : resolve(result)
			})
		})
	}

	deleteCategoryCore(cat) {
		return new Promise(async (resolve, reject) => {
			DB.query(`delete from category where(Cat = '${cat}')`, (err, result) => {
				return (err) ? reject(err) : resolve(result)
			})
		})
	}

	deleteMenuCore(name) {
		return new Promise(async (resolve, reject) => {
			DB.query(`delete from menu where(name = '${name}')`, (err, result) => {
				return (err) ? reject(err) : resolve(result)
			})
		})
	}

	findMenuCore(name) {
		return new Promise((resolve, reject) => {
			DB.query(`select * from menu where name='${name}'`, (err, result) => {
				return (err) ? reject(err) : resolve(result)
			})
		})
	}

	async findMenu(name) {
		//DB���� �����͸� result�� ���� ���� �� �����ͷ� �޴� ��ü�� ���� ���� �װ��� ��ȯ�Ѵ�. 
		let ret = []
		let menuListRaw = []

		await this.findMenuCore(name).then((result) => { menuListRaw = result }) //DB���� ��� ���� �Ѿ�� ������ ��ٷ��� �����Ѵ�.
		for (const i of menuListRaw) {
			ret.push(new Menu(
				i.Cat
				, i.Name
				, i.Price
				, 0
				, (i.Image) ? i.Image : undefined
				, (i.S || i.SW || i.SS) ? true : false
				, (i.W || i.SW) ? true : false
				, (i.SS) ? true : false
				, (i.Ice) ? true : false
				, (i.Soldout) ? true : false
			))//DB���� ���޹��� raw �����Ϳ��� ī�װ�, �̸�, ����, �̹���(null -> default), ��, ũ��, �ó���, ���̽�, ǰ��
		}
		return ret
	}

	setMenucore(findmenu, menumanage) {
		return new Promise((resolve, reject) => {
			let query_string = ""
			var cat = menumanage['cat']
			var name = menumanage['name']
			if (menumanage['topping'] === 'onlyshot') {
				var S = 1
				var W = null
				var SW = null
				var SS = null
			} else if (menumanage['topping'] === 'onlyCream') {
				var S = null
				var W = 1
				var SW = null
				var SS = null
			} else if (menumanage['topping'] === 'shotCream') {
				var S = null
				var W = null
				var SW = 1
				var SS = null
			} else if (menumanage['topping'] === 'shotCinnamon') {
				var S = null
				var W = null
				var SW = null
				var SS = 1
			} else {
				var S = null
				var W = null
				var SW = null
				var SS = null
			}

			var price = menumanage['price']
			if (price[1] == ',') {
				price = price.replace(',', '')
			}
			price = Number(price)

			if (menumanage['ice'] === undefined) {
				var ice = null
			} else {
				var ice = 1
			}
			if (menumanage['soldout'] === undefined) {
				var soldout = null
			} else {
				var soldout = 1
			}
			// image�� ����
			if (findmenu.length === 1) {
				query_string = `update menu set cat = '${cat}', name = '${name}', price = ${price}, ice = ${ice}, S = ${S}, W = ${W}, SW = ${SW}, SS = ${SS}, soldout = ${soldout} where name = '${findmenu[0]['name']}'`
			}
			else if (findmenu.length === 0) {
				query_string = `insert into menu values('${cat}', '${name}', ${price}, ${ice}, ${S}, ${W}, ${SW}, ${SS}, null, ${soldout})`
			}
			else {
				alert('�ش� �޴� �Է¿� �����Ͽ����ϴ�.')
			}
			DB.query(query_string), (err, result) => {
				return (err) ? reject(err) : resolve(result)
			}
		})
	}

	getMenuCore() {
		return new Promise((resolve, reject) => {
			DB.query(`select * from menu order by cat asc`, (err, result) => {
				return (err) ? reject(err) : resolve(result)
			})
		})
	}
	async getMenu() {
		//DB���� �����͸� result�� ���� ���� �� �����ͷ� �޴� ��ü�� ���� ���� �װ��� ��ȯ�Ѵ�. 
		let ret = []
		let menuListRaw = []

		await this.getMenuCore().then((result) => { menuListRaw = result }) //DB���� ��� ���� �Ѿ�� ������ ��ٷ��� �����Ѵ�.
		for (const i of menuListRaw) {
			ret.push(new Menu(
				i.Cat
				, i.Name
				, i.Price
				, 0
				, (i.Image) ? i.Image : undefined
				, (i.S || i.SW || i.SS) ? true : false
				, (i.W || i.SW) ? true : false
				, (i.SS) ? true : false
				, (i.Ice) ? true : false
				, (i.Soldout) ? true : false
			))//DB���� ���޹��� raw �����Ϳ��� ī�װ�, �̸�, ����, �̹���(null -> default), ��, ũ��, �ó���, ���̽�, ǰ��
		}
		return ret
	}

	getOrderListCore(key = "", val = "") {
		if (key != "") {
			return new Promise((resolve, reject) => {
				if (key == "time") {
					DB.query(`select * from orderlist where time between '${val}'and '${val}' + interval 1 day `, (err, result) => {
						return (err) ? reject(err) : resolve(result)
					})
				}
				else if (key == "id") {
					DB.query(`select * from orderlist where ${key} like ${val}`, (err, result) => {
						return (err) ? reject(err) : resolve(result)
					})
				}
				else {
					DB.query(`select * from orderlist`, (err, result) => {
						return (err) ? reject(err) : resolve(result)
					})
				}
			})
		}
		else {
			return new Promise((resolve, reject) => {
				DB.query(`select * from orderlist`, (err, result) => {
					return (err) ? reject(err) : resolve(result)
				})
			})
		}
	}
	async getOrderList(target) {
		let ret = []
		let orderListRaw = []

		let key = "", val = ""

		if (target.length == 18) {//18�ڸ� �̴� -> id
			key = "id", val = target
		}
		else {
			key = "time", val = target
		}

		await this.getOrderListCore(key, val).then((result) => { orderListRaw = result })
		for (const i of orderListRaw) {
			ret.push(new OrderList(0, 0, 0, i.Price, i.Quantity, (i.Takeout) ? true : false, i.Stamp, i.Refund))
			ret[ret.length - 1].setIdArb(i.ID)
		}

		return ret
	}

	setOrderListCore(order) {
		return new Promise((resolve, reject) => {
			const orderTime = new Time(order.id).getTimeDBString()
			const query = `insert into orderlist(id,customer,time,name,price,quantity,takeout,stamp) values('${order.id}', 0, '${orderTime}', '', ${order.price}, ${order.quantity},${order.takeout},${order.stamp})`
			console.log(query)
			DB.query(query, (err, result) => {
				return (err) ? reject(err) : resolve(result)
			})
		})
	}
	async setOrderList(order) {
		let inputResult = false
		await this.setOrderListCore(order).then(() => { })
		await this.getOrderListCore("id", order.id).then((result) => { inputResult = (result) ? true : false })

		return inputResult
	}

	refundCore(id) {
		return new Promise((resolve, reject) => {
			DB.query(`update orderlist set Refund = 1 where id like '${id}'`, (err, result) => {
				return (err) ? reject(err) : resolve(result)
			})
		})
	}
	async refund(id) {
		let ret = false
		await this.refundCore(id).then((result) => { })
		await this.getOrderListCore("id", id).then((result) => { ret = (result) ? true : false })

		return ret
	}

	getSalesCore(period) {
		return new Promise((resolve, reject) => {
			//time/daily/monthly�� ���� �ٸ� query
			let query_string = ""
			if (period == "time") {
				query_string = "SELECT time, Quantity from orderlist where Date(time) = Date(CURDATE())"
			}
			else {
				const interval = `${(period == "daily") ? "7 DAY" : "6 MONTH"}`
				query_string = `SELECT time, price from orderlist WHERE time > DATE_FORMAT( DATE_ADD(NOW(), INTERVAL - ${interval}), '%Y-%m-%d 00:00:00' )`
			}
			//�����Ͱ� ���� ������� �����Ƿ� �ϴ� ��ü�� ���������� �Ѵ�. ���� ��ٱ���, ����, DB�� �ֹ����� ������ ��������� ���ǿ� �´� ���� ���������� �ٲ۴�.
			DB.query(query_string, (err, result) => {
				return (err) ? reject(err) : resolve(result)
			})
		})
	}
	async getSales(period) {
		//DB ��� ����� �޾� ������
		let salesRaw = []
		await this.getSalesCore(period).then((result) => { salesRaw = result })
		for (let i of salesRaw) {
			i["time"] = new Time(i["time"]).getTimeDBString()
		}
		return salesRaw;
	}

	getStampCore(tel) {
		return new Promise((resolve, reject) => {
			DB.query(`select * from stamp where ph like ${tel}`, (err, result) => {
				return (err) ? reject(err) : resolve(result)
			})
		})
	}
	setStampCore(tel, stampNum) {
		return new Promise(async (resolve, reject) => {
			//��ȭ��ȣ�� �ִ��� Ȯ���ϰ� ������ ����, ������ ��� �� ������ ���� ����
			await this.getStampCore(tel).then((result) => {
				let queryString = ``
				if (result.length != 0) {
					//mutex �� -> ������Ʈ -> ����Ʈ -> ���
					queryString = `update stamp set stamp = stamp + ${stampNum} where ph like ${tel};`
				}
				else {
					queryString = `insert into stamp (ph, stamp,Date, ExpDate) values(${tel},${stampNum} ,curdate(),curdate() + INTERVAL 1 YEAR);`
				}
				Log.tell(`QUERY: ${queryString}`)
				DB.query(queryString, (err, result) => {
					return (err) ? reject(err) : resolve(result)
				})
			})
		})
	}
	async setStamp(tel, stampNum) {
		let stampResult = {}
		await this.setStampCore(tel, stampNum).then((result) => { })
		await this.getStampCore(tel).then((result) => { stampResult = result })

		Log.tell(`query result: ${JSON.stringify(stampResult)}`, false)
	}

	changeMenuCore(menu) {
		return new Promise((resolve, reject) => {
			DB.query(`insert into menu values('${menu.cat}','${menu.name}', ${menu.price}, ${order.quantity},${order.takeout})`, (err, result) => {
				return (err) ? reject(err) : resolve(result)
			})
		})
	}

}

module.exports = DB_adapter

