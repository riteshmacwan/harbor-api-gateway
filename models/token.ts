import { Schema, Document, Model, model } from "mongoose";
import { TokenBody } from "../types/token";

/**
 * Interface representing a script category document.
 */
type IToken = TokenBody & Document;

const TokenSchema: Schema<IToken> = new Schema<IToken>(
  {
    user_id: {
      required: true,
      ref: "users",
      type: Schema.Types.ObjectId,
    },
    platform: {
      required: true,
      type: String,
      enum: ["app", "web"],
    },
  },

  {
    /**
     * Specifies the collection name.
     */
    timestamps: true,
    collection: "tokens",
  }
);

export const Token: Model<IToken> = model<IToken>("Token", TokenSchema);
