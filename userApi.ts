import { Request, Response } from "express";
import AppDataSource from "../../database";
import { User } from "../entity/User";

export const createUser = async (req: Request, res: Response) => {
    const { name, mobilenumber, address } = req.body;

  try {
    const userRepository = AppDataSource.getRepository(User);

    // Check if the mobile number already exists
    const existingUser = await userRepository.findOneBy({ mobilenumber });
    if (existingUser) {
       res.status(400).json({ error: "Mobile number already exists" });
    }

    // Create and save the user
    const newUser = userRepository.create({ name, mobilenumber, address
    });
    const savedUser = await userRepository.save(newUser);

    res.status(201).json(savedUser);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
  // const user = new User();
  // user.name = req.body.name;
  // user.address=req.body.address;
  // user.mobilenumber=req.body.mobilenumber;
  // await AppDataSource.manager.save(user);
  // res.send(user);
};

export const getAllUsers = async (req:Request, res:Response) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
  
      // Fetch all users and include their associated posts
      const users = await userRepository.find({ relations: ["posts"] });
  
      res.status(200).json(users);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  
  
}