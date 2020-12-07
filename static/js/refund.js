let refund_list = []

$(document).ready(function () {
	//�������� �ε��Ǹ� ������ div�� �ִ� ������ ������ �����Ѵ�.
	refund_list = JSON.parse($("#refund").val())

	//���� ��ư�� ������ �ڷ� ����
	$("#Xbtn").click(function () {
		window.location.href = "/managerpage"
	})

	$("#search_by_date").click(function () {
		const targetDay = $("#calendar").val()
		window.location.href = `/refund?date=${targetDay}`
	})
	$("#search_by_id").click(function () {
		const targetID = $("#id_input").val()
		window.location.href = `/refund?id=${targetID}`
	})

	//�ֹ����� �� �ϳ��� Ŭ���ϸ� �ϴܿ� �� �ֹ� ������ ǥ���Ѵ�.
	$("#table_order_list > tbody > tr").on('click', function () {
		$(".table > tbody > tr").css("background-color", "inherit")
		$(this).css("background-color", "skyblue")
		const idToFind = $(this).children()[1].innerText

		//���̺��� ������ �ֹ�����
		let selected = ""
		for (let i of refund_list) {
			if (idToFind == i.id) {
				selected = i
				break
			}
		}

		//�� �ֹ� ���� ���̺��� ���̰� �� �� ������ ä���ִ´�
		$("#detailed_order").removeAttr("hidden")

		$(".order_id").text(`${selected.id}`)
		$(".order_orderTime").text(`${selected.orderTime}`)
		$(".order_TO").text(`${(selected.takeout) ? "T.O." : "����"}`)
		$(".order_price").text(`${selected.price}`)
	})

	$("#execute_refund").click(function () {
		const id_to_refund = $(".order_id").text()

		var form = document.createElement('form');
		form.style.visibility = 'hidden'; // no user interaction is necessary
		form.method = 'POST'; // forms by default use GET query strings
		form.action = '/refund';
		var input = document.createElement('input');
		input.name = "id";
		input.value = id_to_refund;
		form.appendChild(input); // add key/value pair to form

		document.body.appendChild(form); // forms cannot be submitted outside of body
		form.submit()

		setTimeout(function () { window.location.reload() },500)
	})
})