//JS	세션 스토리지에 매장 정보랑 주문번호 몇번부터 시작하는지를 저장하기 위해 만든 js file
var click_five_times_to_access_manager_page = 0;

$(document).ready(function () {
	if (!(new Store_adapter().getStoreInfo())) {
		new Store_adapter().setStoreInfo(new Store(1313, "1234", "13조", "", 200))
	}

	$("#takeout_true").click(function () {
		window.location.href = "/menu?takeout=true"
	})
	$("#takeout_false").click(function () {
		window.location.href = "/menu?takeout=false"
	})

	$("#managerBtn").click(function () {
		click_five_times_to_access_manager_page++
		if (click_five_times_to_access_manager_page >= 5) {
			window.location.href ="/entermanagerpage"
		}
	})
})

