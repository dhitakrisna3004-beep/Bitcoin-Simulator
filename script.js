const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

let price = 100000;
let prices = [price];

let cash = 10000;
let btc = 0;

let running = true;
let marketMode = "neutral"; // bull / bear / neutral

const newsList = [
  { text: "📈 ETF Bitcoin disetujui!", effect: 1.1 },
  { text: "📉 Exchange besar diretas!", effect: 0.85 },
  { text: "🐋 Whale membeli BTC besar-besaran!", effect: 1.2 },
  { text: "🌎 Negara mulai adopsi Bitcoin!", effect: 1.15 },
  { text: "💥 Regulasi ketat diumumkan!", effect: 0.8 }
];

function randomNews() {
  if (Math.random() < 0.08) {
    const n = newsList[Math.floor(Math.random() * newsList.length)];
    document.getElementById("news").textContent = n.text;
    price *= n.effect;
  }
}

function updateMarket() {
  if (!running) return;

  let change = (Math.random() - 0.5) * 0.02;

  // bull / bear influence
  if (marketMode === "bull") change += 0.01;
  if (marketMode === "bear") change -= 0.01;

  // 🚀 mega pump
  if (Math.random() < 0.005) {
    change += 0.3 + Math.random() * 0.7;
    alert("🚀 MEGA PUMP!");
  }

  // 💥 mega crash
  if (Math.random() < 0.005) {
    change -= 0.3 + Math.random() * 0.7;
    alert("💥 BLACK SWAN CRASH!");
  }

  // 🐋 whale event
  if (Math.random() < 0.01) {
    let whale = Math.random() > 0.5 ? 0.2 : -0.2;
    change += whale;
  }

  price *= (1 + change);

  if (price < 500) price = 500;

  prices.push(price);
  if (prices.length > 120) prices.shift();

  updateUI(change);
  drawChart();
  randomNews();

  // random market cycle change
  if (Math.random() < 0.01) switchMarket();
}

function switchMarket() {
  const modes = ["bull", "bear", "neutral"];
  marketMode = modes[Math.floor(Math.random() * 3)];

  document.getElementById("marketState").textContent =
    "Market: " + marketMode.toUpperCase();
}

function updateUI(change) {
  document.getElementById("price").textContent =
    "$" + Math.round(price).toLocaleString();

  let pct = change * 100;

  const el = document.getElementById("change");
  el.textContent = pct.toFixed(2) + "%";
  el.className = pct >= 0 ? "green" : "red";

  document.getElementById("cash").textContent =
    "$" + cash.toFixed(2);

  document.getElementById("btc").textContent =
    btc.toFixed(4);

  let total = cash + btc * price;

  document.getElementById("total").textContent =
    "$" + total.toFixed(2);
}

function drawChart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let max = Math.max(...prices);
  let min = Math.min(...prices);

  ctx.beginPath();

  for (let i = 0; i < prices.length; i++) {
    let x = i * (canvas.width / (prices.length - 1));
    let y = canvas.height -
      ((prices[i] - min) / (max - min || 1)) * canvas.height;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.strokeStyle = "lime";
  ctx.stroke();
}

// trading
function buy() {
  let amount = 0.01;
  let cost = amount * price;

  if (cash >= cost) {
    cash -= cost;
    btc += amount;
  }
}

function sell() {
  let amount = 0.01;

  if (btc >= amount) {
    btc -= amount;
    cash += amount * price;
  }
}

function toggle() {
  running = !running;
}

function resetMarket() {
  price = 100000;
  prices = [price];
  cash = 10000;
  btc = 0;
}

// loop
setInterval(updateMarket, 800);
drawChart();