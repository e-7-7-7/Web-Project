import readRadarRepo from "@/app/repo/readradar_repo";

export default async function UserCounts() {
  const sellerCount = await readRadarRepo.getSellerCount();
  const customerCount = await readRadarRepo.getCustomerCount();

  return (
<div style={{ fontSize: '14px' ,margin:"3rem"}}>
  <h1>User Counts</h1>
  <p>
    <strong style={{ fontSize: 'larger', fontWeight: 'bold' }}>Number of Sellers:</strong> {sellerCount}
  </p>
  <p>
    <strong style={{ fontSize: 'larger', fontWeight: 'bold' }}>Number of Customers:</strong> {customerCount}
  </p>
</div>
  );
}