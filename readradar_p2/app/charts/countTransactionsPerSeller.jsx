import BarGraph from "@/app/charts/BarGraph";
import readRadarRepo from "@/app/repo/readradar_repo";
export default async function CountTransactionsPerSeller() {
  const countTransactionsPerSeller =
    await readRadarRepo.countTransactionsPerSeller();
  const countTransactionsPerSellerLaples = [];
  const countTransactionsPerSellerDataset = [];
  countTransactionsPerSeller.forEach((data) => {
    countTransactionsPerSellerLaples.push(data.sellerId);
    countTransactionsPerSellerDataset.push(data.transactionCount);
  });
  return (
    <div>
      <h1> count Transactions Per Seller</h1>
      <BarGraph
        lable={countTransactionsPerSellerLaples}
        dataset={countTransactionsPerSellerDataset}
      />
    </div>
  );
}
