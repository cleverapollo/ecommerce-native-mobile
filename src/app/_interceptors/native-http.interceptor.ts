import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor,
  HttpRequest, HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Logger } from '@core/services/log.service';
import { PlatformService } from '@core/services/platform.service';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
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

  constructor(
    private nativeHttp: HTTP,
    private platform: PlatformService,
    private logger: Logger
  ) { }

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const handleNativeRequest = this.platform.isNativePlatform &&
      !(request.body instanceof FormData)
    return handleNativeRequest ?
      from(this.handleNativeRequest(request)) :
      next.handle(request);
  }

  private async handleNativeRequest(
    request: HttpRequest<any>
  ): Promise<HttpResponse<any>> {
    const headers = this.createRequestHeaders(request);

    try {
      await this.platform.isReady();
      const nativeHttpResponse = await this.sendRequest(request, headers)
        .then();
      return this.createResponse(nativeHttpResponse);
    } catch (error) {
      if (!error.status) {
        this.logError(error);
        throw error;
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
    const method = request.method.toLowerCase() as HttpMethod;
    const url = this.createEncodedUrlFromRequest(request);
    this.logRequestBody(request);

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
    }

    return this.nativeHttp.sendRequest(url, options);
  }

  private createEncodedUrlFromRequest(request: HttpRequest<any>): string {
    const queryParams = request.params?.toString();
    let url = request.url;
    if (queryParams && queryParams.length > 0) {
      url = `${url}?${queryParams.toString()}`;
    }
    this.logUrl(url);
    return url;
  }

  private createResponse(nativeHttpResponse: HTTPResponse): HttpResponse<any> {
    const body = this.parseBodyFromResponseAsJson(nativeHttpResponse);
    const response = new HttpResponse({
      body,
      status: nativeHttpResponse.status,
      headers: new HttpHeaders(nativeHttpResponse.headers),
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
        body = nativeHttpResponse.data;
      }
    }
    return body;
  }

  private createErrorResponse(error: any) {
    this.logError(error);
    return new HttpErrorResponse({
      error: error.error,
      status: error.status,
      headers: error.headers,
      url: error.url
    });
  }

  // logging

  private logUrl(url: string) {
    this.logger.info('— Request url', url);
  }

  private logRequestBody(request: HttpRequest<any>) {
    this.logger.info('— Request body');
    this.logger.info(request.body);
  }

  private logRequestHeaders(request: HttpRequest<any>) {
    this.logger.info('— Request headers');
    this.logger.info(request.headers);
  }

  private logResponse(response: HttpResponse<any>) {
    this.logger.info('— Response');
    this.logger.info(response);
  }

  private logError(error: any) {
    this.logger.error('— Response error');
    this.logger.error(error);
  }
}
