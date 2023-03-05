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