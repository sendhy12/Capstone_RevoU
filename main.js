document.addEventListener("DOMContentLoaded", function () {
    // Panggil applyFilters saat halaman pertama kali dimuat
    applyFilters();
  });
  
  // Tambahkan event listener untuk setiap perubahan pada dropdown
  const filterForm = document.getElementById("filterForm");
  filterForm.addEventListener("change", applyFilters);
  
  // Fungsi untuk mengambil data dan menerapkan filter
  function applyFilters() {
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        const selectedQuarter = document.getElementById("quarters").value;
        const selectedYear = document.getElementById("year").value;
        const selectedCountry = document.getElementById("country").value;
        const selectedCategory = document.getElementById("bikes-category").value;
        const selectedAgeGroup = document.getElementById("age-group").value;
        const selectedGender = document.getElementById("gender").value;
  
        // Filter data berdasarkan pilihan dropdown
        const filteredData = data.filter((item) => {
          const itemQuarter = getQuarter(item.Date);
  
          return (
            (selectedQuarter === "All" || itemQuarter === selectedQuarter) &&
            (selectedYear === "All" || item.Year === selectedYear) &&
            (selectedCountry === "All" || item.Country === selectedCountry) &&
            (selectedCategory === "All" ||
              item.Sub_Category === selectedCategory) &&
            (selectedAgeGroup === "All" || item.Age_Group === selectedAgeGroup) &&
            (selectedGender === "All" || item.Customer_Gender === selectedGender)
          );
        });
  
        // Hitung total berdasarkan data yang difilter
        let totalCost = 0;
        let totalRevenue = 0;
        let totalProfit = 0;
        let totalSales = 0;
        let totalTransactions = filteredData.length;
  
        filteredData.forEach((item) => {
          totalCost += parseFloat(item.Total_Cost);
          totalRevenue += parseFloat(item.Total_Revenue);
          totalProfit += parseFloat(item.Total_Profit);
          totalSales += parseInt(item.Order_Quantity);
        });
  
        // Menampilkan informasi pada masing-masing section dengan format angka
        document.getElementById(
          "totalCost"
        ).innerHTML = `€ ${totalCost.toLocaleString()}`;
        document.getElementById(
          "totalRevenue"
        ).innerHTML = `€ ${totalRevenue.toLocaleString()}`;
        document.getElementById(
          "totalProfit"
        ).innerHTML = `€ ${totalProfit.toLocaleString()}`;
        document.getElementById(
          "totalSales"
        ).innerHTML = `${totalSales.toLocaleString()}`;
        document.getElementById(
          "totalTransactions"
        ).innerHTML = `${totalTransactions.toLocaleString()}`;
  
        // Memproses data yang sudah difilter
        processFilteredDataTotalProfitByMonth(filteredData);
        processFilteredDaTotalTransactionsByMonth(filteredData);
        processFilteredDataTotalSalesByCountry(filteredData);
        processFilteredDataTotalProfitByCountry(filteredData);
        processFilteredDataTotalSalesByProduct(filteredData);
        processFilteredDataTotalSalesByCategory(filteredData);
      })
      .catch((error) => console.error("Error:", error));
  }
  
  // Fungsi untuk memproses data yang sudah difilter
  function processFilteredDataTotalProfitByMonth(data) {
    // Mengelompokkan total profit berdasarkan bulan
    const profitByMonth = {};
    data.forEach((item) => {
      const month = item.Month;
      const profit = parseFloat(item.Total_Profit);
      if (!profitByMonth[month]) {
        profitByMonth[month] = profit;
      } else {
        profitByMonth[month] += profit;
      }
    });
  
    // Mengurutkan bulan secara alfanumerik
    const months = Object.keys(profitByMonth).sort((a, b) => {
      return new Date("2000-" + a + "-01") - new Date("2000-" + b + "-01");
    });
  
    // Mengambil total profit yang sesuai dengan urutan bulan
    const profits = months.map((month) => profitByMonth[month]);
    console.log(profitByMonth);
  
    // Mendapatkan nilai maksimum dari total profit untuk menentukan sumbu Y
    const maxYValue = Math.ceil(Math.max(...profits))
  
    // Update chart dengan data yang baru dan sumbu Y yang dinamis
    updateLineChart(months, profits, maxYValue);
  }
  
  function processFilteredDaTotalTransactionsByMonth(data) {
    // Mengelompokkan total transaksi berdasarkan bulan
    const transactionsByMonth = {};
    data.forEach((item) => {
      const month = item.Month;
      if (!transactionsByMonth[month]) {
        transactionsByMonth[month] = 1; // Inisialisasi total transaksi pada bulan tertentu dengan 1
      } else {
        transactionsByMonth[month]++; // Increment total transaksi pada bulan tertentu
      }
    });
  
    // Mengurutkan bulan secara alfanumerik
    const months = Object.keys(transactionsByMonth).sort((a, b) => {
      return new Date("2000-" + a + "-01") - new Date("2000-" + b + "-01");
    });
  
    // Mengambil total transaksi yang sesuai dengan urutan bulan
    const transactions = months.map((month) => transactionsByMonth[month]);
  
    // Mendapatkan nilai maksimum dari total transaksi untuk menentukan sumbu Y
    const maxYValue = Math.ceil(Math.max(...transactions))
  
    // Update chart dengan data yang baru dan sumbu Y yang dinamis
    updateLineChart2(months, transactions, maxYValue);
  }
  
  function processFilteredDataTotalSalesByCountry(data) {
    // Mengelompokkan total penjualan berdasarkan negara hanya untuk data yang sudah difilter
    const salesByCountry = {};
    data.forEach((item) => {
      const country = item.Country;
      const sales = parseInt(item.Order_Quantity);
      if (!salesByCountry[country]) {
        salesByCountry[country] = sales;
      } else {
        salesByCountry[country] += sales;
      }
    });
  
    // Mengurutkan negara berdasarkan total penjualan dari yang tertinggi ke terendah
    const sortedCountries = Object.keys(salesByCountry).sort(
      (a, b) => salesByCountry[b] - salesByCountry[a]
    );
  
    // Mengurutkan total penjualan berdasarkan urutan negara yang sudah diurutkan
    const sales = sortedCountries.map((country) => salesByCountry[country]);
  
    // Update chart dengan data yang baru
    updateStackedBarChart(sortedCountries, sales);
  }
  
  function processFilteredDataTotalProfitByCountry(data) {
    // Mengelompokkan total keuntungan berdasarkan negara
    const profitByCountry = {};
    data.forEach((item) => {
        const country = item.Country;
        const profit = parseFloat(item.Total_Profit);
        if (!profitByCountry[country]) {
            profitByCountry[country] = profit;
        } else {
            profitByCountry[country] += profit;
        }
    });
  
    const profitByCountrySorted = Object.entries(profitByCountry).sort((a, b) => b[1] - a[1]);
    const countries = profitByCountrySorted.map((item) => item[0]);
    const profits = profitByCountrySorted.map((item) => item[1]);
  
    // Update chart dengan data yang baru
    updateStackedBarChart2(countries, profits);
  }
  
  function processFilteredDataTotalSalesByProduct(data) {
    // Mengelompokkan produk berdasarkan jumlah penjualan
    const salesByProduct = {};
    data.forEach((item) => {
        const product = item.Product;
        const sales = parseInt(item.Order_Quantity);
        if (!salesByProduct[product]) {
            salesByProduct[product] = sales;
        } else {
            salesByProduct[product] += sales;
        }
    });
  
    // Mengurutkan produk dari yang terlaris
    const sortedProducts = Object.keys(salesByProduct).sort((a, b) => salesByProduct[b] - salesByProduct[a]);
  
    // Menyiapkan data untuk 10 produk terlaris
    const topProducts = sortedProducts.slice(0, 10);
    const sales = topProducts.map(product => salesByProduct[product]);
  
    // Update chart dengan data yang baru
    updateHorizontalBarChart3(topProducts, sales);
  }
  
  function processFilteredDataTotalSalesByCategory(data) {
    // Mengelompokkan penjualan berdasarkan kategori sepeda
    const salesByCategory = {};
    data.forEach((item) => {
        const category = item.Sub_Category;
        const sales = parseInt(item.Order_Quantity);
        if (!salesByCategory[category]) {
            salesByCategory[category] = sales;
        } else {
            salesByCategory[category] += sales;
        }
    });
  
    // Mengonversi objek ke array, mengurutkan, dan kembali ke objek terurut
    const sortedSalesByCategory = Object.entries(salesByCategory)
        .sort((a, b) => b[1] - a[1]) // Urutkan berdasarkan nilai penjualan (terbanyak ke terkecil)
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
  
    // Menyiapkan data untuk chart
    const categories = Object.keys(sortedSalesByCategory);
    const sales = categories.map(category => sortedSalesByCategory[category]);
  
    // Update chart dengan data yang baru
    updateDonutChart(categories, sales);
  }
  
  // Fungsi untuk membuat grafik garis atau memperbarui data pada grafik yang sudah ada
  function updateLineChart(labels, data, maxYValue) {
    const ctx = document.getElementById("lineChart1").getContext("2d");
    destroyChartIfExist("lineChart1");
  
    const fontSize = getFontSizeBasedOnScreenWidth();
  
    lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Profit by Month",
            data: data,
            backgroundColor: "#003049",
            borderColor: "#003049",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            display: true,
            align: "end",
            color: "black",
            formatter: function (value) {
              return new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
                style: "currency",
                currency: "EUR"
              }).format(value).replace("M", "M").replace("K", "k");
            },
            font: {
              weight: "bold",
              size: fontSize, // Menentukan ukuran font label data di sini
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "black",
              font: {
                size: fontSize, // Menentukan ukuran font untuk label sumbu x
              },
            },
            border: {
              color: "black",
            },
          },
          y: {
            min: 0,
            max: maxYValue,
            ticks: {
              stepSize: maxYValue / 5, // Menentukan langkah sumbu Y
              color: "black",
              callback: function (value) {
                return value < 1000
                  ? value
                  : new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                    style: "currency",
                    currency: "EUR"
                  }).format(value).replace("M", "M").replace("K", "k");
                },
              font: {
                size: fontSize, // Menentukan ukuran font untuk label sumbu y
              },
            },
            grid: {
              display: false,
            },
            border: {
              color: "black",
            },
          },
        },
        layout: {
          padding: {
            top: 20, // Tambahkan padding pada bagian atas layout untuk menaikkan judul
          },
        },
      },
      plugins: [ChartDataLabels], // Menambahkan plugin ChartDataLabels
    });
  }
  
  function updateLineChart2(labels, data, maxYValue) {
    const ctx = document.getElementById("lineChart2").getContext("2d");
    destroyChartIfExist("lineChart2");
  
    const fontSize = getFontSizeBasedOnScreenWidth();
  
    lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Transactions by Month",
            data: data,
            backgroundColor: "#003049",
            borderColor: "#003049",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            display: true,
            align: "end",
            color: "black",
            formatter: function (value) {
              return new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
              }).format(value).replace("M", "M").replace("K", "k");
            },
            font: {
              weight: "bold",
              size: fontSize, // Menentukan ukuran font label data di sini
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "black",
              font: {
                size: fontSize, // Menentukan ukuran font untuk label sumbu x
              },
            },
            border: {
              color: "black",
            },
          },
          y: {
            min: 0,
            max: maxYValue,
            ticks: {
              stepSize: maxYValue / 5, // Menentukan langkah sumbu Y
              color: "black",
              callback: function (value) {
                // Menampilkan nilai tanpa koma jika nilainya di bawah 1000
                return value < 1000
                  ? value
                  : new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(value).replace("M", "M").replace("K", "k");
                },
              font: {
                size: fontSize, // Menentukan ukuran font untuk label sumbu y
              },
            },
            grid: {
              display: false,
            },
            border: {
              color: "black",
            },
          },
        },
        layout: {
          padding: {
            top: 20, // Tambahkan padding pada bagian atas layout untuk menaikkan judul
          },
        },
      },
      plugins: [ChartDataLabels], // Menambahkan plugin ChartDataLabels
    });
  }
  
  // Fungsi untuk membuat stacked bar chart atau memperbarui data pada chart yang sudah ada
  function updateStackedBarChart(labels, data) {
    const ctx = document.getElementById("barChart1").getContext("2d");
    destroyChartIfExist("barChart1");
  
    const fontSize = getFontSizeBasedOnScreenWidth();
    const maxValue = getMaxValue(data);
  
    stackedBarChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Sales by Country",
            data: data,
            backgroundColor: "#003049",
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            display: true,
            align: "center",
            color: "white",
            formatter: function (value) {
              return new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
              }).format(value).replace("M", "M").replace("K", "k");
            },
            font: {
              size: fontSize, // Ukuran font
              weight: "bold",
            },
          },
        },
        scales: {
          y: {
            grid: {
              display: false,
            },
            ticks: {
              color: "black",
              font: {
                size: fontSize, // Menentukan ukuran font untuk label sumbu x
              },
            },
            border: {
              color: "black",
            },
          },
          x: {
            min: 0,
            max: maxValue + maxValue * 0.1, // Menentukan nilai maksimum berdasarkan data
            ticks: {
              stepSize: Math.ceil(maxValue / 5), // Menentukan step size
              color: "black",
              callback: function (value) {
                return new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value).replace("M", "M").replace("K", "k");
              },
              font: {
                size: fontSize, // Menentukan ukuran font untuk label sumbu x
              },
            },
            grid: {
              display: false,
            },
            border: {
              color: "black",
            },
          },
        },
      },
      plugins: [ChartDataLabels], // Menambahkan plugin ChartDataLabels
    });
  }
  
  function updateStackedBarChart2(labels, data) {
    const ctx = document.getElementById("barChart2").getContext("2d");
    destroyChartIfExist("barChart2");
  
    const fontSize = getFontSizeBasedOnScreenWidth();
    const maxValue = getMaxValue(data);
  
    stackedBarChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Total Profit by Country",
                    data: data,
                    backgroundColor: "#003049",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            indexAxis: "y",
            elements: {
                bar: {
                    borderWidth: 2,
                },
            },
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    display: true,
                    align: 'center',
                    color: 'white',
                    formatter: function (value) {
                        return new Intl.NumberFormat("en-US", {
                          notation: "compact",
                          compactDisplay: "short",
                          style: "currency",
                          currency: "EUR"
                        }).format(value).replace("M", "M").replace("K", "k");
                      },
                    font: {
                        size: fontSize, // Ukuran font
                        weight: 'bold',
                    },
                },
            },
            scales: {
                y: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: "black",
                        font: {
                            size: fontSize // Menentukan ukuran font untuk label sumbu x
                          }
                    },
                    border: {
                        color: "black"
                    }
                },
                x: {
                    min: 0,
                    max: maxValue + (maxValue * 0.1), // Menentukan nilai maksimum berdasarkan data
                    ticks: {
                        stepSize: Math.ceil(maxValue / 5), // Menentukan step size
                        color: "black",
                        callback: function (value) {
                            return new Intl.NumberFormat("en-US", {
                              notation: "compact",
                              compactDisplay: "short",
                              style: "currency",
                              currency: "EUR"
                            }).format(value).replace("M", "M").replace("K", "k");
                          },
                        font: {
                            size: fontSize // Menentukan ukuran font untuk label sumbu x
                          }
                    },
                    grid: {
                        display: false,
                    },
                    border: {
                        color: "black"
                    }
                },
            },
        },
        plugins: [ChartDataLabels] // Menambahkan plugin ChartDataLabels
    });
  }
  
  function updateHorizontalBarChart3(labels, data) {
    const ctx = document.getElementById("barChart3").getContext("2d");
    destroyChartIfExist("barChart3");
  
    const fontSize = getFontSizeBasedOnScreenWidth();
    const maxValue = getMaxValue(data);
  
    horizontalBarChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Top 10 Product Sales",
                    data: data,
                    backgroundColor: "#003049",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: "black",
                        font: {
                            size: fontSize // Menentukan ukuran font untuk label sumbu y
                          }
                    },
                    border: {
                        color:"black"
                    }
                },
                x: {
                    min: 0,
                    max: maxValue + (maxValue * 0.1), // Menentukan nilai maksimum berdasarkan data
                    ticks: {
                      stepSize: Math.ceil(maxValue / 5), // Menentukan step size
                      color: "black",
                      callback: function (value) {
                        return new Intl.NumberFormat("en-US", {
                          notation: "compact",
                          compactDisplay: "short",
                        }).format(value).replace("M", "M").replace("K", "k");
                      },
                      font: {
                        size: fontSize // Menentukan ukuran font untuk label sumbu x
                      }
                    },
                    grid: {
                      display: false,
                    },
                    border: {
                        color:"black"
                    }
                },
            },
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    display: true,
                    align: 'center',
                    color: 'white',
                    formatter: function(value) {
                        return new Intl.NumberFormat("en-US", {
                          notation: "compact",
                          compactDisplay: "short",
                        }).format(value).replace("M", "M").replace("K", "k");
                      },
                    font: {
                        size: fontSize, // Ukuran font
                        weight: 'bold',
                    },
                }
            }
        },
        plugins: [ChartDataLabels] // Menambahkan plugin ChartDataLabels
    });
  }
  
  // Fungsi untuk membuat atau memperbarui donut chart
  function updateDonutChart(labels, data) {
    const ctx = document.getElementById("doughnutChart").getContext("2d");
    destroyChartIfExist("doughnutChart");
  
    const fontSize = getFontSizeBasedOnScreenWidth();
  
    donutChart = new Chart(ctx, {
        type: "doughnut", // Mengubah tipe chart menjadi doughnut
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Total Sales by Bike Category",
                    data: data,
                    backgroundColor: [
                        "#003049",
                        "#4D6E80",
                        "#99ACB6",
                    ],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: "black",
                        usePointStyle: true,
                        pointStyle: "circle",
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw}`;
                        }
                    }
                },
                datalabels: {
                    formatter: (value, ctx) => {
                        const dataset = ctx.chart.data.datasets[0];
                        const total = dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(2) + '%';
                        return percentage; // Tampilkan hanya persentase
                    },
                    color: 'white', // Warna teks label
                    font: {
                        size: fontSize, // Ukuran font
                        weight: 'bold', // Tebal teks label
                    }
                }
            },
        },
        plugins: [ChartDataLabels] // Menambahkan plugin ChartDataLabels
    });
  }
  
  function destroyChartIfExist(chartId) {
    let chartStatus = Chart.getChart(chartId);
    if (chartStatus) {
      chartStatus.destroy(); // Hancurkan chart yang ada jika sudah ada
    }
  }
  
  function getFontSizeBasedOnScreenWidth() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 600) {
      return 5; // Ukuran font untuk mobile
    } else if (screenWidth <= 1024) {
      return 6; // Ukuran font untuk tablet
    } else {
      return 10; // Ukuran font untuk desktop
    }
  }
  
  // Fungsi untuk mendapatkan kuartal dari tanggal
  function getQuarter(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    if (month <= 3) {
      return "Quarters 1";
    } else if (month <= 6) {
      return "Quarters 2";
    } else if (month <= 9) {
      return "Quarters 3";
    } else {
      return "Quarters 4";
    }
  }
  
  // Fungsi untuk mendapatkan nilai maksimum dari data
  function getMaxValue(data) {
    return Math.max(...data);
  }
  