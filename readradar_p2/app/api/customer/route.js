import responseRepo from "@/app/api/response";
import readRadarRepo from "@/app/repo/readradar_repo";

export async function PUT(request) {
    const customer =  await request.json()
  try {
    return responseRepo.success(
      await readRadarRepo.UpdateCustomer(customer)
    );
  } catch (error) {
    return responseRepo.error(error.message);
  }
}
