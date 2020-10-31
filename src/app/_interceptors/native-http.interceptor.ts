import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpHeaders
} from "@angular/common/http";
import { Observable, from } from "rxjs";
import { Platform } from "@ionic/angular";
import { HTTP } from "@ionic-native/http/ngx";

type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "head"
  | "delete"
  | "upload"
  | "download";

@Injectable()
export class NativeHttpInterceptor implements HttpInterceptor {
  constructor(private nativeHttp: HTTP, private platform: Platform) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.platform.is("cordova")) {
      return next.handle(request);
    }

    return from(this.handleNativeRequest(request));
  }

  private async handleNativeRequest(
    request: HttpRequest<any>
  ): Promise<HttpResponse<any>> {
    const headers = this.createRequestHeaders(request);

    try {
      await this.platform.ready();
      const nativeHttpResponse = await this.sendRequest(request, headers);
      const response = this.createResponse(nativeHttpResponse);
      return Promise.resolve(response);
    } catch (error) {
      if (!error.status) {
        return Promise.reject(error);
      }
      const response = this.createErrorResponse(error);
      return Promise.reject(response);
    }
  }

  private createRequestHeaders(request: HttpRequest<any>) {
    const headerKeys = request.headers.keys();
    const headers = {};
    headerKeys.forEach(key => {
      headers[key] = request.headers.get(key);
    });
    this.logRequestHeaders(request);
    return headers;
  }

  private async sendRequest(request: HttpRequest<any>, headers: {}) {
    const method = <HttpMethod>request.method.toLowerCase();
    const url = this.createEncodedUrlFromRequest(request);
    this.logRequestBody(request);
    const nativeHttpResponse = await this.nativeHttp.sendRequest(url, {
      method: method,
      data: request.body,
      headers: headers,
      serializer: "json"
    });
    return nativeHttpResponse;
  }

  private createEncodedUrlFromRequest(request: HttpRequest<any>) {
    const queryParams = request.params;
    const invalidQueryParams = !queryParams || (Object.keys(queryParams).length === 0 && queryParams.constructor === Object);
    let url = request.url;
    if (!invalidQueryParams) {
      url = `${url}?${queryParams.toString()}`;
    }
    this.logUrl(url);
    return encodeURI(url);
  }

  private createResponse(nativeHttpResponse) {
    const body = this.parseBodyFromResponseAsJson(nativeHttpResponse);
    const responseHeaders = this.createResponseHeaders(nativeHttpResponse);
    const response = new HttpResponse({
      body: body,
      status: nativeHttpResponse.status,
      headers: responseHeaders,
      url: nativeHttpResponse.url
    });
    this.logResponse(response);
    return response;
  }

  private parseBodyFromResponseAsJson(nativeHttpResponse) {
    let body;
    try {
      body = JSON.parse(nativeHttpResponse.data);
    } catch (error) {
      body = { response: nativeHttpResponse.data };
    }
    return body;
  }

  private createResponseHeaders(nativeHttpResponse) {
    let responseHeaders = new HttpHeaders();
    for (const header in nativeHttpResponse.headers) {
      if (nativeHttpResponse.headers.hasOwnProperty(header)) {
        const value = nativeHttpResponse.headers[header];
        responseHeaders.set("header", value);
      }
    }
    return responseHeaders;
  }

  private createErrorResponse(error: any) {
    this.logError(error);
    return new HttpResponse({
      body: JSON.parse(error.error),
      status: error.status,
      headers: error.headers,
      url: error.url
    });
  }

  // logging

  private logUrl(url: string) {
    console.info("— Request url");
    console.info(url);
  }

  private logRequestBody(request: HttpRequest<any>) {
    console.info("— Request body");
    console.info(request.body);
  }

  private logRequestHeaders(request: HttpRequest<any>) {
    console.info("— Request headers");
    console.info(request.headers);
  }

  private logResponse(response: HttpResponse<any>) {
    console.info("— Response success");
    console.info(response);
  }

  private logError(error: any) {
    console.error("— Response error");
    console.error(error);
  }
}
