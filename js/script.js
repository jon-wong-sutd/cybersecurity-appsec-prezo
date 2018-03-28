// Put our codes into a private context.
// Don't pollute global context with vars!
(function() {
  // Specify the DOM element to install Impress.js on.
  var rootElement = document.getElementById("impress");
  var impressAPI = impress("impress");

  // Start initializing Impress.js.
  var impressInit = new Promise(function(resolve, reject) {
    rootElement.addEventListener("impress:init", function() {
      resolve('Impress init done!');
    });
    impressAPI.init();
  });

  // Wait for Impress.js to finish init()
  impressInit.then(function(successMsg) {
    console.log(successMsg);

    // https://stackoverflow.com/questions/40086575/chart-js-draw-mathematical-function
    Chart.pluginService.register({
      beforeInit: function(chart) {
        // We get the chart data
        var data = chart.config.data;

        // For every dataset ...
        for (var i = 0; i < data.datasets.length; i++) {

          // For every label ...
          for (var j = 0; j < data.labels.length; j++) {

            // We get the dataset's function and calculate the value
            var fct = data.datasets[i].function,
                x = data.labels[j],
                y = fct(x);
            // Then we add the value to the dataset data
            data.datasets[i].data.push(y);
          }
        }
      }
    });

    var stepOneChart = {
      chart: null,

      init: function() {
        var self = this;
        rootElement.addEventListener( "impress:stepenter", function(event) {
          var currentStep = event.target;
          if(currentStep.id == 'tdd-graph') {
            self.destroy(); self.build();
          }
          else {
            self.destroy();
          }
        });
      },

      chartData: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        datasets: [{
          label: 'Classic',
          function: function(x) {
            return 50 + x*x - 1;
          },
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [],
          fill: false,
        }, {
          label: 'TDD',
          function: function(x) {
            var c = 10;
            if (x == 1) c = 0;
            return c + 100/x;
          },
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgb(54, 162, 235)',
          data: [],
          fill: false
        }]
      },

      build: function() {
        var ctx = document.getElementById("step-1-chart").getContext('2d');

        this.chart = new Chart(ctx, {
          type: 'line',
          data: this.chartData,
          options: {
            scales: {
              yAxes: [{
                display: true,
                ticks: {
                  beginAtZero: true   // minimum value will be 0.
                }
              }]
            },
            legend: {
              display: true,
              labels: { fontSize: 32 }
            }
          }
        });
        this.chart.render({
          duration: 800,
          lazy: true,
          easing: 'easeOutBounce'
        });
        this.chart.update();
      },

      destroy: function() {
        if (this.chart)
          this.chart.destroy();
      }
    };
    stepOneChart.init();

  });

})();
