import request from 'supertest';

const GET = "GET";
const POST = "POST";
const PUT = "PUT";
const PATCH = "PATCH";
const DELETE = "DELETE";

export class TestHttpClient {

    constructor(readonly url: string, private _accessToken?: string) { }

    set accessToken(token: string) {
        this._accessToken = token;
    }

    executeRequest(path: string, {
        method = "GET",
        query = {},
        headers = {},
        body = {}
    } = {}) {
        let req: any = this.requestWithMethod(request(this.url), method.toUpperCase(), path);

        if (query) {
            req = req.query(query);
        }

        if (this._accessToken) {
            req.set("Authorization", `Bearer ${this._accessToken}`);
        }

        if (headers) {
            for (const [k, v] of Object.entries(headers)) {
                req.set(k, v);
            }
        }
        if (body) {
            req.send(body);
        }

        return req;
    }

    private requestWithMethod(req: any, method: string, path: string) {
        if (method == GET) return req.get(path);
        if (method == POST) return req.post(path);
        if (method == PUT) return req.put(path);
        if (method == PATCH) return req.patch(path);
        if (method == DELETE) return req.delete(path);

        throw new Error(`Method: ${method} is not supported`);
    }

}