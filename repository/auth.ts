import { connectMongoDb } from "../config/mongodb";
import * as Models from "../models";

export class Authentication {
  private db: any = {};
  private userRepo: any;
  private recruiterRepo: any;
  private roleRepo: any;
  private userRoleRepo: any;

  constructor() {
    // this.init();
  }

  // private async init() {
  // try {
  // this.db = await connectMongoDb(); // Wait for connectMssqlDb to resolve
  // this.userRepo = await this.db.sequelize.getRepository(Models.User);
  // this.recruiterRepo = await this.db.sequelize.getRepository(
  //   Models.Recruiter
  // );
  // this.roleRepo = await this.db.sequelize.getRepository(Models.Role);
  // this.userRoleRepo = await this.db.sequelize.getRepository(
  //   Models.UserRole
  // );
  // } catch (error) {
  //   console.error("Error initializing Authentication:", error);
  // Handle the error appropriately
  //     throw error; // Ensure that the error is propagated to the caller
  //   }
  // }

  async getUserDetails(email: string) {
    try {
      if (!this.userRepo) {
        throw new Error("User Repository not initialized.");
      }

      let getUser = await this.userRepo.findOne({ where: { Email: email } });
      return getUser;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getRecruiterDetails(email: string) {
    try {
      if (!this.recruiterRepo) {
        throw new Error("Recruiter Repository not initialized.");
      }

      let getRecruiterDetails = await this.recruiterRepo.findOne({
        where: { Email: email },
      });
      return getRecruiterDetails;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
