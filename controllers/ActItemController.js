import ActModel from "../models/Act.js";
import ActItemModel from "../models/ActItem.js";

export const createItem = async (req, res) => {
  try {
    const actId = req.params.id;
    const { name, inventoryNumber, unit, quantity, initialValue, sum, note } =
      req.body;

    const newActItem = new ActItemModel({
      name,
      inventoryNumber,
      unit,
      quantity,
      initialValue,
      sum,
      note,
    });

    const savedActItem = await newActItem.save();

    const updatedAct = await ActModel.findByIdAndUpdate(
      actId,
      { $push: { items: savedActItem._id } },
      { new: true }
    ).exec();

    if (updatedAct) {
      res.json(updatedAct);
    } else {
      res.status(404).json({
        success: false,
        message: "act_not_found",
      });
    }
  } catch (error) {
    console.error("create_item_failed", error);
    res.status(500).json({
      success: false,
      error,
      message: "create_item_failed",
    });
  }
};

export const getActItemById = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const actItem = await ActItemModel.findById(itemId).exec();

    if (actItem) {
      res.json(actItem);
    } else {
      res.status(404).json({
        success: false,
        message: "act_item_not_found",
      });
    }
  } catch (error) {
    console.error("get_act_item_by_id_failed", error);
    res.status(500).json({
      success: false,
      error,
      message: "get_act_item_by_id_failed",
    });
  }
};

export const getItems = async (req, res) => {
  try {
    const actId = req.params.id;

    const act = await ActModel.findById(actId).select("items").exec();

    if (act) {
      res.json(act.items);
    } else {
      res.status(404).json({
        success: false,
        message: "act_not_found",
      });
    }
  } catch (error) {
    console.error("get_items_failed", error);
    res.status(500).json({
      success: false,
      error,
      message: "get_items_failed",
    });
  }
};

export const getAllItemsByActId = async (req, res) => {
  try {
    const actId = req.params.id;

    const actWithItems = await ActModel.findById(actId)
      .populate({
        path: "items",
        model: "ActItem",
      })
      .exec();

    if (actWithItems) {
      res.json(actWithItems.items);
    } else {
      res.status(404).json({
        success: false,
        message: "act_not_found",
      });
    }
  } catch (error) {
    console.error("get_all_items_by_act_id_failed", error);
    res.status(500).json({
      success: false,
      error,
      message: "get_all_items_by_act_id_failed",
    });
  }
};

export const updateItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    await ActItemModel.updateOne(
      {
        _id: itemId,
      },
      {
        name: req.body.name,
        inventoryNumber: req.body.inventoryNumber,
        unit: req.body.unit,
        quantity: req.body.quantity,
        initialValue: req.body.initialValue,
        sum: req.body.sum,
        note: req.body.note,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.error("update_act_item_failed", error);
    res.status(500).json({
      success: false,
      error,
      message: "update_item_failed",
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const actId = req.params.actId;
    const itemId = req.params.itemId;

    const updatedAct = await ActModel.findByIdAndUpdate(
      actId,
      { $pull: { items: { $in: [itemId] } } },
      { new: true }
    ).exec();

    if (updatedAct) {
      ActItemModel.findOneAndDelete(
        {
          _id: itemId,
        },
        (error, doc) => {
          if (error) {
            console.error("act_item_remove_failed", error);
            res.status(500).json({
              success: false,
              error,
              message: "act_item_remove_failed",
            });
          } else if (!doc) {
            res.status(404).json({
              success: false,
              message: "act_item_not_found",
            });
          } else {
            res.json({
              success: true,
            });
          }
        }
      );
    } else {
      res.status(404).json({
        success: false,
        message: "act_or_item_not_found",
      });
    }
  } catch (error) {
    console.error("delete_item_failed", error);
    res.status(500).json({
      success: false,
      error,
      message: "delete_item_failed",
    });
  }
};
