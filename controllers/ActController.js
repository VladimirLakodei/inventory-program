import ActModel from "../models/Act.js";

export const getOne = async (req, res) => {
    try {
        const actId = req.params.id;

        const act = await ActModel.findById(actId)
            .populate({path:'user', select:['_id', 'email', 'firstName', 'lastName', 'middleName']})
            .exec();

        if (act) {
            res.json(act);
        } else {
            res.status(404).json({
                success: false,
                message: 'act_not_found'
            });
        }
    } catch (error) {
        console.error('act_get_one_failed', error);
        res.status(500).json({
            success: false,
            error,
            message: 'act_get_one_failed'
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const acts = await ActModel
            .find()
            .populate({path:'user', select:['_id', 'email', 'firstName', 'lastName', 'middleName']})
            .exec();

        res.json(acts);
    } catch (error) {
        console.error('act_get_all_failed', error);
        res.status(500).json({
            success: false,
            error,
            message: 'act_get_all_failed'
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new ActModel({
            number: req.body.number,
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            materiallyResponsible: req.body.materiallyResponsible,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (error) {
        console.error('act_create_failed', error);
        res.status(500).json({
            success: false,
            error,
            message: 'act_create_failed'
        });
    }
}

export const update = async (req, res) => {
    try {
        const actId = req.params.id;

        await ActModel.updateOne(
        {
            _id: actId
        },
        {
            number: req.body.number,
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            materiallyResponsible: req.body.materiallyResponsible,
        });

        res.json({
            success: true
        });
    } catch (error) {
        console.error('act_update_failed', error);
        res.status(500).json({
            success: false,
            error,
            message: 'act_update_failed'
        });
    }
}

export const remove = async (req, res) => {
    try {
        const actId = req.params.id;

        ActModel.findOneAndDelete({
            _id: actId
        }, (error, doc) => {
            if (error) {
                console.error('act_remove_failed', error);
                res.status(500).json({
                    success: false,
                    error,
                    message: 'act_remove_failed'
                });
            } else if (!doc) {
                res.status(404).json({
                    success: false,
                    message: 'act_not_found'
                });
            } else {
                res.json({
                    success: true
                });
            }
        });
    } catch (error) {
        console.error('act_remove_failed', error);
        res.status(500).json({
            success: false,
            error,
            message: 'act_remove_failed'
        });
    }
}
