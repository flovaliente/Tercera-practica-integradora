import { Router } from 'express';
import passport from 'passport';

import userController from '../controllers/userController.js';
//import { passportCall } from '../utils/authUtil.js';
import { authorization } from '../middlewares/auth.js';

const router = Router();
//Registro usuario
router.post('/register', passport.authenticate("register", { failureRedirect: "/api/users/failRegister" }), userController.register);

router.get('/failRegister', userController.failRegister);

//Login usuario
router.post("/login", userController.login);

router.get('/failLogin', userController.failLogin);

//Logout usuario
router.get('/logout', userController.logout);

//Login con github
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }), userController.github);

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), userController.githubcallback);

//Obtengo el usuario (token) extraido de la cookie
router.get('/current', passport.authenticate("jwt", { session: false }), authorization('User'), userController.current);

//Cambio rol de Premium a User y viceversa
router.put('/premium/:uid', passport.authenticate("jwt", { session: false }), authorization(['User', 'Premium']), userController.switchRole);

export default router;