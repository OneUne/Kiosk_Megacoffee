const DB = require("./DB")
let DB_adapter = new DB()

module.exports = (app, partials) => {
	let menu = []

	app.get(routes.cover, (req, res) => {
		res.render("cover", { routes })
	})

	app.get(routes.menu, async (req, res) => {
		await DB_adapter.getMenu(`${req.query.category}`).then((ret) => { menu = ret })//������ ���� ��� �Ѿ�� ������ ��ٷȴ� ó��
		res.render("menulist", { routes, menu })
	})

	//JH ������û���� ���۵� json �ޱ�
	app.post(routes.order, (req, res) => {
		console.log(req.body)
		const order = req.body
		let amount = 0
		for (var it of order["order_list"]) {
			amount += it["item_price"]
		}
		order["total_price"] = amount
		order["total_quantity"] = order["order_list"].length

		res.send(JSON.stringify(order))
	})
}

const routes = {
	cover: "/",

	menu: "/menu",
	coffeeHot: "/coffeeHot",
	coffeeIce: "/coffeeIce",
	beverage: "/beverage",
	tea: "/tea",
	juice: "/juice",
	ade: "/ade",
	smoothieFraffe: "/smoothieFraffe",
	dessert: "/dessert",
	americano: "/americano",

	order: "/order",
}

export default routes
