import { Router } from 'express';
import passport from 'passport';

import indexController from '../controllers/indexController.js';

const router = Router();

router.get('/', indexController.welcome);

router.get('/register', indexController.register);

router.get('/products', indexController.products);

router.get('/cart', indexController.cart);

router.get('/realtimeproducts', indexController.realtimeproducts);

router.get('/login', indexController.login);

router.get('/user', passport.authenticate('jwt', { session: false }), indexController.user);

router.get('/mockingproducts', indexController.mockingproducts);

router.get('/loggertest', indexController.loggertest);

router.get('/unauthorized', indexController.unauthorized);

//Send email
router.get("/send/mail", indexController.sendEmail);

//Recover password request
router.get('/recover', indexController.recoverPasswordRequest);

//Recover password
router.post('/recover', indexController.recoverPassword);

router.get('/recover/:token', indexController.recoverToken);

router.post('/changePassword', indexController.changePassword);

export default router;