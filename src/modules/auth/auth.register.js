const { 
    findUserByEmail,
    validatePassword,
    createUser,
    findUserByReferId } = require('../user/user.service');
const { processCommissionFee } = require('../commission/commission.service');

const registerService = {
    /**
     * Register a new user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} name - User name
     * @returns {Object} - Success status and message
     */
    async register(email, password, name, refer_id) {
        try {
            console.log('🔍 Checking if user already exists with email:', email)
            const existingUser = await findUserByEmail(email)
            if (existingUser) {
                console.log('❌ User already exists with email:', email)
                return {
                    success: false,
                    message: 'User already exists'
                }
            }

            
            // Here you would normally hash the password and save the user to the database
            console.log('✅ Registering new user:', email)
            
            let referrer_uuid = null;
            if(refer_id){
                console.log('🔗 Referral ID provided:', refer_id)
                // Handle referral logic here (e.g., credit referrer)
                const referrer = await findUserByReferId(refer_id);
                if(referrer){
                    console.log('✅ Valid referrer found:', referrer.email);
                    // Implement referral credit logic as needed
                    referrer_uuid = referrer.referral_uuid;
                    processCommissionFee(referrer.id);
                } else {
                    console.log('❌ Invalid referral ID:', refer_id);
                }
            }
            user = await createUser({ email, password, name, referrer_uuid });
            return {
                success: true,
                message: 'Registration successful',
                user : user
            }
        }
        catch (error) {
            console.error('❌ Registration error:', error)
            return {
                success: false,
                message: 'Registration failed'
            }
        }
    },
}

module.exports = registerService;
