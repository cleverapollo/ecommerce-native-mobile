import { BehaviorSubject } from "rxjs";

export class MockAuthService {
    isEmailVerified = new BehaviorSubject<boolean>(true)
}