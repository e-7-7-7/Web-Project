import responseRepo from "@/app/api/response";
import readRadarRepo from "@/app/repo/readradar_repo";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let currentUserID = searchParams.get("currentUserID");
  try {
    return responseRepo.success(
      await readRadarRepo.getUser({ id: currentUserID })
    );
  } catch (error) {
    return responseRepo.error(error.message);
  }
}

export async function POST(request) {
  try {
    return responseRepo.success(
      await readRadarRepo.Login(await request.json())
    );
  } catch (error) {
    return responseRepo.error(error.message);
  }
}
