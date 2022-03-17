import Link from "next/link";
import Layout from "../../components/Layout";
import styles from "./Coin.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const Coin = ({ coin, chart }) => {
  return (
    <Layout>
      <div className={styles.coin_page}>
        <div className={styles.coin_container}>
          <img
            src={coin.image.large}
            alt={coin.name}
            className={styles.coin_image}
          />
          <h1 className={styles.coin_name}>{coin.name}</h1>
          <h1 className={styles.coin_name}>{coin.market_cap}</h1>
          <p className={styles.coin_ticker}>{coin.symbol}</p>
          <p className={styles.coin_current}>
            {coin.market_data.current_price.try
              .toString()
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
            ₺
          </p>
          <>
            <Line data={chart} />
          </>
          <>
            <Link href="/coin/[id]/daily" as={`/coin/${coin.name}/daily`}>
              <a>Günlük</a>
            </Link>
            <Link href="/coin/[id]/weekly" as={`/coin/${coin.name}/weekly`}>
              <a>Haftalık</a>
            </Link>
            <Link href="/coin/[id]/monthly" as={`/coin/${coin.name}/daily`}>
              <a>Aylık</a>
            </Link>
          </>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  let a = [];
  let b = [];
  const month = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];

  const { id } = context.query;
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
  const resGraph = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=try&days=1&interval=1000`
  );
  const data = await res.json();
  const resGraphData = await resGraph.json();

  resGraphData.prices
    .toString()
    .split(",")
    .map((value, i) => {
      if (i % 2 === 0) {
        const d = new Date(parseInt(value));
        const c =
          d.getDate() +
          "  " +
          month[d.getMonth()] +
          " - " +
          d.getUTCHours() +
          ":" +
          d.getUTCMinutes();
        a.push(c);
      } else {
        b.push(value);
      }
    });

  const RGData = {
    labels: a,
    datasets: [
      {
        label: "Fiyatı",
        data: b,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "#ed9519",
        color: "#fff",
      },
    ],
  };

  return {
    props: {
      coin: data,
      chart: RGData,
    },
  };
}

export default Coin;
