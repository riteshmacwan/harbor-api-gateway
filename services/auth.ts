import { Authentication } from "../repository";

export class AuthService {
    private authRepository: Authentication;

    constructor() {
        this.authRepository = new Authentication();
    }

    async getUserDetails(email: string) {
        return await this.authRepository.getUserDetails(email);
    }

    async getRecruiterDetails(email: string) {
        return await this.authRepository.getRecruiterDetails(email);
    }

    async getUserRole(Id : string){
        return await this.authRepository.getUserRole(Id);
    }
}