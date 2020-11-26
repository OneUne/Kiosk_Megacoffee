const DB = require("./DB")
let DB_adapter = new DB()

module.exports = (app, partials) => {
	app.get(routes.cover, (req, res) => {
		res.render("cover", { routes })
	})

	app.get(routes.menu, async (req, res) => {
		let menu = []
		await DB_adapter.getMenu().then((ret) => { menu = ret })//������ ���� ��� �Ѿ�� ������ ��ٷȴ� ó��
		res.render("menulist", { routes, menu })
	})

	//JH	������û���� ���۵� json �ް� check �������� �Ѿ��
	app.post(routes.check, (req, res) => {
		console.log(req.body)
		const order = req.body
		let amount = 0
		for (var it of order["order_list"]) {
			amount += it["item_price"]
		}
		order["total_price"] = amount
		order["total_quantity"] = order["order_list"].length

		res.render("check", { routes , order})
	})

	app.get(routes.refund, async (req, res) => {
		let refund = []
		await DB_adapter.getOrderList().then((ret) => { refund = ret })
		//JH 201121 �ֹ����� ��û ���� �������� �׽�Ʈ�� ���� 
		refund = refund.concat(refund)
		refund = refund.concat(refund)
		refund = refund.concat(refund)
		refund = refund.concat(refund)
		refund = refund.concat(refund)
		refund = refund.concat(refund)
		res.render("refund", { routes, refund })
	})

	app.get(routes.timesales, (req, res) => {
		res.sendFile("sales/timesales.php")
	})

	//JH	test������ ���� ��� �׽�Ʈ
	app.get(routes.test, (req, res) => {
		res.render("test", { routes })
	})
	app.post(routes.test, async (req, res) => {
		let result = []
		await DB_adapter.getSales(req.body["period"]).then((ret) => { result = ret })
		res.send(result)
	})
}

const routes = {
	cover: "/"
	, menu: "/menu"
	, coffeeHot: "/coffeeHot"
	, coffeeIce: "/coffeeIce"
	, beverage: "/beverage"
	, tea: "/tea"
	, juice: "/juice"
	, ade: "/ade"
	, smoothieFraffe: "/smoothieFraffe"
	, dessert: "/dessert"
	, americano: "/americano"

	, check: "/check"
	, refund: "/refund"
	, timesales: "/timesales"

	, test: "/test"
}

export default routes
