import BarGraph from "@/app/charts/BarGraph";
import readRadarRepo from "@/app/repo/readradar_repo";
export default async function AveragePurchaseAmountPerBuyer() {
  const AveragePurchaseAmountPerBuyer =
    await readRadarRepo.getAveragePurchaseAmountPerBuyer();
  const AveragePurchaseAmountPerBuyerLaples = [];
  const AveragePurchaseAmountPerBuyerDataset = [];
  AveragePurchaseAmountPerBuyer.forEach((data) => {
    AveragePurchaseAmountPerBuyerLaples.push(data.customerId);
    AveragePurchaseAmountPerBuyerDataset.push(data._avg.amount);
  });
  return (
    <div style={{ fontSize: '10px' ,margin:"3rem"}}>
      <h1> Average Purchase Amount Per Buyer</h1>
      <BarGraph
        lable={AveragePurchaseAmountPerBuyerLaples}
        dataset={AveragePurchaseAmountPerBuyerDataset}
      />
    </div>
  );
}
