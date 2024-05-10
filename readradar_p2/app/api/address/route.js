import responseRepo from "@/app/api/response";
import readRadarRepo from "@/app/repo/readradar_repo";

export async function PUT(request) {
    const address =  await request.json()
  try {
    return responseRepo.success(
      await readRadarRepo.updateAddress(address)
    );
  } catch (error) {
    return responseRepo.error(error.message);
  }
}
