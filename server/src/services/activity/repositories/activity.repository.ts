import {
    ActivityModel,
    type ActivityDocument,
    type IActivity,
} from "@/shared/models/activity.model";

export interface ActivityRepositoryContract {
    findRecent(userId: string, limit: number): Promise<ActivityDocument[]>;
    bulkInsert(docs: IActivity[]): Promise<ActivityDocument[]>;
}

export class ActivityRepository implements ActivityRepositoryContract {
    async findRecent(userId: string, limit: number): Promise<ActivityDocument[]> {
        return ActivityModel.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }

    async bulkInsert(docs: IActivity[]): Promise<ActivityDocument[]> {
        if (docs.length === 0) {
            return [];
        }

        return ActivityModel.insertMany(docs);
    }
}
