//JS	���� ���丮���� ���� ������ �ֹ���ȣ ������� �����ϴ����� �����ϱ� ���� ���� js file
$(document).ready(function () {
	if (!window.localStorage.getItem("storeInfo")) {
		window.localStorage.setItem("storeInfo",JSON.stringify(new Store(1313,1234,"13��","",200)))
	}

})
