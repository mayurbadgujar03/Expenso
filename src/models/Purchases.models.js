import mongoose from "mongoose";

const purchasesSchema = Schema({}, {});

export const Purchases = mongoose.model("Purchases", purchasesSchema);