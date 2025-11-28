const userService = require('./user.service');

const userController = {
    async index(req, res, next){
        try {
            console.log('Fetching all users');
            
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    },

    async show(req, res, next){
        try{
            const userId = req.params.id;
            const user = await userService.getUserById(userId);
            if(!user){
                return res.status(404).json({message: 'User not found'});
            }
            res.status(200).json(user);
            
        } catch (error){
            next(error);
        }
    },
    async create(req, res, next){
        try{
            // want to validate the request body here
            const validateData = await userService.validateUserData(req.body);
            const newUser = await userService.createUser(validateData);
            res.status(201).json(newUser);
        }catch (error){
            next(error);
        }
    },
    async update(req, res, next){
        try{
            const userId = req.params.id;
            const validateData = await userService.validateUserData(req.body, true);
            const updatedUser = await userService.updateUser(userId, validateData);
            if(!updatedUser){
                return res.status(404).json({message: 'User not found'});
            }
            res.status(200).json(updatedUser);
        }catch (error){
            next(error);
        }
    },
    async delete(req, res, next){
        try{
            const userId = req.params.id;
            const deleted = await userService.deleteUser(userId);
            if(!deleted){
                return res.status(404).json({message: 'User not found'});
            }
            res.status(204).send();
        }catch (error){
            next(error);
        }
    }
}

module.exports = userController; // export the userController