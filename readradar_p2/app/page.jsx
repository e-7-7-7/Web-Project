import TotalRevenuePerMonth from "@/app/charts/TotalRevenuePerMonth";
import AveragePurchaseAmountPerBuyer from "@/app/charts/AveragePurchaseAmountPerBuyer";
import TopBooksBySales from "@/app/charts/TopBooksBySales";
import AverageQuantitySoldPerBook from "@/app/charts/AverageQuantitySoldPerBook";
import CountTransactionsPerSeller from "@/app/charts/countTransactionsPerSeller";
export default async function home() {
  return (
    <div>
      <TopBooksBySales />
      <AverageQuantitySoldPerBook />
      <AveragePurchaseAmountPerBuyer />
      <CountTransactionsPerSeller />
      <TotalRevenuePerMonth />
    </div>
  );
}
