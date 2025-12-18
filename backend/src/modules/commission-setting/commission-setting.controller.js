const commissionSettingService = require('./commission-setting.service');

const commissionSettingController = {
    async getAllCommissionSettings(req, res, next) {
        try {
            console.log('Fetching all commission settings');
            const settings = await commissionSettingService.getAllCommissionSettings();
            res.status(200).json(settings);
        }
        catch (error) {
            next(error);
        }
    },

    async getCommissionSettingById(req, res, next) {
        try {
            const settingId = req.params.id;
            const setting = await commissionSettingService.getCommissionSettingById(settingId);
            if (!setting) {
                return res.status(404).json({ message: 'Commission setting not found' });
            }
            res.status(200).json(setting);
        } catch (error) {
            next(error);
        }
    },

    async createCommissionSetting(req, res, next) {
        try {
            const newSetting = await commissionSettingService.createCommissionSetting(req.body);
            res.status(201).json(newSetting);
        } catch (error) {
            next(error);
        }
    },

    async updateCommissionSetting(req, res, next) {
        try {
            const settingId = req.params.id;
            const updatedSetting = await commissionSettingService.updateCommissionSetting(settingId, req.body);
            if (!updatedSetting) {
                return res.status(404).json({ message: 'Commission setting not found'
                });
            }
            res.status(200).json(updatedSetting);
        } catch (error) {
            next(error);
        }
    },

    async deleteCommissionSetting(req, res, next) {
        try {
            const settingId = req.params.id;
            const deletedSetting = await commissionSettingService.deleteCommissionSetting(settingId);
            if (!deletedSetting) {
                return res.status(404).json({ message: 'Commission setting not found' });
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },
}

module.exports = commissionSettingController;