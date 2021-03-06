function drawChart() {
	let jsonTable = JSON.parse($("#resultTable").val())
	let today = new Date();

	//JH	데이터가 없는 시간대에는 NULL이 아니라 0원을 팔았다는 것을 의미
	for (let i = -5; i <= 0; i++) {
		jsonTable.push({ "time": String(new Date(today.getFullYear(), today.getMonth()+i)), "price": 0 })
	}

	var tempdata = new google.visualization.DataTable();
	tempdata.addColumn('datetime', 'DATE')
	tempdata.addColumn('number', 'PRICE')

	tempdata.addRows(jsonTable.length)
	for (let i = 0; i < jsonTable.length; i++) {
		const dt = new Date(jsonTable[i].time.slice(0, jsonTable[i].time.indexOf('(')))
		tempdata.setCell(i, 0, new Date(dt.getFullYear(), dt.getMonth()))
		tempdata.setCell(i, 1, parseInt(jsonTable[i].price))
	}

	//월별로 데이터를 묶어서 계산
	var data = google.visualization.data.group(tempdata, [0], [{ 'column': 1, 'aggregation': google.visualization.data.sum, 'type': 'number' }])
	var options = {
		title: '지난 6개월간 월별 매출 (단위: 만원)',
		titleTextStyle: { fontSize: 15 },
		chartArea: { 'width': '80%', 'height': '80%' },
		height: 400,
		width: 450,
		legend: { position: 'none' },
		hAxis: {
			format: 'MM월',
			minValue: new Date(today.getFullYear(), today.getMonth() - 5),
			viewWindow: { min: new Date(today.getFullYear(), today.getMonth() - 5) }
		},
		vAxis: { format: '#만원' }

	};

	//tooltip date format 맞춤
	var date_formatter = new google.visualization.DateFormat({
		pattern: "MM월"
	});

	//tooltip 매출액 format 맞춤
	date_formatter.format(data, 0)
	var won_formatter = new google.visualization.NumberFormat({
		pattern: "#원"
	});
	won_formatter.format(data, 1)
	var view = new google.visualization.DataView(data);
	view.setColumns([0, {
		type: 'number',
		label: data.getColumnLabel(1),
		calc: function (dt, row) {
			return { v: dt.getValue(row, 1) / 10000, f: dt.getFormattedValue(row, 1) };
		}
	}]);


	var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
	chart.draw(view, options);
}

$(document).ready(function () {
	google.charts.load('current', { packages: ['corechart'] });
	google.charts.setOnLoadCallback(drawChart);

	$("#Xbtn").click(function () {
		window.location.href = "/managerpage"
	})
})