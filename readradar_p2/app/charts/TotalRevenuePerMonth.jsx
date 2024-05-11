import BarGraph from "@/app/charts/BarGraph";
import readRadarRepo from "@/app/repo/readradar_repo";
export default async function TotalRevenuePerMonth() {
  const TotalRevenuePerMonth = await readRadarRepo.getTotalRevenuePerMonth(
    2024
  );
  const TotalRevenuePerMonthLaples = [];
  const TotalRevenuePerMonthDataset = [];
  Object.entries(TotalRevenuePerMonth).forEach(([month, count]) => {
    TotalRevenuePerMonthLaples.push(month);
    TotalRevenuePerMonthDataset.push(count);
  });
  return (
    <div style={{ fontSize: '10px' ,margin:"3rem"}}>
      <h1> Total Revenue Per Month</h1>
      <BarGraph
        lable={TotalRevenuePerMonthLaples}
        dataset={TotalRevenuePerMonthDataset}
      />
    </div>
  );
}
