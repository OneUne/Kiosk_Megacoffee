const DB = require("./DB")
let DB_adapter = new DB()

module.exports = (app, partials) => {
	app.get(routes.cover, (req, res) => {
		res.render("cover", { routes })
	})

	app.get(routes.menu, async (req, res) => {
		let menu=[]
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

	app.get(routes.refund, async (req, res) => {
		let refund = []
		await DB_adapter.getOrderList().then((ret) => { refund = ret })
		console.log("MY JSON: "+refund[0])
		res.render("refund", { routes, refund })
	})
}

const routes = {
	cover: "/"
	,menu: "/menu"
	,coffeeHot: "/coffeeHot"
	,coffeeIce: "/coffeeIce"
	,beverage: "/beverage"
	,tea: "/tea"
	,juice: "/juice"
	,ade: "/ade"
	,smoothieFraffe: "/smoothieFraffe"
	,dessert: "/dessert"
	,americano: "/americano"

	,order: "/order"
	,refund:"/refund"

	,test:"/test"
}

export default routes
