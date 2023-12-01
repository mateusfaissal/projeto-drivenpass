import { User } from "@/protocols";
import Joi from "joi";


export const createUser = Joi.object<User>({
    email: Joi.string().email().required(),
    password: Joi.string().min(10).required()
})