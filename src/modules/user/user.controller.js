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
    },
    async changePassword(req, res, next){
        try {
            const userId = req.params.id;
            const { newPassword } = req.body;
            if (!newPassword) {
                return res.status(400).json({ message: 'New password is required' });
            }
            const updatedUser = await userService.updatePassword(userId, newPassword);
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            next(error);
        }
    },
    async generateReferralUrl(req, res, next){
        try {
            const userId = req.user.id;
            const referralUrl = await userService.generateReferralUrl(userId);
            res.status(200).json({ referralUrl });
        } catch (error) {
            next(error);
        }
    },
}

module.exports = userController; // export the userController