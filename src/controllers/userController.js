import userService from '../services/userService.js';

const register = async (req, res) =>{
    try {
        const user = req.body;
        const result = await userService.registerUser(user);
        res.redirect('/login');
    } catch (error) {
        res.redirect('/register');
    }
}

const failRegister = (req, res) =>{
    res.status(400).send({
        status: "error",
        message: "Filed register"
    });
}

const login = async (req, res) =>{
    const { email, password } = req.body; 
    try {
         req.session.failLogin = false;
        const accessToken = await userService.loginUser(email, password);

        res.cookie('accessToken', accessToken , { maxAge: 60*60*1000, httpOnly: true });
        console.log('Login exitoso!');
        return res.redirect("/products");
     } catch (error) {
         console.log('Error durante el login. Error: ', error.message);
         req.session.failLogin = true;
         return res.redirect("/login");
     }
     
 }

const failLogin = (req, res) =>{
    res.status(400).send({
        status: "error",
        message: "Filed login"
    });
}

const logout = async (req, res) =>{
    req.session.destroy( error =>{
        res.clearCookie("accessToken");
        res.redirect("/login");
    });
}

const github = (req, res) =>{
    res.send({
        status: 'success',
        message: 'Success'
    });
}

const githubcallback = (req, res) =>{
    req.session.user = req.user;
    res.redirect('/products');
}

const current = (req, res) =>{
    res.send({
        status: 'success',
        user: req.user
    });
}

//Preguntar si deberia actualizar el token o no, porque no me lo actualiza bien creo
const switchRole = async (req, res) =>{
    try {
        const { uid } = req.params;
        const user = await userService.getUser(uid);
        const role = user.role == 'Premium' ? 'User' : 'Premium';

        const accessToken = await userService.switchRole(uid, role);
        res.cookie("accessToken", accessToken, { maxAge: 60*60*1000, httpOnly: true });//Guardo el token en la cookie

        res.status(200).send({
            status: 'success',
            newToken: accessToken 
        });
    } catch (error) {
        req.logger.error('Error updating role.');
        res.status(500).send({
            status: 'error',
            message: error.message
        });
    }
}



export default {
    register,
    failRegister,
    login,
    failLogin,
    logout,
    github,
    githubcallback,
    current,
    switchRole
};