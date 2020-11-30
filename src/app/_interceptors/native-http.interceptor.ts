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
import { HTTP, HTTPResponse } from "@ionic-native/http/ngx";

type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "head"
  | "delete"
  | "upload"
  | "download";

type NativeHttpRequestOptions = {
  method: 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete' | 'options' | 'upload' | 'download';
  data?: {
      [index: string]: any;
  };
  params?: {
      [index: string]: string | number;
  };
  serializer?: 'json' | 'urlencoded' | 'utf8' | 'multipart';
  timeout?: number;
  headers?: {
      [index: string]: string;
  };
  filePath?: string | string[];
  name?: string | string[];
  responseType?: 'text' | 'arraybuffer' | 'blob' | 'json';
}

@Injectable()
export class NativeHttpInterceptor implements HttpInterceptor {
  constructor(private nativeHttp: HTTP, private platform: Platform) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.platform.is("capacitor")) {
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

  private async sendRequest(request: HttpRequest<any>, headers: {}): Promise<HTTPResponse> {
    const method = <HttpMethod>request.method.toLowerCase();
    const url = this.createEncodedUrlFromRequest(request);
    this.logRequestBody(request);

    let options: NativeHttpRequestOptions = {
      method: method,
      headers: headers,
      serializer: 'json',
      data: request.body,
      responseType: request.responseType
    }
    if (request.body === null) {
      options.serializer = 'utf8';
      options.data = 'null' as any;
    }

    return await this.nativeHttp.sendRequest(url, options);
  }

  private createEncodedUrlFromRequest(request: HttpRequest<any>) {
    const queryParams = request.params?.toString();
    let url = request.url;
    if (queryParams && queryParams.length > 0) {
      url = `${url}?${queryParams.toString()}`;
    }
    this.logUrl(url);
    return encodeURI(url);
  }

  private createResponse(nativeHttpResponse: HTTPResponse) {
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

  private parseBodyFromResponseAsJson(nativeHttpResponse: HTTPResponse) {
    let body = { response: null };
    if (nativeHttpResponse.data) {
      try {
        body = JSON.parse(nativeHttpResponse.data);
      } catch (error) {
        body = { response: nativeHttpResponse.data };
      }
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
