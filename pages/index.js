import { useState } from "react";
import CoinList from "../components/CoinList";
import SearchBar from "../components/SearchBar";
import Layout from "../components/Layout";
import Pagination from "@material-ui/lab/Pagination";

export default function Home({ filteredCoins }) {
  const allCoins = filteredCoins.filter((coin) => coin.name.toLowerCase());
  const [page, setPage] = useState(1);

  return (
    <Layout>
      <div className="coin_app">
        <CoinList
          filteredCoins={allCoins.slice((page - 1) * 10, (page - 1) * 10 + 10)}
        />
      </div>

      <Pagination
        count={(filteredCoins.length / 10).toFixed(0)}
        style={{
          padding: 20,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
        onChange={(_, value) => {
          setPage(value);
          window.scroll(0, 450);
        }}
      />
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=try&order=market_cap_desc&per_page=100&page={setPage}&sparkline=false"
  );

  const filteredCoins = await res.json();

  return {
    props: {
      filteredCoins,
    },
  };
};
