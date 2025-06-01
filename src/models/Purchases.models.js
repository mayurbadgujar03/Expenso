import mongoose, {Schema} from "mongoose";

const purchasesSchema = new Schema(
    {
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        item: {
            type: Schema.Types.ObjectId,
            ref: "Item",
            required: true,
        },
        quantity: {
            type: String,
        },
        total_price: {
            type: String,
        }
    }, 
    {
        timestamps: true,
    }
);

export const Purchases = mongoose.model("Purchases", purchasesSchema);