import BarGraph from "@/app/charts/BarGraph";
import readRadarRepo from "@/app/repo/readradar_repo";
export default async function TopBooksBySales() {
  const AverageQuantitySoldPerBook =
    await readRadarRepo.getAverageQuantitySoldPerBook();
  const AverageQuantitySoldPerBookLaples = [];
  const AverageQuantitySoldPerBookDataset = [];
  AverageQuantitySoldPerBook.forEach((data) => {
    AverageQuantitySoldPerBookLaples.push(data.bookId);
    AverageQuantitySoldPerBookDataset.push(data._avg.amount);
  });
  return (
    <div>
      <h1> Average Quantity Sold PerBook</h1>
      <BarGraph
        lable={AverageQuantitySoldPerBookLaples}
        dataset={AverageQuantitySoldPerBookDataset}
      />
    </div>
  );
}
