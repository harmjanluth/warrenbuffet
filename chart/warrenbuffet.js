window.onload = () => {

    const data = 
    {
        labels: ['', '', '', '', '', '', ''],
        datasets: [
        {
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            data: [-65, 59, 80, 81, 56, 55, 40],
            spanGaps: false,
        }]
    };

    const ctx = document.getElementById("chart").getContext("2d");
    const graph = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
         legend: {
            display: false
         },
         tooltips: {
            enabled: false
         }
        }
    });

    const socket = io('http://localhost');
    socket.on('news', function (data) {
        
        const sentiment = data.sentiment || Math.floor(Math.random() * (Math.random() < 0.5 ? 100 : -100));
        const length = graph.data.labels.length + 1;
        graph.data.datasets[0].data.push(sentiment);
        graph.data.labels.push('');
        graph.update();


    });

};

