const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function trafficLight() {
  const seq = [
    {
      color: "red",
      time: 3000,
    },
    {
      color: "green",
      time: 2000,
    },
    {
      color: "yellow",
      time: 1000,
    },
  ];

  while (true) {
    for (const { color, ms } of seq) {
      console.log(color);
      await sleep(ms);
    }
  }
}

trafficLight();
