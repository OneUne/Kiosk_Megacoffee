/* JH 
 * Ŭ���̾�Ʈ ������ require�� ����ؼ� Ŭ������ �ҷ��� �� ��� �ӽ÷� Ŭ�������� �����ؼ� �ٿ��־����ϴ�
 * �ϴ� �� js������ html(pug)�� ���Խ��Ѽ� Ŭ������ ����ϰ� ���߿� ���ȭ�ҰԿ�
 * */

class Menu {
	constructor(cat = "", name = "", price = 0, quantity = 0, image = "/static/picture/default.png", shot = 0, cream = false, cinnamon = false) {
		this.cat = cat
		this.name = name
		this.price = price
		this.quantity = quantity
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
			, 'quantity': this.quantity
			, 'image': this.image
			, 'shot': this.shot
			, 'cream': this.cream
			, 'cinnamon': this.cinnamon
		}
	}
}

class ShoppingCart {
	//����īƮ�� ���Ǵ� Ŭ�����̴�. ���õ� �޴��� �����Ͽ� �ֹ� ������ ��ü�� ����� ��ȯ�Ѵ�. 
	//�� ��ü�� DB�� ��������� �ʰ� �� Ŭ������ �����ϴ� �ֹ� ���� ��ü�� DB�� ����ȴ�. 

	constructor(storeNum, orderNum, takeout = true) {
		this.storeNum = storeNum
		this.orderNum = orderNum
		this.takeout = takeout

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
		this.quantity += parseInt(menu['quantity'])
		this.price += (parseInt(menu['price']) * parseInt(menu['quantity']))
	}
	deleteOrder(idx) {
		const target = this.menus[idx].getValue()
		this.menus.splice(idx, 1)
		this.price -= parseInt(target['price'])
		this.quantity -= parseInt(target['quantity'])
	}

	//�ֹ����� ���� �� ����īƮ �ʱ�ȭ
	constructOrderList() {
		const ret = new OrderList(this.storeNum, this.orderNum, this.menus, this.price, this.quantity, this.takeout, 0)

		this.orderNum++
		if (this.orderNum / 100 == 0) orderNum -= 100 //ex) 600������ 699������ ��ȯ �� 700���� �θ� ���ʰ� �Ǹ� 100�� ���� 600������ ���ư�����
		this.initiate()

		return ret
	}
}

class OrderList {
	constructor(storeNum, orderNum, menus, price, quantity, takeout = true, stamp = 0, refund = false) {
		this.storeNum = storeNum
		this.orderNum = orderNum
		this.menus = menus
		this.price = price
		this.quantity = quantity
		this.takeout = takeout
		this.stamp = stamp
		this.refund = refund

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
		else {
			this.id = input_id
		}
		this.storeNum = parseInt(input_id.slice(14))
		this.orderTime = new Time(input_id.slice(0, 14))
	}
	getValue() {
		return {
			"id": this.id
			, "orderTime": JSON.stringify(this.orderTime)
			, "storeNum": this.storeNum
			, "orderNum": this.orderNum
			, "menus": JSON.stringify(this.menus)
			, "price": this.price
			, "quantity": this.quantity
			, "takeout": this.takeout
			, "stamp": this.stamp
			, "refund": this.refund
		}
	}
}

class Stamp {
	constructor(id, ph, stampNum, date, exp_date) {
		this.id = id
		this.ph = ph
		this.stamp = stampNum
		this.date = date
		this.exp_date = exp_date
	}
	getValue() {
		return {
			"id": this.id
			, "ph": this.ph
			, "stamp": this.stampNum
			, "date": this.date
			, "exp_date": this.exp_date
		}
	}
}

class Store {
	constructor(id = 0, pw = "0000", name = "", addr = "", orderNum = 100) {
		this.id = id
		this.pw = new Store_adapter().SHA256(pw)
		this.name = name
		this.addr = addr
		this.orderNum = orderNum
	}
	increaseOrderNum() {
		this.orderNum++;
		if (this.orderNum % 100 == 0) {
			this.orderNum -= 100
		}
	}
	getValue() {
		return {
			"id": this.id
			, "name": this.name
			, "addr": this.addr
		}
	}
}

class Store_adapter {
	constructor() {
	}
	getStoreInfo() {
		//localStorage�� �ִ� JSON ������ store��ü�� ��ȯ
		return window.localStorage.getItem("storeInfo")
	}
	setStoreInfo(storeInfo) {
		//localStorage���ٰ� store ��ü�� �޾Ƽ� JSON���� ����
		let target = storeInfo
		if (typeof (target) != typeof ("")) {
			target = JSON.stringify(target)
		}
		return window.localStorage.setItem("storeInfo", target)
	}
	identifyPW(pw_input) {
		//input_id�� localStorage�� �ִ� storeInfo�� ��й�ȣ�� ������ Ȯ��
		const storeInfo = JSON.parse(this.getStoreInfo())
		return this.SHA256(pw_input) == storeInfo.pw
	}
	setPW(pw_new) {
		//�� ��й�ȣ�� �޾Ƽ� ��ȣȭ�� �� localStorage�� storeInfo�� ����
		let storeInfo = JSON.parse(this.getStoreInfo())
		storeInfo.pw = this.SHA256(pw_new)
		this.setStoreInfo(storeInfo)
	}
	setOrderNum(num_new) {
		//���ڸ� �޾Ƽ� �ֹ���ȣ�� ����
		let storeInfo = JSON.parse(this.getStoreInfo())
		storeInfo.orderNum = num_new
		this.setStoreInfo(storeInfo)
	}

