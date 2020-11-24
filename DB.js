const Menu = require("./static/class/Menu")
const OrderList = require("./static/class/ShoppingCart")
const Time = require("./static/class/Time")
const mysql = require("mysql")

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
			console.log(`[${Date()}]\nTEAM13>> DATABASE CONNECTED`)
		})
	}

	getMenuCore(categoryName) {
		return new Promise((resolve, reject) => {
			DB.query(`select * from menu where cat = '${categoryName}'`, (err, result) => {
				return (err) ? reject(err) : resolve(result)
			})
		})
	}
	async getMenu(categoryName) {
		console.log(`[${Date()}]\nTEAM13>> getMenu requested: ${categoryName} `)
		//DB���� �����͸� result�� ���� ���� �� �����ͷ� �޴� ��ü�� ���� ���� �װ��� ��ȯ�Ѵ�. 
		let ret = []
		let menuListRaw = []

		await this.getMenuCore(categoryName).then((result) => { menuListRaw = result }) //DB���� ��� ���� �Ѿ�� ������ ��ٷ��� �����Ѵ�.
		for (const i of menuListRaw) {
			ret.push(new Menu(i.Cat, i.Name, i.Price, (i.Image) ? i.Image : undefined))//DB���� ���޹��� raw �����Ϳ��� ī�װ�, �̸�, ����, �̹���(null -> default)�� �̾Ƽ� �޴��� �����Ѵ�(�������� ������)
		}

		return ret
	}

	getOrderListCore() {
		return new Promise((resolve, reject) => {
			DB.query(`select * from orderlist`, (err, result) => {
				return (err) ? reject(err) : resolve(result)
			})
		})
	}
	async getOrderList() {
		let ret = []
		let orderListRaw = []

		await this.getOrderListCore().then((result) => { orderListRaw = result })
		for (const i of orderListRaw) {
			ret.push(new OrderList(0, 0, 0, i.Price, i.Quantity))  //.setIdArb("" + String(parseInt(Math.random() * 2020)).padStart(4, '0') + "05140809110204")  �ӽ÷� ���� ID, ������ �����ͺ��̽����� �����ؾ� ��
		}

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
				query_string = `SELECT time, Totalprice from orderlist WHERE time > DATE_FORMAT( DATE_ADD(NOW(), INTERVAL - ${interval}), '%Y-%m-%d 00:00:00' )`
			}
			//�����Ͱ� ���� ������� �����Ƿ� �ϴ� ��ü�� ���������� �Ѵ�. ���� ��ٱ���, ����, DB�� �ֹ����� ������ ��������� ���ǿ� �´� ���� ���������� �ٲ۴�.
			query_string="SELECT * from orderlist"
			DB.query(query_string, (err, result) => {
				return (err) ? reject(err) : resolve(result)
			})
		})
	}
	async getSales(period) {
		//DB ��� ����� �޾� ������
		let ret=[]
		let salesRaw = []
		await this.getSalesCore(period).then((result) => { salesRaw = result })
		for (const i of salesRaw) {
			ret.push({ "time": new Time(i.Time.getFullYear(), i.Time.getMonth(), i.Time.getDate(), i.Time.getHours(), i.Time.getMinutes(), i.Time.getSeconds()), "price":i.TotalPrice})
		}

		console.log(`\t\t${ret}\n`);
		return ret;
	}
}

module.exports = DB_adapter

