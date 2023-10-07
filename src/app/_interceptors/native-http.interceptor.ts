import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@awesome-cordova-plugins/http/ngx';
import { Logger } from '@core/services/log.service';
import { PlatformService } from '@core/services/platform.service';
import { Observable, from } from 'rxjs';

type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'head'
  | 'delete'
  | 'upload'
  | 'download';

type Serializer = 'json' | 'urlencoded' | 'utf8' | 'multipart' | 'raw'
type ResponseType = 'text' | 'arraybuffer' | 'blob' | 'json';
type Headers = {
  [index: string]: string;
}
type Params = {
  [index: string]: string | number;
}
type JsonBody = {
  [index: string]: any;
}

type NativeHttpRequestOptions = {
  method: HttpMethod;
  data?: JsonBody;
  params?: Params;
  serializer?: Serializer;
  timeout?: number;
  headers?: Headers;
  filePath?: string | string[];
  name?: string | string[];
  responseType?: ResponseType;
}

@Injectable()
export class NativeHttpInterceptor implements HttpInterceptor {

  constructor(
    private nativeHttp: HTTP,
    private platform: PlatformService,
    private logger: Logger
  ) { }

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.platform.isNativePlatform ?
      from(this.handleNativeRequest(request)) :
      next.handle(request);
  }

  private async handleNativeRequest(
    request: HttpRequest<any>
  ): Promise<HttpResponse<any>> {
    const headers = this._createRequestHeaders(request);

    try {
      await this.platform.isReady();
      return this._createResponse(await this._sendRequest(request, headers));
    } catch (error: any) {
      if (!error?.status) {
        this._logError(error);
        throw error;
      }
      const response = this._createErrorResponse(error);
      return Promise.reject(response);
    }
  }

  private _createRequestHeaders(request: HttpRequest<any>): Headers {
    const headerKeys = request.headers.keys();
    const headers: Headers = {};
    headerKeys.forEach(key => {
      const value = request.headers.get(key);
      if (value) {
        headers[key] = value;
      }
    });
    this._logRequestHeaders(request);
    return headers;
  }

  private async _sendRequest(request: HttpRequest<any>, headers: {}): Promise<HTTPResponse> {
    const method = request.method.toLowerCase() as HttpMethod;
    const url = this._createEncodedUrlFromRequest(request);
    this._logRequestBody(request);

    const options: NativeHttpRequestOptions = {
      method,
      headers,
      serializer: 'json',
      data: request.body,
      responseType: request.responseType
    }

    if (request.body === null) {
      options.serializer = 'utf8';
      options.data = 'null' as any;
    } else if (request.body instanceof ArrayBuffer) {
      options.serializer = 'raw';
    }

    return this.nativeHttp.sendRequest(url, options);
  }

  private _createEncodedUrlFromRequest(request: HttpRequest<any>): string {
    const queryParams = request.params?.toString();
    let url = request.url;
    if (queryParams && queryParams.length > 0) {
      url = `${url}?${queryParams.toString()}`;
    }
    this._logUrl(url);
    return url;
  }

  private _createResponse(nativeHttpResponse: HTTPResponse): HttpResponse<any> {
    const body = this._parseBodyFromResponseAsJson(nativeHttpResponse);
    const response = new HttpResponse({
      body,
      status: nativeHttpResponse.status,
      headers: new HttpHeaders(nativeHttpResponse.headers),
      url: nativeHttpResponse.url
    });
    this._logResponse(response);
    return response;
  }

  private _parseBodyFromResponseAsJson(nativeHttpResponse: HTTPResponse) {
    let body = { response: null };
    if (nativeHttpResponse.data) {
      try {
        body = JSON.parse(nativeHttpResponse.data);
      } catch (error) {
        body = nativeHttpResponse.data;
      }
    }
    return body;
  }

  private _createErrorResponse(error: any) {
    this._logError(error);
    return new HttpErrorResponse({
      error: error.error,
      status: error.status,
      headers: error.headers,
      url: error.url
    });
  }

  // logging

  private _logUrl(url: string): void {
    this.logger.info('— Request url', url);
  }

  private _logRequestBody(request: HttpRequest<unknown>): void {
    this.logger.info('— Request body');
    this.logger.info(JSON.stringify(request.body));
  }

  private _logRequestHeaders(request: HttpRequest<unknown>): void {
    this.logger.info('— Request headers');
    this.logger.info(JSON.stringify(request.headers));
  }

  private _logResponse(response: HttpResponse<unknown>): void {
    this.logger.info('— Response');
    this.logger.info(response);
  }

  private _logError(error: unknown): void {
    this.logger.error('— Response error');
    this.logger.error(JSON.stringify(error));
  }
}
