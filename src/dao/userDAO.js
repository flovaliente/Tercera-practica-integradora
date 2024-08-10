import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

import userModel from "./models/userModel.js";

const secretKey = process.env.SECRET_KEY;

export default class UserDao{
    createUser = async (user) =>{
        try {
            return await userModel.create(user);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    getUser = async (uid) =>{
        try {
            return await userModel.findById(uid);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    findUserByIdAndUpdate = async (uid, cid) =>{
        try {
            return await userModel.findByIdAndUpdate(uid, { cart: cid });
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    findUserByEmail = async (email) =>{
        try {
            return await userModel.findOne({ email }).lean();
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    findUserByToken = async (token) =>{
        try {
            const user = jwt.verify(token, secretKey);
            console.log('User en userDAO: ', user);
            const email = user.user;
            return await userModel.findOne({ email }).lean();
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    switchRole = async (uid, newRole) =>{
        try {
            return await userModel.findByIdAndUpdate(uid, { role: newRole }, { new: true }); //New para que me devuelva el usuario actualizado
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    updatePassword = async (uid, newPassword) =>{
        try {
            const user = await userModel.findByIdAndUpdate(uid, { password: newPassword }, { new: true }); //New para que me devuelva el usuario actualizado
            return user.save();
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }
}