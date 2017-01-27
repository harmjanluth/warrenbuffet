window.onload = () => {

    const data = 
    {
        labels: [],
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
            data: [],
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

    const socket = io('http://localhost:3000');
    socket.on('news', function (data) {
        if (!data.sentiment)
            return;
        const sentiment = data.sentiment * 100;
        const length = graph.data.labels.length + 1;
        graph.data.datasets[0].data.push(sentiment);
        graph.data.labels.push('');
        graph.update();


    });

};

