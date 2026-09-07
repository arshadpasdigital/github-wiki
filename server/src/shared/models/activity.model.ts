import { model, Schema, Types, type HydratedDocument } from "mongoose";

export enum ActivityTone {
  Green = "green",
  Cyan = "cyan",
  Amber = "amber",
  Red = "red",
  Muted = "muted",
}

export interface IActivity {
  userId: Types.ObjectId;
  repoId: Types.ObjectId | null;
  repository: string;
  action: string;
  detail: string | null;
  tone: ActivityTone;
  createdAt?: Date;
  updatedAt?: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "userId is required"],
      index: true,
    },
    repoId: {
      type: Schema.Types.ObjectId,
      ref: "repo",
      default: null,
    },
    repository: {
      type: String,
      required: [true, "repository is required"],
      trim: true,
    },
    action: {
      type: String,
      required: [true, "action is required"],
      trim: true,
    },
    detail: {
      type: String,
      default: null,
      trim: true,
    },
    tone: {
      type: String,
      enum: Object.values(ActivityTone),
      default: ActivityTone.Muted,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

activitySchema.index({ userId: 1, createdAt: -1 });

export type ActivityDocument = HydratedDocument<IActivity>;
export const ActivityModel = model<IActivity>("Activity", activitySchema);