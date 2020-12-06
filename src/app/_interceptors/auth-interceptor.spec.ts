import { AuthInterceptor } from './auth-interceptor';
import { throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { LoginPage } from '../login/login.page';

describe('AuthInterceptor', () => {
    let service;
    let router: Router;

    beforeEach(() => {
        service = jasmine.createSpyObj('AuthenticationService', ['reloginIfPossible']);

        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'login', component: LoginPage }
                ]),
            ]
        });

        router = TestBed.inject(Router);
    });

    it('should create interceptor', () => {
        const authInterceptor = new AuthInterceptor(router, service);
        expect(authInterceptor).toBeTruthy();
    })

    it('should navigate to login page if login is not possible', (done) => {
        service.reloginIfPossible.and.returnValue(Promise.reject('something went wrong'));

        const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

        const httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['url']);
        httpRequestSpy.url = '/some-url';

        const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
        httpHandlerSpy.handle.and.returnValue(throwError({ status: 401 }));

        const authInterceptor = new AuthInterceptor(router, service);
        authInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
            complete: () => {
                expect(navigateByUrlSpy).toHaveBeenCalledWith('/login');
                done();
            }
        });
    });

    it('should handle request if relogin is possible', (done) => {
        service.reloginIfPossible.and.returnValue(Promise.resolve());

        const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

        const httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['url']);
        httpRequestSpy.url = '/some-url';

        const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
        httpHandlerSpy.handle.and.returnValue(throwError({ status: 401 }));

        const authInterceptor = new AuthInterceptor(router, service);
        authInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
            complete: () => { 
                expect(navigateByUrlSpy).not.toHaveBeenCalled();
                done();
            }
        });
    });

    it('should throw error for all other error status codes than 401 and 403', () => {
        const httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['url']);
        httpRequestSpy.url = '/some-url';

        const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
        httpHandlerSpy.handle.and.returnValue(throwError({ status: 500 }));

        const authInterceptor = new AuthInterceptor(router, service);
        authInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
            error: reason => { 
                expect(reason).toBeTruthy();
            }
        });
    });


    it('should throw error for login requests', () => {
        const httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['url']);
        httpRequestSpy.url = '/login';

        const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
        httpHandlerSpy.handle.and.returnValue(throwError({ status: 401 }));

        const authInterceptor = new AuthInterceptor(router, service);
        authInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
            error: reason => { 
                expect(reason).toBeTruthy();
            }
        });
    });

});