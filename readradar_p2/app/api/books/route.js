import responseRepo from "@/app/api/response";
import readRadarRepo from "@/app/repo/readradar_repo";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let currentUserID = searchParams.get("currentUserID");
  let sellerId = searchParams.get("sellerId");
  let userId = searchParams.get("userId");
  let searchWord = searchParams.get("searchWord");
  let bookId = searchParams.get("bookId");
  const addtion_include = {
    transactions: {
      include: {
        Book: {
          include: {
            Seller: {
              include: {
                User: {
                  select: {
                    id: true,
                    username: true,
                    firstname: true,
                    surname: true,
                  },
                },
              },
            },
          },
        },
        Customer: { include: { shipping_address: true } },
      },
    },
  };
  try {
    const user = await readRadarRepo.getUser({ id: currentUserID });
    if (user.role === "Admin") {
      return responseRepo.success(
        await readRadarRepo.getBooks({}, addtion_include)
      );
    } else {
      return responseRepo.success(
        await readRadarRepo.getBooks(
          {
            isApproved: !sellerId && !userId ? true : undefined,
            sellerId: sellerId ? +sellerId : undefined,
            title: searchWord ? { contains: searchWord } : undefined,
            id: bookId ? +bookId : undefined,
            Seller: userId
              ? {
                  userId: userId,
                }
              : undefined,
          },
          userId ? addtion_include : {}
        )
      );
    }
  } catch (error) {
    return responseRepo.error(error.message);
  }
}
export async function POST(request) {
  try {
    return responseRepo.success(
      await readRadarRepo.createBook(await request.json())
    );
  } catch (error) {
    return responseRepo.error(error.message);
  }
}

export async function PUT(request) {
  try {
    return responseRepo.success(
      await readRadarRepo.UpdateBook(await request.json())
    );
  } catch (error) {
    return responseRepo.error(error.message);
  }
}

export async function DELETE(request) {
  try {
    return responseRepo.success(
      await readRadarRepo.deleteBook((await request.json()).id)
    );
  } catch (error) {
    return responseRepo.error(error.message);
  }
}
