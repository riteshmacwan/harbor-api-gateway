import { Request, Response } from "express";
import { DepartmentService } from "../service/department";
import {
  DepartmentBody,
  DepartmentData,
  DepartmentDelete,
} from "../types/department";
import { AuthService } from "services";

/**
 * Controller class responsible for handling operations related to auth service.
 */
export class AuthController {
  /**
   * Service responsible for managing authentication data.
   * @private
   */
  private authService: AuthService;



  /**
   * Creates an instance of AuthController.
   * Initializes the authService for interacting with authentication data.
   * @constructor
   */
  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Creates a user based on the request body.
   * @async
   * @function - createDepartment
   * @param {Request<{}, {}, DepartmentBody>} req - The request object containing the department data.
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} The response indicating success or failure.
   */
  signUp = async (
    req: Request<{}, {}, DepartmentBody>,
    res: Response
  ): Promise<Response> => {
    // Create department using the provided data
    const data = await this.departmentService.createDepartment(req.body);
    // Send success response
    return res.status(200).json({
      status: true,
      data: data,
    });
  };

  /**
   * Retrieves a list of departments.
   * @async
   * @function - listDepartment
   * @param {Request} req - The request object (not used in this function).
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} The response containing the list of departments or an error message.
   */
  listDepartment = async (req: Request, res: Response): Promise<Response> => {
    // Create department using the provided data
    const data = await this.departmentService.listDepartment();
    // Send success response
    return res.status(200).json({
      status: true,
      data: data,
    });
  };

  /**
   * Deletes a department based on the provided department ID.
   * @async
   * @function - deleteDepartment
   * @param {Request<{}, {}, DepartmentDelete>} req - The request object containing the department ID in the query.
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} The response indicating success or failure.
   */
  deleteDepartment = async (
    req: Request<{}, {}, DepartmentDelete>,
    res: Response
  ): Promise<Response> => {
    // Create department using the provided data
    const data = await this.departmentService.deleteDepartment(req.query);
    // Send success response
    return res.status(200).json({
      status: true,
      data: data,
    });
  };

  /**
   * Updates a department based on the provided data.
   * @async
   * @function - updateDepartment
   * @param {Request<{}, {}, DepartmentData>} req - The request object containing the updated department data.
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} The response indicating success or failure.
   */
  updateDepartment = async (
    req: Request<{}, {}, DepartmentData>,
    res: Response
  ): Promise<Response> => {
    // Create department using the provided data
    const data = await this.departmentService.updateDepartment(req.body);
    // Send success response
    return res.status(200).json({
      status: true,
      data: data,
    });
  };
}
