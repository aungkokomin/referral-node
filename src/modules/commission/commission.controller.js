const commissionService = require('./commission.service');

const commissionController = {
    // List all commission logs
    async commissionLogList(req, res) {
        try {
            const commissions = await commissionService.getAllCommissions();
            res.json(commissions);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching commission logs', error });
        }
    },

    async showCommissiongLog(req, res) {
        try {
            const commissionId = req.params.id;
            const commission = await commissionService.getCommissionById(commissionId);
            if (!commission) {
                return res.status(404).json({ message: 'Commission log not found' });
            }
            res.json(commission);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching commission log', error });
        }
    },

    async createCommissionLog(req, res) {
        try {
            const { userId } = req.params;
            const commissionData = req.body;
            const newCommission = await commissionService.createCommissionLog(userId, commissionData);
            res.status(201).json(newCommission);
        } catch (error) {
            res.status(500).json({ message: 'Error creating commission log', error });
        }
    }
}

module.exports = commissionController;