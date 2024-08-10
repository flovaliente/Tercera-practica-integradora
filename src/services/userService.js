import UserRepository from "../dao/repositories/UserRepository.js";
import CartRepository from "../dao/repositories/CartRepository.js";
import { isValidPassword } from "../utils/functionsUtils.js";
import { generateToken } from "../utils/utils.js";
import { transport } from "../utils/mailUtil.js"; 

const userManager = new UserRepository();
const cartManager = new CartRepository();

const registerUser = async (user) =>{
    try {
            if(user.email == 'adminCoder@coder.com' && user.password && isValidPassword(user, 'adminCod3r123')){
                
                const result = await userManager.createUser(user);
                result.role = 'admin';
                result.save();
                return result;
            }
            // Creo nuevo cart para el user
            const cart = await cartManager.createCart();
            console.log("User en service: ", user);
            console.log("Cart en service: ", cart);
            const result = await userManager.registerUser({
                ...user,
                cart: cart._id
            });
            
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Registration error.`);
        }
}

const loginUser = async (email, password) =>{
    try {
        const user = await userManager.findUserByEmail(email);
        //console.log("Password en Service: ", password);
        //console.log("Password de user en Service", user.password);
        if(!user || !isValidPassword(user, password)){
            throw new Error('Invalid credentials');
        }

        const accessToken = generateToken(user);
        return accessToken;
    } catch (error) {
        console.error("Login error: ", error.message);
        throw new Error('Login error');
    }
    
}

const getUser = async (uid) =>{
    try {
        return await userManager.getUser(uid);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error trying to get user.');
    }
    
}

const findUserByToken = async (token) =>{
    try {
        return await userManager.findUserByToken(token);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error trying to get user.');
    } 
}

const switchRole = async (uid, newRole) =>{
    try {
        const user = await userManager.switchRole(uid, newRole);
        return generateToken(user); //Ya retorno el token asi lo guardo en la cookie en el controller
    } catch (error) {
        console.error(error.message);
        throw new Error('Error trying to switch user role.');
    }
}

const sendRecoveryEmail = async (email) =>{
    try {
        const user = await userManager.findUserByEmail(email);
        if (!user){
            throw new Error('Unregistered user.');
        }

        //Genero token de 1h
        const token = generateToken(user.email);
        console.log('Token: ', token);
        const mail = {
            from: "Valsaa <flovaliente143@gmail.com>",
            to: email,
            subjet: "Password recovery",
            html: `
                <h1>VALSAA</h1>
                <h2>Password recovery</h2>
                <p><b>If you have not requested this email, ignore it.</b></p>
                <p>To reset your password, click the following link:</p>
                <a href="http://localhost:8080/recover/${token}">Reset</a>
            `
        };
        return await transport.sendMail(mail);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error trying to send recovery password email.');
    }
}

const updatePassword = async (uid, newPassword) =>{
    try {
        await userManager.updatePassword(uid, newPassword);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error while updating password.');
    }
}

export default {
    registerUser,
    loginUser,
    getUser,
    switchRole,
    sendRecoveryEmail,
    findUserByToken,
    updatePassword
};