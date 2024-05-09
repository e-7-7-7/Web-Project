class responseRepo {
  static success(data) {
    return Response.json({
      success: true,
      data: data,
      error: null,
    });
  }
  static error(message) {
    return Response.json(
      { success: false, error: message, data: null },
      { status: 422 }
    );
  }
}

export default responseRepo;
