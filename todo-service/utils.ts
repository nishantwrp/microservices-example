import * as grpc from "@grpc/grpc-js";

export const grpcFunctionWrap = <reqType, responseType>(grpcFunction: (req: reqType) => Promise<responseType>) => {
    return async (call: grpc.ServerUnaryCall<reqType, responseType>, callback: grpc.requestCallback<responseType>) => {
        try {
            const response = await grpcFunction(call.request);
            callback(null, response);
        } catch (err: any) {
            callback({
                code: grpc.status.ABORTED,
                message: err.message || err,
            } as any);
        }
    }
}
