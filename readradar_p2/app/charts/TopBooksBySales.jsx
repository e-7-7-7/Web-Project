import BarGraph from "@/app/charts/BarGraph";
import readRadarRepo from "@/app/repo/readradar_repo";
export default async function TopBooksBySales() {
  const getTopBooksBySales = await readRadarRepo.getTopBooksBySales();
  const getTopBooksBySalesLaples = [];
  const getTopBooksBySalesDataset = [];
  getTopBooksBySales.forEach((data) => {
    getTopBooksBySalesLaples.push(data.bookId);
    getTopBooksBySalesDataset.push(data._sum.amount);
  });
  return (
    <div>
      <h1>Top Books By Sales</h1>
      <BarGraph
        lable={getTopBooksBySalesLaples}
        dataset={getTopBooksBySalesDataset}
      />
    </div>
  );
}
