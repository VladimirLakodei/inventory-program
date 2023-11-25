import mongoose from "mongoose";

const ActItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    inventoryNumber: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    initialValue: {
      type: Number,
      required: true,
    },
    sum: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ActItem", ActItemSchema);
