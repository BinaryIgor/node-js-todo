import { assert } from "chai";
import { NotFoundError, ValidationError } from "../src/common/errors";

export function assertErrorResponse(requestResponse: any, expectedErrorType: any, expectedStatus: number) {
    assert.equal(requestResponse.status, expectedStatus);
    assert.include(requestResponse.body.errors, expectedErrorType.name);
}

export function assertValidationErrorResponse(requestResponse: any, expectedErrorType: any = ValidationError) {
    assertErrorResponse(requestResponse, expectedErrorType, 400);
}

export function assertNotFoundErrorResponse(requestResponse: any) {
    assertErrorResponse(requestResponse, NotFoundError, 404);
}

export function assertJsonResponse<T>(requestResponse: any, bodyAssert: (body: T) => void, responseCode = 200) {
    assert.equal(requestResponse.statusCode, responseCode);
    assert.isTrue(requestResponse.header['content-type'].startsWith("application/json"));
    bodyAssert(requestResponse.body)
}