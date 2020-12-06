const fs = require("fs")
const Time = require("./static/class/Time")
const DB = require("./DB")
let DB_adapter = new DB()
const ServerLog = require("./static/class/ServerLog")
const Log = new ServerLog()

module.exports = (app, partials) => {
	app.get(routes.cover, (req, res) => {
		console.log(req.headers["referer"])

		res.render("cover", { routes })
	})

	app.get(routes.menu, async (req, res) => {
		Log.tell("Menu Page Requested")
		if (req.headers["referer"] === undefined) {
			res.status(400)
			res.render("error", { routes })
		}
		else {
			let menu = []
			await DB_adapter.getMenu().then((ret) => { menu = ret })//������ ���� ��� �Ѿ�� ������ ��ٷȴ� ó��

			res.render("menulist", { routes, menu })
		}
	})

	app.post(routes.check, (req, res) => {
		Log.tell("Payment Requested")
		if (req.headers["referer"] === undefined) {
			res.status(400)
			res.render("error", { routes })
		}
		else {
			const order = JSON.parse(req.body["orderList"])

			const timestr = new Time(order.id).getTimeDBString()
			res.render("check", { routes, order, timestr })
		}
	})

	app.post(routes.change_to_checkpoint, (req, res) => {
		Log.tell("Stamp Requested")
		if (req.headers["referer"] === undefined) {
			res.status(400)
			res.render("error", { routes })
		}
		else {
			const order = JSON.parse(req.body["orderList"])

			res.render("numberpad", { routes, order })
		}
	})

	app.post(routes.stamp, async (req, res) => {
		Log.tell(`Stamp Accumulation Requested`)

		const stampInfo = req.body

		Log.tell(`Phone numer: ${stampInfo["ph"]}\tstamp: ${stampInfo["stamp"]}`, false)

		await DB_adapter.setStamp(stampInfo["ph"], stampInfo["stamp"]).then((ret) => {
			Log.tell(ret)
		})
	})

	app.post(routes.change_to_complete, async (req, res) => {
		Log.tell("Payment Complete Requested")
		if (req.headers["referer"] === undefined) {
			res.status(400)
			res.render("error", { routes })
		}
		else {
			if (req.headers["referer"] === undefined) {
				res.status(400)
				res.render("error", { routes })
			}
			else {
				const order = JSON.parse(req.body["orderList"])
				Log.tell(order)
				await DB_adapter.setOrderList(order).then((ret) => {
					Log.tell(`Saving Order Information: ${ret}`, false, 1)
				})

				const timestr = new Time(order.id).getTimeDBString()
				res.render("complete", { routes, order, timestr })
			}
		}
	})

	app.get(routes.entermanagerpage, (req, res) => {
		Log.tell("Entering Manager Page Requested - Identifying...")

		res.render("password_check", { routes })
	})

	app.get(routes.managerpage, (req, res) => {
		if (req.headers["referer"] === undefined) {
			Log.tell("Manager Identified")
			res.status(400)
			res.render("error", { routes })
		}
		else {
			res.render("managerpage", { routes })
		}
	})

	app.get(routes.refund, async (req, res) => {
		let refund = []

		const target_day = (req.query.date) ? req.query.date : new Time().getTimeDBString().slice(0, 10)
		await DB_adapter.getOrderList(target_day).then((ret) => { refund = ret })
		refund.reverse()

		res.render("refund", { routes, refund, target_day })
	})

	app.get(routes.timesales, (req, res) => {
		res.sendFile("sales/timesales.php")
	})

	app.get(routes.change_pw, (req, res) => {
		if (req.headers["referer"] === undefined) {
			res.status(400)
			res.render("error", { routes })
		}
		else {
			res.render("newpassword_input", { routes })
		}
	})
	app.get(routes.change_ordernum, (req, res) => {
		if (req.headers["referer"] === undefined) {
			res.status(400)
			res.render("error", { routes })
		}
		else {
			res.render("bill_option", { routes })
		}
	})

	//JH	test������ ���� ��� �׽�Ʈ
	app.get(routes.test, (req, res) => {
		res.render("test", { routes })
	})
	app.post(routes.test, async (req, res) => {
		let result = []
		await DB_adapter.getSales(req.body["period"]).then((ret) => { result = ret })
		Log.tell(result, false, 3)
		res.send(result)
	})
}

const routes = {
	cover: "/"
	, menu: "/menu"

	, check: "/check"
	, change_to_complete: "/change_to_complete"
	, change_to_checkpoint: "/change_to_checkpoint"
	, stamp: "/stamp"

	, entermanagerpage: "/entermanagerpage"
	, managerpage: "/managerpage"
	, refund: "/refund"
	, refund_request: "/refund_request"
	, timesales: "/timesales"
	, change_ordernum: "/change_ordernum"
	, change_pw: "/change_pw"

	, test: "/test"
	, error: "/error"
}

export default routes