	SHA256(s) {

		var chrsz = 8;
		var hexcase = 0;

		function safe_add(x, y) {
			var lsw = (x & 0xFFFF) + (y & 0xFFFF);
			var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 0xFFFF);
		}

		function S(X, n) { return (X >>> n) | (X << (32 - n)); }
		function R(X, n) { return (X >>> n); }
		function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
		function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
		function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
		function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
		function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
		function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

		function core_sha256(m, l) {

			var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1,
				0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
				0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786,
				0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
				0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147,
				0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
				0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B,
				0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
				0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A,
				0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
				0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);

			var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);

			var W = new Array(64);
			var a, b, c, d, e, f, g, h, i, j;
			var T1, T2;

			m[l >> 5] |= 0x80 << (24 - l % 32);
			m[((l + 64 >> 9) << 4) + 15] = l;

			for (var i = 0; i < m.length; i += 16) {
				a = HASH[0];
				b = HASH[1];
				c = HASH[2];
				d = HASH[3];
				e = HASH[4];
				f = HASH[5];
				g = HASH[6];
				h = HASH[7];

				for (var j = 0; j < 64; j++) {
					if (j < 16) W[j] = m[j + i];
					else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

					T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
					T2 = safe_add(Sigma0256(a), Maj(a, b, c));

					h = g;
					g = f;
					f = e;
					e = safe_add(d, T1);
					d = c;
					c = b;
					b = a;
					a = safe_add(T1, T2);
				}

				HASH[0] = safe_add(a, HASH[0]);
				HASH[1] = safe_add(b, HASH[1]);
				HASH[2] = safe_add(c, HASH[2]);
				HASH[3] = safe_add(d, HASH[3]);
				HASH[4] = safe_add(e, HASH[4]);
				HASH[5] = safe_add(f, HASH[5]);
				HASH[6] = safe_add(g, HASH[6]);
				HASH[7] = safe_add(h, HASH[7]);
			}
			return HASH;
		}

		function str2binb(str) {
			var bin = Array();
			var mask = (1 << chrsz) - 1;
			for (var i = 0; i < str.length * chrsz; i += chrsz) {
				bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
			}
			return bin;
		}

		function Utf8Encode(string) {
			string = string.replace(/\r\n/g, "\n");
			var utftext = "";

			for (var n = 0; n < string.length; n++) {

				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if ((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}

			return utftext;
		}

		function binb2hex(binarray) {
			var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
			var str = "";
			for (var i = 0; i < binarray.length * 4; i++) {
				str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
					hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
			}
			return str;
		}
		s = Utf8Encode(s);
		return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
	}
}

class Time extends Date {
	/*�Ͽ����ú��ʸ� ������ �ð� Ŭ���� 
	*
    * 14�ڸ� ���ڿ�, Ȥ�� ��,��,��,��,��,�ʸ� �Ű������� �־ ������ �ð� ����
    * 
    * Ȥ�� �ƹ��͵� ���� �ʾƼ� ������ �ð� ����
    * 
    * ������ ��ü�� 14�ڸ� string���� ��ȯ�� �� ����
    */

	constructor(y, m, d, hr, min, sec) {
		if (typeof (y) === typeof ("")) {
			//ù��° �Ű������� Ÿ���� ""�̶� ����(string��) ��� 14�ڸ��� �Ͽ����ú��ʷ� parse�Ͽ� �ð� ����
			if (y[y.length - 1] == "Z") {//ù ��° �Ű������� ISOTime�� ������ super�� �װ��� ó���ϴ� ����� �����Ƿ� ������ �̿�
				super(y)
				y = undefined
			}
			else {
				let time = y

				y = parseInt(time.slice(0, 4))
				m = parseInt(time.slice(4, 6))
				d = parseInt(time.slice(6, 8))
				hr = parseInt(time.slice(8, 10))
				min = parseInt(time.slice(10, 12))
				sec = parseInt(time.slice(12, 14))

				super(y, m, d, hr, min, sec)
			}
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
	getTimeDBString() {
		//DB �Է¿�
		let time = "" + this.year
		if (this.month >= 10)
			time += "-" + this.month
		else
			time += "-0" + this.month
		if (this.date >= 10)
			time += "-" + this.date
		else
			time += "-0" + this.date
		if (this.hour >= 10)
			time += " " + this.hour
		else
			time += " 0" + this.hour
		if (this.minute >= 10)
			time += ":" + this.minute
		else
			time += ":0" + this.minute
		if (this.second >= 10)
			time += ":" + this.second
		else
			time += ":0" + this.second

		return time
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
	showTimeString() {
		//������ ������ �������� ��
		let time = `` + this.year + `�� ` + this.month + `��` + this.date + `�� `
		if (this.hour >= 10)
			time += `` + this.hour
		else
			time += `0` + this.hour
		time += `�� `
		if (this.minute >= 10)
			time += `` + this.minute
		else
			time += `0` + this.minute
		time += `�� `
		if (this.second >= 10)
			time += `` + this.second
		else
			time += `0` + this.second

		return time += `��`
	}
}