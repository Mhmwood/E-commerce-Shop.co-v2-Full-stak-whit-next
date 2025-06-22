import { NextRequest, NextResponse } from "next/server";
import { handlePrismaError } from "./errHandle";

export const createAsyncRoute = (
  handler: (
    request: NextRequest,
    params?: { [key: string]: string }
  ) => Promise<NextResponse>
) => {
  return async (
    request: NextRequest,
    context?: { params?: Promise<{ [key: string]: string }> }
  ) => {
    try {
      const params = context?.params ? await context.params : undefined;
      return await handler(request, params);
    } catch (error) {
      console.log(error);
      const handledError = handlePrismaError(error);
      return NextResponse.json(handledError, {
        status: handledError.status || 500,
      });
    }
  };
};
