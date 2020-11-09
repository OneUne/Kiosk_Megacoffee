const Time = require("./Time")
const parseTimeBigInt = require("./time")
const Item=require("./item")

class Order {
	constructor() {
		id = 0
		storeId = 0
		orderTime = undefined

		itemList = []
		total = 0
		amount = 0
	}

	setStoreIdFromStore(store) { this.storeId = store.id }
	setOrderTime() {this.orderTime=new Time()	}
	
	setId() {
		//id�� �����Ͻú���(4 2 2 2 2 2 : 14) + ����id(4)�� �����ȴ�
		//ex) 2020082320191290416 : 2020�� 8�� 23�� 20�� 19�� 12�ʿ� 9416�� �������� ���� �ֹ�
		return BigInt("" + String(this.orderTime.getTimeBigInt) + this.storeId.toString().padStart(4, "0"))
	}

	getValue() {
		return {
			"id": this.id
			, "itemList": this.itemList
			, "total": this.total
			, "amount": this.amount
		}
	}
}

module.exports=Order